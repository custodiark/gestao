(function () {
  "use strict";

  const config = window.CUSTODIO_CONFIG || {};
  const email = config.email && config.email.general ? config.email.general.trim() : "";
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-menu]");

  function getSiteUrl() {
    const domain = typeof config.domain === "string" ? config.domain.trim().replace(/^https?:\/\//, "").replace(/\/$/, "") : "";
    return domain ? "https://" + domain : "";
  }

  function isValidExternalUrl(value) {
    try {
      const url = new URL(value);
      return url.protocol === "https:" || url.protocol === "http:";
    } catch (error) {
      return false;
    }
  }

  function setEmailLinks() {
    document.querySelectorAll("[data-contact-email]").forEach((link) => {
      if (!email) {
        link.hidden = true;
        return;
      }
      link.href = "mailto:" + encodeURIComponent(email);
      if (link.matches(".footer-contact a")) link.textContent = email;
      link.hidden = false;
    });
  }

  function setOptionalLink(selector, url) {
    const isConfigured = typeof url === "string" && url.trim() && isValidExternalUrl(url.trim());
    document.querySelectorAll(selector).forEach((link) => {
      if (!isConfigured) {
        link.hidden = true;
        return;
      }
      link.href = url.trim();
      link.hidden = false;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    });
  }

  function setPrice() {
    const price = config.price || {};
    const priceSection = document.querySelector("[data-price-section]");
    const priceValue = document.querySelector("[data-price-value]");
    if (priceSection && price.show === true && typeof price.value === "string" && price.value.trim()) {
      priceSection.hidden = false;
      priceValue.textContent = price.value.trim();
    }
  }

  function setPhoneLink() {
    const link = document.querySelector("[data-phone-general]");
    if (!link || typeof config.phone !== "string" || !config.phone.trim()) return;

    const value = config.phone.trim();
    const dialable = value.replace(/[^+\d]/g, "");
    if (!dialable) return;

    link.href = "tel:" + dialable;
    link.append(" " + value);
    link.hidden = false;
    const container = document.querySelector("[data-phone-details]");
    if (container) container.hidden = false;
  }

  function updateMetadata() {
    const siteUrl = getSiteUrl();
    if (!siteUrl) return;

    const homeUrl = siteUrl + "/";
    const ogImageUrl = siteUrl + "/assets/og-image-placeholder.svg";
    const canonical = document.querySelector('link[rel="canonical"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    const ogImage = document.querySelector('meta[property="og:image"]');
    const twitterImage = document.querySelector('meta[name="twitter:image"]');
    const schema = document.querySelector("#structured-data");

    if (canonical) canonical.href = homeUrl;
    if (ogUrl) ogUrl.content = homeUrl;
    if (ogImage) ogImage.content = ogImageUrl;
    if (twitterImage) twitterImage.content = ogImageUrl;

    if (schema) {
      try {
        const data = JSON.parse(schema.textContent);
        data.url = homeUrl;
        schema.textContent = JSON.stringify(data);
      } catch (error) {
        // A marcação estática permanece válida caso o JSON-LD seja alterado manualmente de forma inválida.
      }
    }
  }

  function setText(selector, value) {
    if (!value) return;
    document.querySelectorAll(selector).forEach((element) => {
      element.textContent = value;
    });
  }

  function closeMenu() {
    if (!menuToggle || !menu) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
    menu.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }

  if (menuToggle && menu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
      menu.classList.toggle("is-open", !isOpen);
      document.body.classList.toggle("menu-open", !isOpen);
    });

    menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
        closeMenu();
        menuToggle.focus();
      }
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 800) closeMenu();
    });
  }

  setEmailLinks();
  setOptionalLink("[data-whatsapp-link]", config.whatsappUrl);
  setOptionalLink("[data-scheduling-link]", config.schedulingUrl);
  setPrice();
  setPhoneLink();
  updateMetadata();
  setText("[data-location]", config.location);
  setText("[data-current-year]", new Date().getFullYear());
}());