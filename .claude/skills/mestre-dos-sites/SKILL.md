---
name: mestre-dos-sites
description: Melhora qualquer site a partir do link, em poucos minutos. Baixa a página (textos, fotos, logo, cores, contatos), recorta a pessoa da foto, refaz o site em nível profissional com movimento e peças animadas que explicam o negócio, e abre o site novo com o antes e depois. Use quando o usuário mandar o link de um site e pedir para melhorar, refazer, modernizar, redesenhar ou reconstruir ("melhora esse site", "refaz esse site", "deixa esse site profissional", "proposta de site para esse cliente"), ou quando ele arrastar o zip desta skill junto com um link.
---

# Mestre dos Sites

Você recebe o link de um site que já existe e devolve o mesmo negócio num site novo, de uma página, com cara de trabalho caro: a pessoa em destaque (recortada da foto, saindo de uma forma na cor da marca), títulos que entram palavra por palavra, peças animadas que explicam o serviço, pronto para o celular e com um caminho óbvio para o contato. Tudo o que o site novo diz vem do site atual. A entrega é a página aberta no navegador, com o antes e depois.

**Como esta skill chega.** Ou ela está instalada (a pasta desta skill aparece no começo desta mensagem), ou o usuário arrastou o zip para a conversa. Se veio o zip, extraia na pasta de trabalho com `unzip -oq "<caminho do zip>" -d .` e use a pasta `mestre-dos-sites/` que surgir. Nos comandos abaixo, `SKILL` é o caminho dessa pasta.

## Ritmo: quatro passos, sem desvio

O usuário está esperando ao vivo. Meta: site novo aberto em cerca de 3 minutos.

1. **Capturar** (um comando) → 2. **Olhar a folha** (uma imagem) → 3. **Escrever o `site.json`** (uma escrita só) → 4. **Finalizar** (um comando).

- Não faça perguntas antes de começar. Só pergunte se não houver link.
- Não explique o plano, não leia os scripts nem os arquivos do kit: tudo o que você precisa está neste arquivo e na saída da captura.
- Antes de cada passo, uma frase curta para quem está assistindo. Nada além disso até a entrega.
- Você não escreve HTML nem CSS. Você escreve o conteúdo e as escolhas no `site.json`; o programa monta a página com todo o movimento.

## Passo 1 · Capturar

```bash
node "SKILL/scripts/capturar.mjs" "LINK"
```

Leva de 8 a 25 segundos. A saída já é a ficha completa: identidade visual, paleta sugerida, contatos com atalhos, fotos baixadas (e quais ganharam recorte sem fundo), problemas e todos os textos na ordem, inclusive das páginas vizinhas (sobre, serviços, contato). Ela cria a pasta `sites-melhorados/<domínio>/` com `img/`, `kit/` e `captura/`, e abre no navegador o raio-x do site atual para o usuário acompanhar.

Se aparecer "NÃO DEU PARA LER O SITE", repasse o motivo ao usuário em uma frase, peça outro link e pare.

## Passo 2 · Olhar a folha

Abra `sites-melhorados/<domínio>/captura/folha.jpg` com a ferramenta de leitura. É uma imagem só: o site atual no computador e no celular, as cores, o logo e todas as fotos com o nome do arquivo e a marca "tem recorte". Com ela você decide:

- qual foto da pessoa abre o site (a mais nítida, sorrindo, olhando para a câmera);
- quais fotos mostram gente, e onde está o rosto, para não cortar;
- quais imagens têm texto embutido (banner, arte de rede social, capa de e-book): essas só entram como capa de produto, nunca como foto da pessoa ou do lugar;
- quais fotos são de terceiros (o nome de outro profissional no arquivo ou na descrição, logo de outra empresa): essas não entram;
- o clima do negócio, para escolher o tom.

## Passo 3 · Escrever o `site.json`

Escreva `sites-melhorados/<domínio>/site.json` de uma vez.

### Antes de escrever, responda para você

- O que este negócio faz, para quem, e o que ele tem de concreto que os outros não dizem? Isso vira o título principal. Nunca uma promessa genérica ("transforme sua vida", "qualidade e confiança"): o diferencial real, do jeito que o cliente dele falaria. Se o próprio site tem uma frase forte, use a frase dele.
- Qual é o próximo passo que o site deve pedir? Quase sempre chamar no WhatsApp; depois agendar, reservar, pedir orçamento, comprar ou ligar. Um só: ele vira a `acao` e se repete na página inteira.
- Qual parte do serviço fica mais clara se for **mostrada** em vez de escrita? Um método com pilares, duas abordagens que se somam, um exame que mede várias coisas, um antes e depois de jeito de trabalhar, as etapas de um atendimento. Isso vira uma peça animada (veja "Peças que explicam"). Todo site leva pelo menos uma; os bons levam duas ou três.

### Conteúdo

- Use só o que está na ficha. Reescreva para ficar claro e direto, mas não invente serviço, preço, número, prêmio, formação, depoimento, endereço nem horário. Sem dado, a seção não existe.
- Em sites de construtor (Wix, Squarespace), a ordem dos textos às vezes vem trocada: a descrição de um serviço aparece embaixo do título do serviço seguinte. Junte título e texto pelo sentido, não pela posição.
- Aproveite tudo o que tem valor: serviços, diferenciais, etapas, história, formação, equipe, depoimentos (com o nome que aparece lá), imprensa, números, endereço, horário, convênios, produtos, vídeo, mapa. O site novo não pode dizer menos do que o antigo dizia de importante. De 6 a 10 seções em `secoes` (a abertura e a chamada não contam).
- Saúde, estética, direito e finanças: sem promessa de resultado, sem "garantido", sem antes e depois de paciente. Mantenha o registro profissional (CRM, CRN, CREFITO, OAB) se estiver na ficha.
- Português do Brasil simples, frases curtas. Sem travessão, sem emoji, sem "vanguarda", sem "soluções", "jornada" e "transformação" como muleta.
- Nos títulos, um trecho entre asteriscos vira o destaque na cor da marca: `"Cuidado que *cabe na sua rotina*."` Um destaque por título, nunca o título inteiro. No título principal o destaque ganha um traço desenhado embaixo: deixe-o com uma a três palavras.
- O site é de outra pessoa (o normal): deixe `"previa": true` (ou omita). A página mostra a faixa "Prévia de proposta". Só use `false` se o usuário disser que o site é dele.

### Links: use os atalhos da ficha

Nunca copie endereços de contato à mão. Escreva o atalho e o programa põe o endereço exato que a captura guardou:

`@whatsapp` · `@telefone` · `@email` · `@instagram` · `@facebook` · `@youtube` · `@linkedin` · `@tiktok` · `@agendar` (link de agendar ou reservar) · `@produto` (página de venda de curso ou e-book; não serve como `acao` de consulta) · `@mapa` · `@video` · `@site` (o site atual, para "entrar" ou "área do cliente")

Para o segundo de um tipo, ponha o número: `@agendar2`, `@telefone2`. Confira se o perfil é do negócio: o rodapé de site feito por agência costuma ter o Instagram da agência ("criado por", "desenvolvido por"); esse não entra. Ordem de preferência para a `acao`: `@whatsapp`, `@agendar`, `@telefone`, `@email`. Um atalho que a ficha não tem dá erro no passo 4: troque pelo que existe. Se a ficha avisar que um botão do site atual "leva a um link que não abre", esse link já saiu dos atalhos: use `@whatsapp`, ou, se só houver telefone celular, `https://wa.me/55` seguido do DDD e do número (só os dígitos que estão na ficha). Link que não é contato (página de produto, e-book) pode ir escrito, copiado da ficha.

### Direção visual

**Paleta e tema.** Comece pela "Paleta sugerida" da ficha (a linha `:root{ ... }` inteira) e pelo tema que ela indica. Olhe a folha: se a cor principal da marca (a do logo, do topo, dos botões) é outra, monte com ela. Variáveis: `--cor` (a da marca, profunda), `--cor-2` (uma cor CLARA e quente que brilhe sobre o escuro: areia, dourado, um tom claro da própria `--cor`; é a cor do destaque na abertura `cinema` e nas seções escuras, além de traços e pontos; nunca cinza nem azul apagado), `--cor-forte` (a mesma bem escura, usada nas seções escuras), `--cor-suave` (a mesma quase branca), `--fundo` (branco levemente puxado para a cor, nunca branco puro nem cinza frio), `--papel` (branco), `--tinta` (quase preto puxado para a cor), `--tinta-suave` (cinza da mesma família), `--sobre-cor` (texto em cima da `--cor`: branco, ou o escuro que a paleta sugerida trouxer quando a cor é clara). Cor viva e clara (amarelo, laranja, verde-limão) como `--cor`: acrescente `--cor-texto` mais escura para os textos em destaque.

**Tom.** Um destes:

| `tom` | Fontes | Para |
|---|---|---|
| `refinado` | Gloock + Hanken Grotesk | o padrão para profissional liberal: saúde, fisioterapia, nutrição, psicologia, odontologia, estética, advocacia, arquitetura (serifa encorpada, elegante, nunca fina) |
| `moderno` | Plus Jakarta Sans + Inter | clínicas maiores, serviços, negócios jovens que pedem letra sem serifa |
| `marcante` | Bricolage Grotesque + Inter | academia, esporte, barbearia, hamburgueria, eventos, automotivo, marcas jovens |
| `direto` | Sora + Inter | tecnologia, engenharia, contabilidade, indústria, serviços para empresas |
| `classico` | DM Serif Display + DM Sans | restaurante, café, vinho, imobiliária, joalheria, tradição de família |
| `acolhedor` | Fraunces + Inter | escola infantil, pet, artesanato, confeitaria |
| `editorial` | Instrument Serif + Inter | só moda, fotografia e revista (é fino e serifado: não use para profissional liberal) |

**Abertura.** Escolha o `tipo` pela melhor foto. A regra de ouro: foto profissional da pessoa num ambiente bonito, ocupando a tela, vence qualquer efeito.

- `cheia` com foto profissional da pessoa no consultório ou no espaço (o padrão quando essa foto existe): a foto ocupa a tela inteira, o texto fica à esquerda sobre um degradê escuro e quente, título grande. O topo fica transparente sobre a foto sozinho. A foto precisa deixar a esquerda livre para o texto (a pessoa à direita).

- `cinema` (o padrão quando a foto da pessoa "tem recorte", inclusive quando ela encosta nas bordas): fundo escuro e quente com luz de estúdio na cor da marca, a pessoa recortada grande à direita, uma `"palavra"` do título em letra gigante atrás dela (efeito capa de revista), título entrando palavra por palavra, fichas de vidro e parallax na rolagem. Campos: `olho`, `titulo` (com *destaque*), `sub`, `palavra` (uma palavra curta e forte do título), `foto` (o `-recorte`), `alt`, `fichas` (até 3), `provas` (3), `segundo_botao`. É a abertura que mais impressiona: use sempre que der.

- `recorte` (versão clara e mais leve, para quando o negócio pede um site claro do começo ao fim): a pessoa sem fundo saltando de um arco na cor da marca, com anel girando, fichas flutuando e um leve movimento que acompanha o mouse. `"foto"` é o arquivo `img/foto-NN-recorte.webp`. Se a ficha avisar que a pessoa encosta nas bordas da foto, acrescente `"moldura": "janela"`: ela fica dentro do arco, com as bordas da foto se dissolvendo na cor da marca.
- `retrato`: foto de uma pessoa com fundo, em moldura de arco. Foto mais larga que alta: `"moldura": "larga"`.
- `cheia`: foto forte e larga do lugar, do prato, da obra, do produto, ocupando a tela inteira atrás do texto. Só com foto nítida de pelo menos 1400 px e sem texto embutido.
- `larga`: texto no centro e a imagem embaixo (panorâmica, tela de sistema, equipe).
- `sem-foto`: quando nenhuma foto presta.

Nas aberturas `cinema` e `recorte`: `"fichas"` são até 3 cartõezinhos flutuando em volta da pessoa (`["Fato curto", "explicação"]`, só fatos da ficha); `"enfeite"` é opcional, uma arte de traço da marca sem fundo (ícones, padrão de linhas) que fica atrás, num canto. `"provas"` são 3 fatos fortes embaixo dos botões.

**Fotos.** Só os arquivos listados na ficha, pelo caminho `img/...`. Se só há uma foto boa da pessoa, ela vai na abertura (recortada); o `sobre` pode usar a mesma foto com fundo, e a `chamada` fica sem foto. Cada foto entra uma vez (a versão recortada e a com fundo contam como fotos diferentes, mas não repita a mesma pessoa na mesma pose em seções vizinhas). Rosto e produto nunca cortados: use `"foco": "50% 20%"` (o segundo número sobe ou desce o enquadramento; 0% é o topo). Todo `alt` descreve o que se vê. Logo: ponha em `logo` mesmo se a ficha disser que é claro (o programa escurece logo de uma cor só); se não houver logo, ou se ele tiver fundo próprio que briga com o tema, deixe `""` e o nome aparece escrito.

### Peças que explicam (o movimento do site)

Cada uma é uma seção animada que se monta quando aparece na tela. Use as que o conteúdo sustenta:

| `tipo` | O que mostra | Quando usar |
|---|---|---|
| `jornada` | Cena fixa na rolagem, fundo escuro: a lista de etapas acende uma a uma, a foto de cada etapa entra por uma máscara num quadro grande, e um ponto anda por uma régua com as fases | Etapas com uma foto para cada (gestação ao pós-parto, antes e depois de uma obra, as fases de um tratamento). A melhor peça de explicação: use quando houver de 3 a 5 etapas e fotos |
| `processo` | Linha do tempo que se preenche conforme a página rola; cada etapa acende | Etapas sem foto |
| `soma` | Dois círculos que se juntam e viram um terceiro | Duas abordagens que o negócio combina ("Nutrição funcional + comportamental") |
| `orbita` | Fundo escuro: esferas de vidro girando em volta de um centro que pulsa, linhas que se desenham; cada pilar acende em sequência e mostra o seu texto num painel | Um método com pilares, uma especialidade com o que ela trata. Itens como `{ "titulo": "Nome curto", "texto": "Uma frase da ficha" }` |
| `medida` | Número grande num anel que se desenha, com etiquetas em volta | Um exame, uma avaliação, um pacote que inclui várias coisas ("20 índices") |
| `comparacao` | Dois lados, os itens entrando um a um; o lado `b` é o que o negócio defende | Um jeito comum e o jeito deste negócio, o que um recurso faz e o que ele não faz |
| `citacao` | Frase grande com as palavras acendendo conforme a leitura | Um depoimento forte ou a frase-assinatura do negócio |

Peças de vitrine (use no lugar das grades simples):

| `tipo` | O que mostra | Quando usar |
|---|---|---|
| `mosaico` | Serviços com foto em grade assimétrica (o primeiro grande), foto cobrindo o cartão, título por cima, texto que sobe no hover, índice numerado ao lado do título | Sempre que houver de 3 a 6 serviços com foto. Itens `{ "titulo", "texto", "foto", "alt", "foco" }`. Sem fotos, use `cartoes` com ícone |
| `livros` | Produtos digitais como objetos 3D numa vitrine com luz: e-book vira livro com lombada e balanço lento; aula ou curso sem capa vira um ingresso | E-books, cursos, aulas, mentorias à venda. Itens `{ "titulo", "texto", "capa": "img/...", "link": ["Quero o e-book", "@produto"] }` ou `{ "tipo": "aula", "titulo", "texto", "link": [...] }` |

Ritmo de fundos: depois de uma seção escura venha uma clara. `jornada`, `orbita` e `livros` já são escuras; ponha `mosaico`, `sobre` ou `contato` entre elas. Para fechar a página com força, use uma `citacao` com a frase-assinatura do negócio, `"fundo": "escura"` e `"botao": true` (o botão principal), no lugar da `chamada`.

Os títulos de todas as seções entram palavra por palavra, os cartões com ícone desenham o ícone sozinhos, e a página tem barra de leitura no topo: isso o programa faz, sem você pedir.

### O formato

```json
{
  "nome": "Nome do negócio",
  "sub_marca": "O que é · registro",
  "logo": "img/logo.png",
  "titulo_da_aba": "Nome · o que é, em Cidade",
  "descricao": "Uma frase com o diferencial e a cidade.",
  "tema": "claro",
  "tom": "moderno",
  "cores": ":root{ --cor:#8f5477; --cor-2:#b8975a; --cor-forte:#2e1826; --cor-suave:#f6edf2; --fundo:#fbf7f4; --papel:#ffffff; --tinta:#241a20; --tinta-suave:#6c5f66; --sobre-cor:#ffffff }",
  "acao": { "texto": "Quero agendar uma consulta", "curto": "Agendar", "link": "@whatsapp" },
  "whatsapp": "@whatsapp",
  "abertura": {
    "tipo": "cinema",
    "olho": "O que é · onde",
    "titulo": "Título com o *diferencial* deste negócio",
    "palavra": "diferencial",
    "sub": "Para quem é e como funciona, em uma ou duas frases.",
    "foto": "img/foto-01-recorte.webp", "alt": "O que se vê na foto",
    "segundo_botao": ["Como funciona", "#metodo"],
    "fichas": [["Fato curto", "explicação"], ["Fato curto", "explicação"]],
    "provas": [["Fato", "explicação curta"], ["Fato", "explicação curta"], ["Fato", "explicação curta"]]
  },
  "faixa": ["Serviço", "Serviço", "Serviço", "Serviço", "Serviço"],
  "secoes": [
    { "tipo": "jornada", "id": "etapas", "menu": "Como funciona", "olho": "Da primeira consulta ao resultado", "titulo": "Título com *um trecho* em destaque", "texto": "Uma frase.",
      "itens": [ { "titulo": "Etapa", "texto": "O que acontece.", "nota": "Fase", "foto": "img/foto-04.jpg", "alt": "...", "foco": "50% 40%" } ] },
    { "tipo": "mosaico", "id": "servicos", "menu": "Serviços", "olho": "Como posso ajudar", "titulo": "Título com *um trecho* em destaque",
      "itens": [ { "titulo": "Serviço", "texto": "Texto curto.", "foto": "img/foto-03.jpg", "alt": "...", "foco": "50% 30%" } ] },
    { "tipo": "livros", "id": "conteudos", "olho": "Conteúdos", "titulo": "...",
      "itens": [ { "titulo": "E-book ...", "texto": "Uma frase.", "capa": "img/foto-10.jpg", "link": ["Quero o e-book", "@produto"] },
                 { "tipo": "aula", "titulo": "Aula ...", "texto": "Uma frase.", "link": ["Quero saber mais", "@produto2"] } ] },
    { "tipo": "cartoes", "olho": "Sem fotos dos serviços", "titulo": "...",
      "itens": [ { "icone": "folha", "titulo": "Serviço", "texto": "Texto curto." }, { "icone": "balanca", "titulo": "Serviço", "texto": "Texto curto." },
                 { "destaque": true, "titulo": "Vamos conversar?", "texto": "Uma frase.", "link": ["Agendar", "@whatsapp"] } ] },
    { "tipo": "soma", "id": "metodo", "menu": "Método", "olho": "Como funciona", "titulo": "...", "paragrafos": ["...", "..."],
      "a": "Abordagem um", "b": "Abordagem dois", "resultado": "O que dá", "botao": ["Quero começar", "@whatsapp"] },
    { "tipo": "orbita", "olho": "Nome do método", "titulo": "...", "paragrafos": ["..."], "centro": "Nome do método",
      "itens": [ { "titulo": "Pilar", "texto": "Uma frase da ficha." }, { "titulo": "Pilar", "texto": "..." }, { "titulo": "Pilar", "texto": "..." } ] },
    { "tipo": "processo", "menu": "Como funciona", "layout": "lado", "olho": "Passo a passo", "titulo": "...", "texto": "Uma frase.",
      "fotos": [["img/foto-04.jpg", "alt"], ["img/foto-06.jpg", "alt"]],
      "itens": [ { "titulo": "Etapa", "texto": "O que acontece.", "nota": "Quando ou onde" } ] },
    { "tipo": "medida", "olho": "Avaliação", "titulo": "...", "paragrafos": ["..."], "numero": "20", "legenda": "índices corporais",
      "etiquetas": ["Item", "Item", "Item", "Item", "Item"], "lista": ["Fato", "Fato"], "inverter": true },
    { "tipo": "comparacao", "olho": "...", "titulo": "...", "texto": "Uma frase.",
      "a": { "rotulo": "O comum", "titulo": "...", "itens": ["...", "..."] }, "b": { "rotulo": "Aqui", "titulo": "...", "itens": ["...", "..."] } },
    { "tipo": "citacao", "frase": "Depoimento ou frase-assinatura, como está no site.", "autor": "Nome, idade ou cidade" },
    { "tipo": "citacao", "fundo": "escura", "frase": "A frase-assinatura, para fechar a página.", "autor": "Nome", "botao": true },
    { "tipo": "sobre", "menu": "Sobre", "olho": "Sobre mim", "titulo": "...", "foto": "img/foto-04-recorte.webp", "alt": "...",
      "paragrafos": ["...", "..."], "lista": ["Formação real", "Formação real"], "botao": ["@perfil no Instagram", "@instagram"] },
    { "tipo": "linhas", "layout": "lado", "olho": "Imprensa", "titulo": "...", "fotos": [["img/foto-05.jpg", "alt"]], "itens": [["Veículo", "Tema"], ["Veículo", "Tema"]] },
    { "tipo": "contato", "menu": "Contato", "olho": "Onde fica", "titulo": "...",
      "dados": [["Endereço", "Rua..."], ["Horário", "..."], ["WhatsApp", "(00) 00000-0000", "@whatsapp"]], "mapa": "@mapa" }
  ],
  "chamada": { "titulo": "Título curto com *convite*", "texto": "Uma frase.", "botao": "Agendar agora", "foto": "img/foto-08-recorte.webp", "alt": "..." },
  "rodape": { "texto": "Uma frase.", "colunas": [ ["Atendimento", [["Rua..."], ["Online"]]], ["Contato", [["WhatsApp", "@whatsapp"], ["Instagram", "@instagram"]]] ], "fim": "Registro ou CNPJ, se houver; sem registro, omita." }
}
```

O que saber sobre o formato:

- `secoes` é uma lista na ordem que conta melhor a história deste negócio. O exemplo mostra muitas: use só as que a ficha sustenta.
- `menu` em até 5 seções: vira o menu do topo. `id` dá o endereço da seção (para `segundo_botao`, `"#metodo"`). O fundo alterna sozinho; `orbita` e `numeros` saem escuros. Para forçar: `"fundo": "clara" | "papel" | "suave" | "escura"` (uma escura por página).
- `cartoes`: de 3 a 6, mais o cartão de `destaque` se quiser. Cada cartão com `icone` (desenhado), ou com `foto`, ou sem nada (ganha número): não misture na mesma seção. Um `"destaque": true` no fim fecha a grade com o convite. Ícones: folha, balanca, escudo, brilho, sol, lua, coracao, relogio, pin, telefone, conversa, video, estrela, casa, chave, tesoura, talheres, cafe, cama, halter, livro, documento, grafico, pessoas, calendario, carro, caminhao, ferramenta, raio, gota, alvo, maleta, justica, check, mundo, camera, cadeado, sacola, olho, musica, computador, celular, dente, pata. Capa de produto (e-book, curso) entra como `foto` do cartão.
- `processo`, `linhas`, `duvidas`, `precos`, `selos`: aceitam `"layout": "lado"` (título fixo de um lado enquanto a lista rola do outro) e `"fotos"` com até 2 fotos empilhadas embaixo do título.
- `sobre`: `foto` com recorte vira a pessoa saltando do arco, com `"fichas"` opcionais; com foto comum, moldura simples. `lista` com mais de 5 itens vira duas colunas.
- `chamada.foto` com recorte: a pessoa sai de dentro do cartão final. Use uma foto diferente da abertura.
- `soma`, `orbita`, `medida`: `"inverter": true` troca o lado da arte. `numeros`: só números do site (ano não conta: aparece parado).
- `video`: `"video": "@video"`. Entra como capa com botão de tocar que abre o vídeo.
- `contato`: `"mapa": "@mapa"`; sem mapa, pode usar `"foto"` do lugar. O botão é a `acao`.
- `selo` da abertura: só se a nota do Google estiver na ficha (`["4,9", "avaliação no Google"]`).
- `acao2` no nível de cima (`{ "texto": "Entrar", "link": "@site" }`): segundo link no topo, para área do cliente ou cadastro que o site atual tem.
- `linhas`: `[["Título", "Texto"]]` (serviços, tratamentos, imprensa, formação). `depoimentos`: `"itens": [["Frase como está no site", "Nome · cidade ou idade"]]`, de 2 a 4 (em saúde, só depoimento sem número de resultado e sem promessa de cura); um só, ou o mais forte, vai melhor como `citacao`.
- Outros tipos: `numeros`, `galeria` (3 a 8 fotos), `imagem` (uma foto larga), `equipe` (`[["Nome", "Cargo", "Texto", "img/..."]]`), `precos` (`[["Item", "descrição", "R$ 00"]]`), `selos` (convênios), `duvidas` (`[["Pergunta?", "Resposta"]]`), `texto`.
- Precisa de algo que o formato não tem? `"css": "..."` no nível de cima aceita ajustes finos, e `{ "tipo": "html", "html": "<section class=\"m-secao\">...</section>" }` aceita HTML livre. Último caso.

## Passo 4 · Finalizar

```bash
node "SKILL/scripts/finalizar.mjs" "sites-melhorados/<domínio>"
```

Ele monta o `index.html` a partir do `site.json`, abre num Chrome sem janela, confere imagens, links, largura no celular e contatos, tira os retratos do depois, monta o `antes-e-depois.html`, gera o `site-novo.zip` e abre o site novo e o antes e depois no navegador.

- Saiu "TUDO CERTO": entregue.
- Saiu "CONSERTE": corrija cada item com edições pontuais no `site.json` e rode o comando de novo. Não reescreva o arquivo inteiro.
- Avisos (não travam): leia e corrija os que melhoram o site (foto repetida, segunda grade de cartões só de texto, nenhuma peça que explica).

## Entrega

Feche com uma mensagem curta:

- os dois links, clicáveis: o site novo (`index.html`) e o antes e depois (`antes-e-depois.html`);
- três frases sobre o que mudou, ligadas aos problemas que a captura apontou;
- se faltou algo no site original (sem foto, sem telefone, sem endereço), diga em uma frase.

O site novo é uma proposta que fica nesta máquina. Não publique o site de outra pessoa na internet: publicar só quando o site for do próprio usuário ou o dono autorizar.

## Ajustes depois

Pedido de mudança ("troca a foto", "muda a cor", "tira essa seção", "muda o título", "troca a letra"): edição pontual no `site.json` e o comando do passo 4 de novo.
