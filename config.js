/*
 * Central de contatos e informações editáveis.
 * Mantenha campos ainda não definidos vazios. Assim, seus botões e telefones não aparecem.
 * Ao alterar o domínio, atualize também robots.txt e sitemap.xml, que são arquivos estáticos.
 */
window.COSTONE_CONFIG = {
  // Enquanto não houver domínio próprio da COSTONE, mantenha a URL publicada no GitHub Pages.
  domain: "custodiark.github.io/gestao",
  email: {
    // Preencha apenas quando os e-mails da COSTONE estiverem definidos.
    general: "",
    rafael: "",
    gabriel: "",
    subject: "Quero responder à pergunta da COSTONE"
  },
  phone: "(71) 98314-3061",
  whatsappUrl: "https://wa.me/5571983143061",
  schedulingUrl: "",
  location: "Feira de Santana, Bahia",
  analytics: {
    // Cole aqui o ID de medição da sua propriedade GA4, no formato G-XXXXXXXXXX.
    // Enquanto estiver vazio, nenhum script do Google Analytics é carregado.
    measurementId: "G-Q4ZV3KYHLY"
  },
  price: {
    show: false,
    value: "R$ 2.000"
  }
};
