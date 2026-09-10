---
name: onda-cron-agent
description: Executa o ciclo autônomo completo de inteligência do Onda Conecta: pesquisa as principais tendências e notícias globais na web em tempo real por categoria, redige o artigo original para o Brasil e as versões em inglês e espanhol, gera a imagem/capa, valida o build estático e publica direto no Git/produção.
---

# Onda Conecta — Skill de Execução Autônoma (onda-cron-agent)

Esta skill permite que o Antigravity execute autonomamente o ciclo de pesquisa, redação e publicação do portal **Onda Conecta**, funcionando sob demanda ou via cron agendada (`/schedule`).

---

## 🎯 Categorias Monitoradas

1. **Inovação & IA** (`Innovation & AI` / `Innovación e IA`)
2. **Tendências Globais** (`Trends` / `Tendencias`)
3. **Mercado & Negócios** (`Business & Markets` / `Mercados y Negocios`)
4. **Sustentabilidade & Clima** (`Sustainability` / `Sostenibilidad`)
5. **Tecnologia & Futuro** (`Technology` / `Tecnología`)
6. **Comportamento & Sociedade** (`Culture & Society` / `Comportamiento`)

---

## 🔄 Fluxo de Execução Passo a Passo

Sempre que esta skill for invocada pelo usuário ou acionada por um timer/cron:

### 1. Pesquisa em Tempo Real na Web
- Utilize a ferramenta `search_web` com termos do tipo:
  - *"latest AI breakthroughs this week"*
  - *"global market trends and venture capital 2026"*
  - *"climate tech carbon market global regulations"*
  - *"tech trends breaking news"*
- Escolha uma notícia/tendência de alto impacto com no máximo 48 horas.
- Verifique se o tema já não consta em `scripts/published-history.json` para evitar repetições.

### 2. Redação Tríplice com SEO de Ponta (PT / EN / ES)
Redija as 3 versões completas seguindo a skill `onda-writer`:
- **Versão em Português (`lang: 'pt'`):** Título chamativo de até 65 caracteres, meta description de 130-155 caracteres e ângulo de impacto no mercado brasileiro.
- **Versão em Inglês (`lang: 'en'`, `translationOf: '<slug>'`):** Texto jornalístico nativo e fluente.
- **Versão em Espanhol (`lang: 'es'`, `translationOf: '<slug>'`):** Adaptação com naturalidade para o público hispânico.

### 3. Atribuição de ID e Arquivos MDX
- Descubra o maior ID atual examinando os arquivos em `src/content/blog/`.
- Salve os 3 arquivos:
  - `src/content/blog/<slug>.mdx`
  - `src/content/blog/<slug>-en.mdx`
  - `src/content/blog/<slug>-es.mdx`
- Atualize o `scripts/published-history.json` com o título da matéria.

### 4. Validação e Deploy
- Execute: `npm run build` para garantir que o Astro compilou sem erros.
- Execute o commit e push:
  ```bash
  git add src/content/blog/<slug>* scripts/published-history.json public/images/
  git commit -m "feat(auto): publicação de tendência mundial <slug> (PT/EN/ES)"
  git push origin main
  ```
- Avise o usuário com o resumo da notícia publicada e os links locais/remotos.
