# Loja da Super Borracha Líquida: como colocar no ar

A loja fica em `loja/index.html`. O pagamento roda em duas funções na Netlify:

- `netlify/functions/criar-pagamento.mjs` cria a cobrança no Mercado Pago.
- `netlify/functions/mercadopago-webhook.mjs` recebe o aviso de pagamento aprovado e avisa o BotConversa.

## Como o pedido anda

1. O cliente monta o carrinho, escolhe entrega ou retirada e PIX, cartão ou boleto, informa nome e WhatsApp e clica em **Pagar agora**.
2. A função `criar-pagamento` calcula o valor com os preços de `netlify/lib/catalogo.mjs`, nunca com o que vem do navegador, e abre o pagamento no Mercado Pago.
3. O cliente paga e volta para a loja, que mostra "Pagamento aprovado".
4. O Mercado Pago avisa a função `mercadopago-webhook`. Ela confere o pagamento direto no Mercado Pago e, se estiver aprovado, manda o pedido para o BotConversa.
5. O fluxo do BotConversa manda a confirmação no WhatsApp do cliente e avisa a equipe.

## Passo a passo

### 1. Netlify
1. Na Netlify: **Add new site → Import an existing project → GitHub** e escolha este repositório.
   O `netlify.toml` já diz o que publicar. Não precisa mudar nada na tela de build.
2. Em **Domain management**, ligue um subdomínio, por exemplo `loja.telhadistaabc.com.br`.
   No site principal, aponte os botões "Comprar" para esse endereço.

### 2. Mercado Pago
1. Crie ou entre na conta de vendedor e abra **Suas integrações → Criar aplicação** (produto: Checkout Pro).
2. Copie o **Access Token de produção** (começa com `APP_USR-`).
3. Na Netlify: **Site configuration → Environment variables**, crie `MP_ACCESS_TOKEN` com esse valor.
4. Para o "3x sem juros": no Mercado Pago, ative em **Seu negócio → Custos → Parcelamento sem juros** (a taxa do parcelamento passa a ser sua).

### 3. BotConversa
1. Crie um fluxo "Pedido pago" que comece por **Webhook** (integração de entrada) e copie a URL do webhook.
2. Na Netlify, crie a variável `BOTCONVERSA_WEBHOOK_URL` com essa URL.
3. Mapeie os campos que chegam no webhook:
   `telefone` (5511999999999), `nome`, `pedido`, `itens`, `total`, `pagamento`, `entrega`, `endereco`.
4. No fluxo: identifique o contato pelo `telefone`, mande a confirmação ao cliente, aplique uma etiqueta "comprou-balde" e avise a equipe.
5. Depois de cadastrar as variáveis, faça um novo deploy na Netlify (**Deploys → Trigger deploy**).

### 4. Teste
Use as credenciais de teste do Mercado Pago (Access Token de teste e cartões de teste) antes de trocar pelo token de produção.

## Onde mudar o quê

| O quê | Onde |
|---|---|
| Preços, frete, desconto PIX, parcelas | `loja/index.html` (bloco CONFIG) **e** `netlify/lib/catalogo.mjs` (os dois iguais) |
| Liberar a venda online da Premium | `vendaOnline: true` nos dois arquivos |
| WhatsApp, endereço e horário de retirada | `loja/index.html` (bloco CONFIG) |
| Fotos | `loja/index.html` (bloco IMG) |
