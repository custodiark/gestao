(function () {
  "use strict";

  const config = window.COSTONE_CONFIG || {};
  const email = config.email && config.email.general ? config.email.general.trim() : "";
  const emailSubject = config.email && config.email.subject ? config.email.subject.trim() : "";
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-menu]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

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
      link.href = "mailto:" + encodeURIComponent(email) + (emailSubject ? "?subject=" + encodeURIComponent(emailSubject) : "");
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

  function getAnalyticsMeasurementId() {
    const analytics = config.analytics || {};
    const measurementId = typeof analytics.measurementId === "string" ? analytics.measurementId.trim().toUpperCase() : "";
    return /^G-[A-Z0-9]+$/.test(measurementId) ? measurementId : "";
  }

  function setupAnalytics() {
    const measurementId = getAnalyticsMeasurementId();
    if (!measurementId) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", measurementId);

    const googleTag = document.createElement("script");
    googleTag.async = true;
    googleTag.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(measurementId);
    document.head.append(googleTag);

    document.querySelectorAll("[data-analytics-event]").forEach((element) => {
      element.addEventListener("click", () => {
        window.gtag("event", element.dataset.analyticsEvent, {
          link_location: element.dataset.analyticsLocation || "unspecified"
        });
      });
    });
  }


  function updateMetadata() {
    const siteUrl = getSiteUrl();
    if (!siteUrl) return;

    const pagePath = document.documentElement.dataset.pagePath || "/";
    const pageUrl = siteUrl + (pagePath.startsWith("/") ? pagePath : "/" + pagePath);
    const ogImageUrl = siteUrl + "/assets/og-image-placeholder.svg";
    const canonical = document.querySelector('link[rel="canonical"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    const ogImage = document.querySelector('meta[property="og:image"]');
    const twitterImage = document.querySelector('meta[name="twitter:image"]');
    const schema = document.querySelector("#structured-data");

    if (canonical) canonical.href = pageUrl;
    if (ogUrl) ogUrl.content = pageUrl;
    if (ogImage) ogImage.content = ogImageUrl;
    if (twitterImage) twitterImage.content = ogImageUrl;

    if (schema) {
      try {
        const data = JSON.parse(schema.textContent);
        data.url = pageUrl;
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

  function observeOnce(target, onReveal, options) {
    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      onReveal(target);
      return;
    }

    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        onReveal(entry.target);
        activeObserver.unobserve(entry.target);
      });
    }, options || { threshold: 0.18 });

    observer.observe(target);
  }

  function setupScrollReveals() {
    const groups = document.querySelectorAll(".audience-grid, .diagnostic-list, .process-list, .deliverables-card ul");

    groups.forEach((group) => {
      const items = Array.from(group.children);
      if (!items.length) return;

      group.classList.add("scroll-reveal");
      items.forEach((item, index) => {
        item.classList.add("reveal-item");
        item.style.setProperty("--reveal-delay", String(index * 70) + "ms");
      });

      observeOnce(group, (element) => element.classList.add("is-revealed"));
    });
  }

  function setupDecisionFlow() {
    const decisionFlow = document.querySelector(".decision-flow");
    if (!decisionFlow) return;

    observeOnce(decisionFlow, (element) => element.classList.add("is-revealed"), { threshold: 0.35 });
  }

  function setupFaqTransitions() {
    if (reducedMotion.matches) return;

    const faqItems = Array.from(document.querySelectorAll(".faq-list details"));
    faqItems.forEach((details) => {
      const summary = details.querySelector("summary");
      const answer = details.querySelector(":scope > p");
      if (!summary || !answer) return;

      const wrapper = document.createElement("div");
      wrapper.className = "faq-answer";
      answer.before(wrapper);
      wrapper.append(answer);
      wrapper.style.maxHeight = details.open ? wrapper.scrollHeight + "px" : "0px";

      summary.addEventListener("click", (event) => {
        event.preventDefault();

        if (details.open) {
          details.dataset.closing = "true";
          wrapper.style.maxHeight = wrapper.scrollHeight + "px";
          requestAnimationFrame(() => {
            wrapper.style.maxHeight = "0px";
          });
          return;
        }

        delete details.dataset.closing;
        details.open = true;
        wrapper.style.maxHeight = "0px";
        requestAnimationFrame(() => {
          wrapper.style.maxHeight = wrapper.scrollHeight + "px";
        });
      });

      wrapper.addEventListener("transitionend", (event) => {
        if (event.propertyName !== "max-height" || details.dataset.closing !== "true") return;
        details.open = false;
        delete details.dataset.closing;
      });
    });

    window.addEventListener("resize", () => {
      faqItems.filter((details) => details.open).forEach((details) => {
        const wrapper = details.querySelector(".faq-answer");
        if (wrapper) wrapper.style.maxHeight = wrapper.scrollHeight + "px";
      });
    });
  }

  function setupScrollStory() {
    const sections = Array.from(document.querySelectorAll("main > section:not(.hero)"));
    if (!sections.length) return;

    const progress = document.createElement("div");
    progress.className = "scroll-progress";
    progress.setAttribute("aria-hidden", "true");
    progress.innerHTML = '<span class="scroll-progress__bar"></span>';
    document.body.append(progress);

    const updateProgress = () => {
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const value = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
      document.documentElement.style.setProperty("--page-progress", String(value));
    };

    let ticking = false;
    const requestProgress = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateProgress();
        ticking = false;
      });
    };

    updateProgress();
    window.addEventListener("scroll", requestProgress, { passive: true });

    if (!("IntersectionObserver" in window)) {
      sections.forEach((section) => section.classList.add("is-story-active"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-story-active");
      });
    }, { rootMargin: "-12% 0px -22%", threshold: 0.08 });

    sections.forEach((section) => {
      section.classList.add("story-section", "story-ready");
      observer.observe(section);
    });
  }

  function setupHeroMotion() {
    const visual = document.querySelector(".hero-visual");
    if (!visual) return;

    visual.classList.add("is-motion-ready");
    if (!visual.querySelector(".vector-motion")) {
      const composition = document.createElement("div");
      composition.className = "vector-motion";
      composition.setAttribute("aria-hidden", "true");
      composition.innerHTML = '<span class="vector-motion__ring vector-motion__ring--outer"></span><span class="vector-motion__ring vector-motion__ring--inner"></span><span class="vector-motion__orbit vector-motion__orbit--one"></span><span class="vector-motion__orbit vector-motion__orbit--two"></span><span class="vector-motion__core"></span>';
      visual.append(composition);
    }

    let scrollFrame;
    const setHeroScroll = () => {
      const displacement = Math.min(window.scrollY * 0.045, 22);
      visual.style.setProperty("--hero-scroll", displacement + "px");
      scrollFrame = undefined;
    };

    const requestHeroScroll = () => {
      if (scrollFrame) return;
      scrollFrame = requestAnimationFrame(setHeroScroll);
    };

    setHeroScroll();
    window.addEventListener("scroll", requestHeroScroll, { passive: true });

    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let pointerFrame;
    visual.addEventListener("pointermove", (event) => {
      if (pointerFrame) return;
      const bounds = visual.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      pointerFrame = requestAnimationFrame(() => {
        visual.style.setProperty("--hero-tilt-x", String(-y * 3.2) + "deg");
        visual.style.setProperty("--hero-tilt-y", String(x * 4.2) + "deg");
        pointerFrame = undefined;
      });
    });

    visual.addEventListener("pointerleave", () => {
      visual.style.setProperty("--hero-tilt-x", "0deg");
      visual.style.setProperty("--hero-tilt-y", "0deg");
    });
  }

  function setupPremiumMotion() {
    if (reducedMotion.matches) return;
    document.documentElement.classList.add("motion-enabled");
    setupScrollStory();
    setupHeroMotion();
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
  setOptionalLink("[data-conversation-link]", config.whatsappUrl);
  setOptionalLink("[data-scheduling-link]", config.schedulingUrl);
  setPrice();
  setupAnalytics();
  updateMetadata();
  setText("[data-location]", config.location);
  setText("[data-current-year]", new Date().getFullYear());
  setupScrollReveals();
  setupDecisionFlow();
  setupFaqTransitions();
  setupPremiumMotion();
}());
