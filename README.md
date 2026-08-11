# COSTONE — site institucional

Landing page estática, desenvolvida em HTML, CSS e JavaScript puro para publicação direta no GitHub Pages.

## Estrutura

```text
custodio-site/
├── index.html
├── styles.css
├── script.js
├── config.js
├── 404.html
├── robots.txt
├── sitemap.xml
├── .nojekyll
└── assets/
    ├── favicon.svg
    ├── logo-costone.svg
    ├── foto-rafael-gabriel-placeholder.svg
    └── og-image-placeholder.svg
```

## Visualizar localmente

O site não requer instalação nem build. Abra `index.html` diretamente no navegador ou, para testar com um servidor local, use uma extensão como Live Server no VS Code.

## Alterar contatos, domínio e preço

Todos os contatos editáveis ficam centralizados em `config.js`:

- Atualize `whatsappUrl` somente com uma URL completa (`https://...`) para exibir os CTAs de WhatsApp.
- Atualize `schedulingUrl` somente com uma URL completa (`https://...`) para exibir o botão de agendamento.
- Preencha `phone` quando o número de contato for alterado; ele aparece como link de ligação na seção de contato.
- Para exibir o valor do Painel de Saúde Financeira, altere `price.show` para `true`. Por padrão, ele permanece oculto.
- Para mudar o domínio, atualize `domain` em `config.js`. Em seguida, substitua o domínio também em `robots.txt` e `sitemap.xml`, que precisam manter URLs estáticas para os mecanismos de busca.
- Para mudar o domínio, atualize `domain` em `config.js`. Em seguida, substitua o domínio também em `robots.txt` e `sitemap.xml`, que precisam manter URLs estáticas para os mecanismos de busca.

## Substituir a fotografia

1. Salve uma fotografia horizontal real de Rafael e Gabriel em `assets/`, por exemplo `assets/rafael-gabriel.jpg`.
2. Edite a tag `<img>` da seção `#responsaveis` no `index.html`.
3. Atualize o `src`, `width`, `height` e o texto `alt` para refletirem a imagem final.
4. Se usar JPG ou WebP, mantenha o arquivo otimizado antes de publicar.

Não utilize fotografia gerada por IA ou imagem de banco nessa seção.

## Publicar no GitHub Pages

1. Crie ou use um repositório no GitHub, por exemplo `costone-site`.
2. Envie o conteúdo desta pasta para a raiz do repositório.
3. No repositório, abra **Settings → Pages**.
4. Em **Build and deployment**, escolha **Deploy from a branch**.
5. Selecione a branch `main` e a pasta `/(root)`.
6. Salve e aguarde a URL de publicação do GitHub Pages.

## Configurar o domínio personalizado

1. Quando houver um domínio próprio da COSTONE, informe-o em **Settings → Pages**, em **Custom domain**.
2. No provedor do domínio, configure os registros DNS indicados pelo GitHub para o domínio raiz e, se desejar, para `www`.
3. Aguarde a propagação e ative **Enforce HTTPS** quando a opção estiver disponível.
4. Atualize `domain` em `config.js` e mantenha `canonical`, Open Graph, `robots.txt` e `sitemap.xml` apontando para o mesmo endereço.

Consulte a documentação atual do GitHub Pages antes de alterar DNS, pois os valores podem ser atualizados pelo serviço.

## Checklist antes de publicar

- [ ] Atualizar WhatsApp, agendamento e telefones quando definidos.
- [ ] Substituir a fotografia placeholder por uma fotografia real.
- [ ] Revisar e-mail geral e URLs de contato.
- [ ] Confirmar domínio, canonical e URL de Open Graph.
- [ ] Gerar uma imagem Open Graph definitiva quando houver identidade final.
- [ ] Conferir que não há preço exibido se ele ainda não deve ser público.
- [ ] Revisar o conteúdo com os responsáveis.

## Checklist de revisão móvel

- [ ] Abrir em tela estreita (320 px) e conferir o menu.
- [ ] Verificar que os textos não cortam nem provocam rolagem horizontal.
- [ ] Conferir os botões e links de e-mail.
- [ ] Abrir e fechar todas as perguntas frequentes.
- [ ] Conferir contraste em ambientes claros e escuros.

## Checklist de acessibilidade

- [ ] Navegar pelo site usando apenas Tab, Shift+Tab e Enter.
- [ ] Conferir o link “Pular para o conteúdo”.
- [ ] Verificar o foco visível em links, botões e perguntas frequentes.
- [ ] Confirmar o texto alternativo da fotografia final.
- [ ] Validar o contraste depois de qualquer alteração de cor.
- [ ] Manter títulos e ordem semântica das seções.

## Deliberadamente deixado de fora

- CNPJ, endereço comercial e qualquer dado de constituição inexistente.
- Clientes, depoimentos, cases, resultados, métricas, certificações e parceiros.
- Redes sociais vazias.
- Formulário com armazenamento de dados, analytics, pixels e cookies de publicidade.
- Preço público por padrão.
- Fotografias geradas por IA, fotos de banco, gráficos ou resultados fictícios.
- Promessas de economia, lucro, crescimento ou resultado garantido.
