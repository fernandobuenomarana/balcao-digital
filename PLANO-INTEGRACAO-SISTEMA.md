# Plano de integração: loja, BotConversa e totem facial no Sistema Telhadista ABC

Documento de passagem para a sessão que cuida do **Sistema Telhadista ABC** (CRM e painel da TV).
Junta tudo o que foi decidido na sessão "E-commerce impermeabilizante sofisticado" (13/11/2026).

**Código pronto:** repositório `fernandobuenomarana/balcao-digital`, branch `claude/magical-babbage-rsi54c`.

---

## 0. Contexto do negócio

- **O Telhadista ABC** faz telhados, coberturas e impermeabilização no Grande ABC (SP). Site: telhadistaabc.com.br (hospedado na Netlify).
- Tem marca própria de impermeabilizante:
  - **Super Borracha Líquida:** balde de 20 kg, base água, alta elasticidade. Serve para telhados, lajes, calhas, paredes e caixa d'água.
  - **Linha Premium (lançamento):** borracha mais espessa, com balde novo ainda em produção. O nome definitivo ainda não foi escolhido.
  - **Cores:** terracota, cinza e branco.
- **Identidade visual:** azul-marinho `#0a1222`, vermelho `#d7193a` e `#a5112c`, rosa de destaque `#f0718c`, fonte Poppins.
- **Ferramentas atuais:** CRM próprio com um **painel numa TV** (os funcionários escaneiam QR Code e recebem as informações da obra), **BotConversa** no WhatsApp e site na **Netlify**.
- **Rotina da equipe:** todo funcionário passa **primeiro pela base**, pega o caminhão da empresa e os materiais, recebe as instruções e encontra a equipe.
- **Ponto hoje:** relógio de digital. As batidas são baixadas por pendrive todo mês.

---

## 1. Loja online (pronta)

Arquivo: `loja/index.html`. É uma página única, com as fotos embutidas, que funciona sozinha.

**O que já tem:**
- Abertura com o balde real, chuva animada e frases do site ("Nossa experiência em telhados").
- **Casa interativa** com 7 pontos de infiltração: telhado, calhas e rufos, laje, caixa d'água, parede e muro, áreas molhadas, baldrame. Cada ponto mostra o problema, a solução, as demãos e o consumo, além de um botão "Sem proteção / Com proteção".
- Benefícios do site (custo-benefício, até 6 °C a menos*, até 10 anos a mais de vida útil*, aparência renovada, menos entulho), fotos reais de obra e um quadro sobre a **Técnica de Bidim**.
- **Escolha de linha** (Tradicional ou Premium), embalagem e cor, preço "de/por", preço no PIX e "3x sem juros".
- **Calculadora:** área (ou comprimento × largura), linha e número de demãos dão o total em kg e o kit de baldes mais barato, que vai direto para o carrinho.
- **Carrinho:** receber em casa (CEP pela ViaCEP) ou retirar na loja; PIX, cartão 3x ou boleto; nome e WhatsApp; botão **Pagar agora** (Mercado Pago) e opção de fechar pelo WhatsApp.
- Volta do pagamento com tela de "aprovado", "pendente" ou "não concluído".
- Comparativo, perguntas frequentes e chamada "Avaliar meu telhado", que leva ao WhatsApp para vender o serviço.

**Regras definidas:**

| Item | Valor atual | Situação |
|---|---|---|
| Tradicional, balde de 20 kg | R$ 389,90 (de R$ 449,90) | Custo do dono: **R$ 215** |
| Premium, balde de 20 kg | R$ 489,90 (de R$ 559,90) | Falta o custo; regra: custo × ~1,8 |
| Desconto no PIX | 5% | |
| Cartão | até 3x sem juros | Ativar o parcelamento sem juros na conta do Mercado Pago |
| Frete | grátis nas 7 cidades do ABC; R$ 39,90 no resto de SP; fora de SP, a combinar pelo WhatsApp | |
| Retirada na loja | grátis | Falta endereço e horário (por enquanto, "combinado no WhatsApp") |
| Venda online da Premium | **bloqueada** (pré-venda pelo WhatsApp) | Liberar com `vendaOnline: true` quando o balde chegar |
| Consumo | Tradicional 0,45 kg/m² por demão; Premium 0,6 | **Valores provisórios**, confirmar na ficha técnica |

**Análise de preço** (por balde, preço de R$ 389,90): produto R$ 215, imposto ~6%, taxa ou desconto ~5%, entrega ~R$ 20, anúncio ~R$ 35 e perdas ~R$ 5. **Lucro de ~R$ 72 (18%).** O ponto de equilíbrio fica perto de R$ 305.
Sugestões que ainda não entraram na loja:
- desconto a partir de 3 baldes (~R$ 369,90 cada);
- tabela para profissionais (~R$ 319);
- no Mercado Livre, preço R$ 50 a R$ 70 maior por causa da comissão.

**Onde trocar as coisas:**
- Bloco `CONFIG` em `loja/index.html`: WhatsApp (por enquanto **número falso**, `5511900000000`), preços, frete, cores, linhas e retirada.
- Bloco `IMG`: fotos em base64. **Falta a foto do balde Premium.**

---

## 2. Pagamento (Netlify + Mercado Pago), pronto

- `netlify.toml`: publica a pasta `loja/` e as funções de `netlify/functions/`.
- `netlify/lib/catalogo.mjs`: **preços do servidor.** O valor cobrado sai daqui, nunca do navegador. Precisa ficar igual ao `CONFIG` da página.
- `netlify/functions/criar-pagamento.mjs` (`POST /api/criar-pagamento`):
  - confere os itens, o nome e o WhatsApp;
  - recalcula o frete pela ViaCEP;
  - aplica o desconto do PIX;
  - limita as formas de pagamento conforme a escolha (só PIX, só cartão até 3x, ou só boleto);
  - cria a preferência no Checkout Pro com `metadata` (pedido, nome, telefone 55DDDNÚMERO, entrega, endereço, itens, total) e devolve o `init_point`.
- `netlify/functions/mercadopago-webhook.mjs` (`POST /api/mercadopago-webhook`):
  - busca o pagamento em `GET /v1/payments/{id}`;
  - se o status for `approved`, envia um JSON para `BOTCONVERSA_WEBHOOK_URL`.
- **Variáveis de ambiente:** `MP_ACCESS_TOKEN` e `BOTCONVERSA_WEBHOOK_URL`.
- Testado com Mercado Pago e BotConversa simulados. Casos testados:
  - PIX, cartão e boleto;
  - ABC, capital, fora de SP e retirada;
  - Premium bloqueada, preço adulterado e telefone inválido;
  - aviso só quando o pagamento é aprovado.
- **Ainda não testado com credenciais reais.**
- **Melhorias pendentes:**
  - evitar aviso em dobro (o Mercado Pago pode repetir o webhook): guardar os IDs já processados, por exemplo no Netlify Blobs ou no CRM;
  - validar a assinatura `x-signature` do webhook;
  - enviar o pedido pago também para o **CRM**.

**JSON enviado ao BotConversa e que deve ir também ao CRM:**
```json
{ "evento": "pedido_pago", "pedido": "TAxxxx", "nome": "...", "telefone": "5511999999999",
  "entrega": "Entrega em Santo André/SP | Retirar na loja", "endereco": "...",
  "itens": "2x Super Borracha Líquida 20 kg Cinza", "pagamento": "PIX|Cartão|Boleto",
  "total": "R$ 740,82", "id_pagamento": "123" }
```

**Publicação sugerida:** um site novo na Netlify ligado a este repositório, no endereço `loja.telhadistaabc.com.br`, com os botões "Comprar" do site principal apontando para lá. O passo a passo está em `COMO-PUBLICAR.md`.

---

## 3. BotConversa: fluxos a criar

1. **Pedido pago:** começa pelo webhook de entrada. Usa o campo `telefone` para achar o contato, envia a confirmação com o pedido, os itens e o tipo de entrega, aplica a etiqueta `comprou-balde` e avisa a equipe com os dados do pedido.
   *Confirmar se o plano do BotConversa tem entrada por webhook. Se não tiver, usar a API dele, com a chave no cabeçalho.*
2. **Pedido pelo WhatsApp**, que começa com a mensagem "Olá! Quero fazer um pedido pelo site": recebe o resumo do pedido e manda a chave PIX ou o link de pagamento.
3. **Avaliar meu telhado**, que começa com "Quero avaliar a impermeabilização do meu telhado": pergunta a cidade, o tipo de cobertura (telha cerâmica, fibrocimento ou laje) e o problema, pede fotos e passa para um atendente. Cria um lead no CRM.
4. **Pós-venda, 3 dias depois da compra:** "Como foi a aplicação? Quer que a nossa equipe aplique?" Isso transforma a venda do balde em venda de serviço.
5. **Recompra e manutenção, de 6 a 12 meses depois:** lembrete de revisão do telhado.
6. **Atraso de funcionário** (módulo 4): aviso para o dono quando alguém da equipe do dia não bater a chegada até o horário combinado.

---

## 4. Totem de chegada com reconhecimento facial, integrado à TV (a construir no Sistema)

**Objetivo:** um tablet com câmera ao lado da TV do painel. Quando o funcionário chega na base:
1. o tablet acha o rosto;
2. confere que é uma pessoa de verdade (piscar ou virar o rosto, para evitar foto no celular);
3. reconhece o funcionário;
4. grava a chegada no CRM (funcionário, horário, foto do momento);
5. **mostra na TV, em grande:** foto, "Bom dia, João, 07:02", a equipe e a obra do dia (as mesmas informações do QR Code).

**Na TV também:** a equipe do dia com quem já chegou e quem falta, e o aviso de atraso pelo BotConversa (fluxo 6).
**Relatório mensal:** chegadas, atrasos e faltas por funcionário, em CSV e PDF, para o contador.

### Decisão da lei, em aberto com o dono
- **Caminho A:** usar um app de ponto **certificado (REP-P, registrado no INPI**, Portaria MTP 671/2021) com modo totem e reconhecimento facial, mais a integração dele com o CRM e a TV. Substitui o relógio de digital e acaba com o pendrive.
- **Caminho B:** totem sob medida, feito no Sistema, que vale como **registro interno de presença**. O ponto oficial continua no relógio de digital até ser trocado.
  Um sistema próprio não vale como ponto oficial sem cumprir o REP-P (registro no INPI, arquivos AFD e AEJ, comprovante para o funcionário, registros que não podem ser alterados).

**LGPD (nos dois caminhos):** rosto é dado pessoal sensível. É preciso:
- avisar os funcionários por escrito;
- usar só para registrar a chegada;
- limitar quem acessa;
- apagar os dados de quem sair da empresa;
- de preferência, guardar só os dados numéricos do rosto, mais as fotos das batidas por um prazo definido.

### Sugestão técnica (caminho B)
- **Equipamento:**
  - tablet Android de 10" com câmera frontal;
  - suporte na altura do rosto;
  - luz de frente para o rosto, nunca com a porta atrás;
  - app de modo quiosque (por exemplo, Fully Kiosk Browser) abrindo a página do totem.
- **Reconhecimento no próprio navegador**, sem enviar vídeo para servidor. Opções: `@vladmandic/human` ou `@vladmandic/face-api` (modelos carregados localmente). Para o desafio de piscar ou virar o rosto, usar a malha facial (face mesh).
- **Cadastro:** o administrador tira de 3 a 5 fotos de cada funcionário, e o sistema guarda a média dos dados numéricos do rosto. Limite de semelhança configurável. Se o tablet não tiver certeza, pede para a pessoa tentar de novo ou digitar o PIN dela.
- **Sem internet:** as chegadas ficam guardadas no tablet (IndexedDB) e são enviadas quando a conexão voltar.
- **TV:** recebe as chegadas em tempo real (SSE ou WebSocket, ou consulta a cada 2 ou 3 segundos), mostra a chegada em tela cheia por uns 8 segundos e depois volta ao painel normal.
- **Dados mínimos:**
  - `funcionarios` (id, nome, foto, equipe, ativo);
  - `faces` (funcionario_id, dados numéricos do rosto, data);
  - `registros_presenca` (id, funcionario_id, data e hora, foto, semelhança, dispositivo, origem: rosto ou PIN);
  - `escala_dia` (data, equipe, obra, horário previsto).
- **Rotas:**
  - `POST /presenca` para gravar a chegada;
  - `GET /presenca/hoje` e o canal de tempo real para a TV;
  - `GET /relatorios/presenca?mes=AAAA-MM&formato=csv|pdf`;
  - `POST /funcionarios/:id/faces` para o cadastro.

---

## 5. Marketing (próxima etapa)

- **Plano de campanha e calendário de 30 dias:** antes e depois, dicas, produto em ação, bastidores, perguntas de clientes e promoções.
- **Posts prontos:** legendas, roteiros de Reels e Stories.
- **Google:** Perfil da Empresa no Google e posts semanais, com palavras-chave locais ("impermeabilização telhado Santo André").
- **Anúncios:** Meta Ads e Google Ads com orçamento pequeno para testar.
- **Publicação:** pelo Meta Business Suite, porque não há acesso direto às redes.
- **Rotina diária:** uma tarefa agendada que prepara o post do dia para revisão.
- **Regra:** todo post leva para a loja **e** para "Avaliar meu telhado", o que gera venda e serviço.
- A sessão "MAQUINA DE REELS" pode produzir os vídeos.

---

## 6. Ordem sugerida

1. **Publicar a loja** na Netlify (subdomínio) com o WhatsApp real e os preços definitivos, e fazer um teste com as credenciais de teste do Mercado Pago.
2. **Fluxo "Pedido pago" no BotConversa** e envio do pedido para o CRM.
3. **Fluxos "Avaliar meu telhado" e pós-venda.**
4. **Totem facial e TV:** primeiro decidir entre o caminho A e o B, depois construir. Começar pelo cadastro e pelo reconhecimento num tablet, depois a TV, depois o relatório.
5. **Marketing:** calendário e anúncios.

## 7. O que o dono ainda precisa passar

- [ ] Número do WhatsApp (o que usa o BotConversa)
- [ ] Preços definitivos e custo do balde Premium
- [ ] Endereço e horário de retirada
- [ ] Consumo por m² de cada linha (ficha técnica)
- [ ] Nome e foto do balde Premium
- [ ] Conta do Mercado Pago (o token vai **direto no painel da Netlify, nunca no chat**)
- [ ] URL do webhook do BotConversa
- [ ] Caminho A ou B no ponto, número de funcionários e modelo do relógio de digital
- [ ] Fotos originais das obras e do produto
