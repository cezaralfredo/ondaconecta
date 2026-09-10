# 📖 Manual de Publicação de Conteúdo — Onda Conecta

Este guia prático e didático foi elaborado para orientar você em **todas as etapas de publicação de notícias, artigos e tendências** no portal **Onda Conecta**.

---

## 🧭 Visão Geral do Fluxo de Publicação

O site foi construído com arquitetura estática moderna (**Astro SSG**). Isso significa que você não precisa de painéis lentos de WordPress nem de banco de dados:

```
[Tema ou Notícia Bruta] 
        ↓
[Skill onda-writer] (Redige com SEO em PT/EN/ES)
        ↓
[Skill onda-publisher] (Valida e salva os arquivos MDX)
        ↓
[Git Commit & Push] (Atualiza repositório na branch main)
        ↓
[GitHub Actions CI/CD] (Gera build estático ultrarrápido)
        ↓
[Deploy via FTP] (Publica na pasta public_html da hospedagem)
```

1. O conteúdo é escrito no formato **MDX** dentro da pasta `src/content/blog/`.
2. As versões em **Português (`pt`)**, **Inglês (`en`)** e **Espanhol (`es`)** são mantidas sincronizadas.
3. Cada vez que os arquivos entram no Git (branch `main`), o servidor DirectAdmin atualiza o site **automaticamente** em poucos segundos.

---

## ⚡ Método 1: Publicação Rápida via IA (Recomendado)

Você pode publicar um artigo completo simplesmente me dando uma instrução em linguagem natural aqui no chat.

### Exemplos de comandos que você pode usar:

> **Exemplo A (A partir de um tema em alta):**  
> *"Publique um artigo sobre o avanço dos agentes de IA autônomos nas empresas globais e seu impacto no mercado brasileiro. Crie a capa e as versões em inglês e espanhol."*

> **Exemplo B (A partir de uma notícia ou link):**  
> *"Pegue essa matéria/link sobre a regulação do mercado de carbono e transforme em um artigo completo para a Onda Conecta com SEO de ponta e tradução."*

### O que acontece nos bastidores:
1. A skill `onda-writer` redige o texto em **pt-BR**, focado em intenção de busca no Google Brasil, e cria as versões em **EN** e **ES**.
2. A skill `onda-publisher` calcula o próximo `id`, gera o slug amigável, valida a tipagem e cria os 3 arquivos `.mdx`.
3. É gerada ou atribuída a imagem da capa em `public/images/blog-post/`.
4. O commit e push no Git são feitos automaticamente, disparando o deploy para o ar.

---

## 🛠️ Método 2: Publicação Manual (Passo a Passo)

Se você preferir escrever ou editar um artigo manualmente, siga os passos abaixo:

### Passo 1: Definir os Nomes dos Arquivos
Escolha um **slug** (identificador amigável em minúsculas separado por hífens).  
Exemplo: `mercado-de-carbono-brasil-2026`

Você criará três arquivos em `src/content/blog/`:
1. `mercado-de-carbono-brasil-2026.mdx` *(versão em português)*
2. `mercado-de-carbono-brasil-2026-en.mdx` *(versão em inglês)*
3. `mercado-de-carbono-brasil-2026-es.mdx` *(versão em espanhol)*

---

### Passo 2: Estrutura Obrigatória do Cabeçalho (Frontmatter)

No início de todo arquivo `.mdx`, entre os três traços `---`, inclua o bloco de metadados:

#### 🇧🇷 Versão Principal em Português:
```yaml
---
id: 9
slug: 'mercado-de-carbono-brasil-2026'
lang: 'pt'
title: 'Mercado de Carbono 2026: O que Muda para as Empresas Brasileiras'
description: 'Entenda as novas diretrizes globais do mercado de carbono e como o Brasil se posiciona como protagonista na transição verde.'
imageUrl: '/images/blog-post/mercado-carbono.webp'
imageAlt: 'Infográfico do mercado de carbono no Brasil'
pubDate: '10 de Março de 2026'
author: 'Redação Onda Conecta'
avatarUrl: '/images/avatars/1.webp'
category: 'Sustentabilidade'
readTime: 6
featured: false
---
```

#### 🇺🇸 Versão em Inglês:
```yaml
---
id: 10
slug: 'mercado-de-carbono-brasil-2026-en'
lang: 'en'
translationOf: 'mercado-de-carbono-brasil-2026'
title: 'Carbon Market 2026: Key Changes for Brazilian and Global Businesses'
description: 'Discover the latest international carbon market regulations and Brazil’s role in global green transition.'
imageUrl: '/images/blog-post/mercado-carbono.webp'
imageAlt: 'Carbon market infographic'
pubDate: 'March 10, 2026'
author: 'Redação Onda Conecta'
avatarUrl: '/images/avatars/1.webp'
category: 'Sustainability'
readTime: 6
featured: false
---
```

#### 🇪🇸 Versão em Espanhol:
```yaml
---
id: 11
slug: 'mercado-de-carbono-brasil-2026-es'
lang: 'es'
translationOf: 'mercado-de-carbono-brasil-2026'
title: 'Mercado de Carbono 2026: Qué Cambia para las Empresas en Brasil y el Mundo'
description: 'Conozca las nuevas directrices mundiales del mercado de carbono y el protagonismo de Brasil en la transición ecológica.'
imageUrl: '/images/blog-post/mercado-carbono.webp'
imageAlt: 'Infografía sobre mercado de carbono'
pubDate: '10 de Marzo de 2026'
author: 'Redação Onda Conecta'
avatarUrl: '/images/avatars/1.webp'
category: 'Sostenibilidad'
readTime: 6
featured: false
---
```

---

### Passo 3: Categorias Oficiais Padronizadas

Para manter o layout e os filtros do site consistentes, utilize uma das seguintes categorias:

| Categoria (PT) | Categoria (EN) | Categoria (ES) |
| :--- | :--- | :--- |
| **Tendências** | Trends | Tendencias |
| **Inovação & IA** | Innovation & AI | Innovación e IA |
| **Mercado & Negócios** | Business & Markets | Mercados y Negocios |
| **Tecnologia** | Technology | Tecnología |
| **Sustentabilidade** | Sustainability | Sostenibilidad |
| **Comportamento** | Culture & Society | Comportamiento |

---

### Passo 4: Formatação do Corpo do Artigo (Para Máximo SEO)

Abaixo do cabeçalho `---`, escreva o texto utilizando **Markdown**:

```markdown
## Título da Primeira Seção (H2)

Parágrafos curtos de 3 a 4 linhas facilitam a leitura em smartphones e aumentam o tempo de permanência na página.

### Subtópico Específico (H3)

- **Destaque 1:** use negrito para facilitar a leitura dinâmica dos pontos centrais.
- **Destaque 2:** estatísticas recentes com menção a fontes oficiais.

> "Citações de especialistas ou frases marcantes dão autoridade e quebram a monotonia do texto."

## Conclusão: O que Esperar a Seguir

Resumo rápido da tendência com uma chamada para reflexão do leitor.
```

---

### Passo 5: Adicionar a Imagem de Capa
- Salve o banner da postagem em: `public/images/blog-post/<slug>.webp`.
- **Dica de Performance:** Prefira imagens no formato `.webp`, com resolução aproximada de `1200x675 px` (proporção 16:9) e tamanho abaixo de `150 KB`.

---

### Passo 6: Publicar (Deploy via Git)

Abra o terminal na pasta do projeto e execute:

```bash
# 1. Adiciona os novos arquivos
git add src/content/blog/ public/images/

# 2. Cria o commit com mensagem descritiva
git commit -m "feat(blog): publicar artigo sobre mercado de carbono em pt/en/es"

# 3. Envia para o repositório e dispara o deploy no servidor
git push origin main
```

O GitHub Actions compilará automaticamente as páginas estáticas e fará a sincronização FTP com a sua hospedagem. Em aproximadamente **1 a 2 minutos**, o artigo estará acessível publicamente no site!

---

## 🎯 Dicas de Ouro para Conquistar o Top 1 do Google

1. **Gatilhos de Atualidade no Título:** Palavras como *"em 2026"*, *"novas regras"*, *"tendência global"*, *"guia prático"* atraem cliques imediatos.
2. **Meta Description Atraente:** Mantenha entre 130 e 155 caracteres. Deve responder resumidamente o que o leitor vai ganhar lendo a matéria.
3. **Escaneabilidade:** Leitores e robôs do Google priorizam artigos organizados em listas, tópicos e seções claras com `H2` e `H3`.
4. **Visão Global + Aplicação Nacional:** Explicar tendências mundiais conectando com a realidade brasileira é a chave para a autoridade editorial da **Onda Conecta**.
