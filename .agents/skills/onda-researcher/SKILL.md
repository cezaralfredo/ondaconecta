---
name: onda-researcher
description: Realiza a curadoria de pautas, pesquisa em tempo real de tendências globais e nacionais com paridade 50/50, verificação anti-duplicidade de histórico e extração de dados analíticos (E-E-A-T), gerando um briefing estruturado em JSON para a redação.
---

# Onda Conecta — Skill de Pesquisa, Curadoria e Fact-Checking (onda-researcher)

Esta skill atua como o **editor de pautas e pesquisador sênior** do portal **Onda Conecta**, transformando o mar de informações da internet em briefings analíticos de alta relevância, prontos para a redação.

---

## 1. Diretrizes de Cobertura & Paridade Editorial (50/50)

A curadoria deve manter um equilíbrio rigoroso de relevância entre os mercados nacional e global:

- **Notícias Globais com Impacto Local:**
  - Identificar grandes rupturas nos EUA, Europa e Ásia.
  - Formular obrigatoriamente o ângulo de transposição: *"Como isso afeta empresas, empreendedores, investimentos ou o cotidiano do leitor no Brasil?"*.
- **Pioneirismo & Tendências Nacionais:**
  - Identificar inovações, tendências comportamentais e marcos regulatórios brasileiros com potencial de destaque internacional ou relevância imediata.

### Verticais Monitoradas e Fontes de Autoridade Primárias (Incluindo Radares de Vanguarda):

1. **Inovação & IA:**
   - *Nacionais & Centros de Pesquisa:* C4AI (USP / IBM / FAPESP), CeIA (UFG / EMBRAPII), Época Negócios Tech, Exame Inovação, Startups.com.br, Manual do Usuário.
   - *Matrizes Populares de Grande Alcance & Autoridade (+8):*
     1. **G1 Tecnologia (Globo):** O canal de massa de maior alcance do país em segurança digital, ferramentas populares, regulação e impacto cotidiano da tecnologia.
     2. **MIT Technology Review Brasil:** A maior autoridade global em jornalismo de tecnologia profunda traduzido para a tomada de decisão corporativa e acadêmica no Brasil.
     3. **Canaltech & TecMundo:** Gigantes da cobertura de tecnologia para o consumidor geral e profissionais no Brasil, com foco em produtos, testes e IA aplicada.
     4. **The Verge & Ars Technica (Global):** Referências globais de grande alcance em jornalismo investigativo de tecnologia, ecossistemas de software e impacto social da computação.
     5. **IEEE Spectrum & ACM TechNews:** Autoridade máxima em engenharia de sistemas, robótica física, chips e arquiteturas de telecomunicações.
     6. **Wired Magazine (Global / AI & Cybersecurity):** A maior referência mundial em jornalismo cultural e investigativo de tecnologia, cibersegurança e impactos geopolíticos da IA.
     7. **VentureBeat (AI Beat):** O principal portal internacional de IA empresarial, cobrindo casos reais de uso de MLOps, governança de modelos e computação em nuvem corporativa.
     8. **Núcleo Jornalismo (Brasil):** Referência em jornalismo investigativo de tecnologia, transparência algorítmica, privacidade de dados e impacto social de plataformas no Brasil.
   - *Radares & Newsletters Técnicas:* **The Brief**, **TechDrop**, **Distrito Insights**, **Latent Space (swyx & Alessio)**, **Interconnects (Nathan Lambert)**.
   - *Globais & Think Tanks de Silício/Modelos:* **SemiAnalysis (Dylan Patel — Semicondutores & TCO)**, **Stanford HAI (AI Index Report)**, TechCrunch, The Information, **Stratechery (Ben Thompson)**, **TLDR AI**, **Semafor Tech**.
2. **Mercado & Negócios:**
   - *Nacionais & Escolas de Gestão:* **Fundação Dom Cabral (FDC — Núcleo de Estratégia e Negócios)**, **JOTA Negócios (Regulação, Tributário e Concorrência)**, Brazil Journal, NeoFeed, Pipeline Valor, InfoMoney Negócios, Finsiders Brasil.
   - *Matrizes Populares de Grande Alcance & Autoridade (+8):*
     1. **Revista PEGN (Pequenas Empresas & Grandes Negócios - Globo):** O veículo de maior alcance popular para o ecossistema de PMEs, varejo, franquias e serviços no Brasil.
     2. **Valor Econômico (Empresas & Setores):** O principal jornal de economia e negócios do país, referência em infraestrutura, indústria pesada, agronegócio e concessões.
     3. **Associação Brasileira de Franchising (ABF) & Mundo do Franchising:** Autoridade máxima em inteligência e números do setor de franquias, um dos maiores motores do PIB e do emprego nacional.
     4. **Agência Sebrae de Notícias (Sebrae Nacional):** A maior rede de dados sobre micro e pequenas empresas, setores mais resilientes e tendências de formalização de negócios.
     5. **Bloomberg Línea & Financial Times Brasil:** Cobertura de negócios corporativos da América Latina, fluxos de comércio exterior e cadeias de suprimentos globais.
     6. **Exame Negócios & ESG:** Um dos maiores ecossistemas de negócios e gestão do Brasil, com análises profundas sobre estratégia empresarial, governança e novos modelos de mercado.
     7. **Meio & Mensagem (Estratégia & Mercado):** A principal autoridade em inteligência de marcas, mídia, comportamento de consumo e verbas publicitárias das grandes empresas no Brasil.
     8. **Confederação Nacional da Indústria (CNI) & Fiesp:** A maior base de dados e estudos econômicos sobre manufatura, logística, produtividade industrial e competitividade real no Brasil.
   - *Radares, Bootstrapping & Newsletters:* **DealflowBR (Guilherme Lima)**, **Endeavor Brasil**, **MicroConf & State of Independent SaaS**.
   - *Globais & Product-Led Growth:* **Lenny's Newsletter (Product Growth & Monetização)**, **OpenView PLG**, **BCG Henderson Institute**, **McKinsey Global Institute (MGI)**, Bloomberg, Financial Times, Forbes, Fortune, Wall Street Journal, **PitchBook News**, **CB Insights**.
3. **Finanças Pessoais:**
   - *Nacionais, Índices & Previdência:* **Bora Investir (B3)**, **FGV IBRE (Poder de Compra & IPC)**, **ABRAPP (Previdência Fechada & Longevidade Financeira)**, InfoMoney, Valor Investe, Inteligência Financeira, Suno Notícias.
   - *Matrizes Populares de Grande Alcance & Autoridade (+8):*
     1. **G1 Economia & 'Dicas de Economia' (Globo):** O maior portal de orientação financeira popular, orçamentos domésticos, direitos do consumidor e combate ao superendividamento.
     2. **Folha de S.Paulo (Mercado & Finanças Pessoais):** Jornalismo analítico e acessível de tributos, financiamento imobiliário, custos de vida e planejamento financeiro da família.
     3. **Estadão E-Investidor & Broadcast:** Cobertura de referência do mercado financeiro brasileiro para pessoas físicas, comparando rentabilidade, debêntures e fundos.
     4. **Serasa Experian / SPC Brasil (Indicadores de Crédito & Inadimplência):** Autoridade em dados demográficos sobre comportamento de dívidas, score de crédito, renegociação e consumo popular.
     5. **Senacon / Procons & Reclame Aqui Insights:** Inteligência de massa sobre proteção contra fraudes financeiras digitais, abusos bancários e direitos econômicos reais do consumidor.
     6. **Idec (Instituto Brasileiro de Defesa do Consumidor):** A maior autoridade independente do país em análise crítica de tarifas bancárias, crédito justo, seguros e direitos econômicos dos cidadãos.
     7. **Anbima (Educação Financeira & Raio-X do Investidor):** A associação dos mercados financeiro e de capitais, com o maior mapeamento demográfico sobre hábitos de poupança e investimento do brasileiro.
     8. **Nexo Finanças & Políticas Públicas:** Jornalismo de dados de alto prestígio e infográficos explicativos que traduzem inflação, juros, poder de compra e orçamentos domésticos.
   - *Radares de Cartões, Milhas & Fintechs:* **The Points Guy (TPG) Analytics**, **Upgraded Points**, **Finsiders Brasil (Open Finance/Fintechs)**, **FlipMilhas**, **Cartão e Milhas**.
   - *Globais & Alocação de Ativos:* **Vanguard Center for Investor Research**, **Morningstar Direct Insights**, MarketWatch, CNBC, Bloomberg Wealth, **Fintech Nexus**.
4. **Saúde & Bem-estar:**
   - *Nacionais:* Saúde Abril, VivaBem (UOL), Eu Atleta (ge.globo), Portal Drauzio Varella, CNN Brasil Saúde.
   - *Matrizes Populares de Grande Alcance & Autoridade (+5):*
     1. **G1 Saúde & Bem-Estar (Globo / Fantástico / Bem Estar):** O maior portal de notícias do Brasil, pautando o cotidiano de milhões com saúde pública, novos tratamentos e hábitos saudáveis.
     2. **Folha de S.Paulo (Equilíbrio & Saúde):** Jornalismo de referência nacional em saúde mental, longevidade e medicina preventiva com colunistas médicos renomados.
     3. **BBC News Brasil (Saúde & Ciência):** Grande alcance popular e rigor investigativo, desmistificando temas médicos e pesquisas complexas em linguagem acessível.
     4. **Estadão Saúde & Bem-Estar:** Cobertura de ponta sobre inovações hospitalares, SUS e guias práticos de saúde familiar e prevenção.
     5. **Veja Saúde (Editora Abril):** O ecossistema de jornalismo de saúde mais tradicional e popular do país, cobrindo rotinas, medicamentos e exames.
   - *Sociedades Médicas & Clínicas Especializadas:* **Sociedade Brasileira de Cardiologia (SBC)**, **SOCESP**, **SBEM**, **SBD**, **Incor**, **Hospital Israelita Albert Einstein**, **Hospital Sírio-Libanês**.
   - *Radares & Medicina Preventiva:* **Dr. Peter Attia (The Drive)**, **FoundMyFitness (Dra. Rhonda Patrick)**.
   - *Globais & Biotecnologia:* The Lancet, JAMA Network, Healthline, Psychology Today, Nature Medicine, BBC Health, **Longevity.Technology**, **STAT News**, **Endpoints News**.
5. **Estética & Beleza:**
   - *Nacionais & Sociedades Médicas:* Sociedade Brasileira de Dermatologia (SBD), Vogue Brasil Beleza, Marie Claire Beleza, Glamour Beleza, Lilian Pacce, Cosmopolitan Brasil, Beleza na Web Editorial.
   - *Matrizes Populares de Grande Alcance, Indústria & Ciência (+10):*
     1. **ABIHPEC (Associação Brasileira da Indústria de Higiene Pessoal, Perfumaria e Cosméticos):** Dados oficiais de mercado, exportações e comportamento de consumo da beleza no Brasil.
     2. **Anvisa (Regulação de Cosméticos & Estética):** Autoridade sanitária federal para aprovações de novos ativos, restrições e segurança em procedimentos estéticos.
     3. **Steal The Look & Ela (O Globo):** Portais de enorme alcance popular em tendências acessíveis, beleza cotidiana e movimentos de consumo jovem.
     4. **SBCP (Sociedade Brasileira de Cirurgia Plástica):** Autoridade médica nacional para estatísticas e diretrizes de procedimentos estéticos e segurança clínica.
     5. **Sociedade Brasileira do Cabelo (SBC / ABT - Tricologia):** Fontes de ponta sobre saúde capilar, tratamentos para alopecia, transplantes e cuidados com fios naturais.
     6. **G1 Beleza & Universa (UOL):** Cobertura massiva sobre autoestima, rotinas reais de cuidados, debates sobre padrões estéticos e consumo consciente.
     7. **Harper's Bazaar Brasil & Elle Brasil (Beleza):** Referências editoriais em perfumaria de nicho, clean beauty e movimentos internacionais de estética.
     8. **Mintel Beauty & Personal Care:** Instituto global de inteligência de consumo mapeando lançamentos e preferências reais de compra em massa.
     9. **Euromonitor International (Beauty & Fashion):** Dados estatísticos globais e regionais sobre crescimento de categorias como nutricosméticos e beleza masculina.
     10. **Journal of Cosmetic Dermatology (Wiley) & PubMed Estética:** Periódicos internacionais revisados por pares para validar a eficácia científica real de ingredientes e dispositivos.
   - *Radares & Tendências:* **Bits to Brands (Beatriz Guarezi)**, **Noor Skin**.
   - *Globais, Periódicos & Big Data:* **JEADV (Journal of the European Academy of Dermatology and Venereology)**, **American Academy of Dermatology (AAD)**, Allure, Cosmetics & Toiletries, Business of Fashion (Beauty), Byrdie, WWD, **BeautyMatter**, **Spate NYC (Big Data de Busca)**, **Global Wellness Summit (GWS)**.
6. **Estilo de Vida & Viagens:**
   - *Nacionais & Associações:* **Associação Brasileira de Ecoturismo e Turismo de Aventura (ABETA)**, Embratur, Viagem e Turismo (Abril), Melhores Destinos, Guia Viajar Melhor, GQ Brasil, Casa Vogue, Forbes Life Brasil.
   - *Matrizes Populares de Grande Alcance, Cultura & Mobilidade (+10):*
     1. **G1 Turismo e Viagem & Globo Repórter:** O maior canal de massa sobre roteiros nacionais, vistos, direitos do passageiro aéreo e tendências de viagem no Brasil.
     2. **Folha de S.Paulo (Turismo & Ilustrada):** Cobertura de referência em viagens culturais, gastronomia, moradia e transformações no estilo de vida urbano.
     3. **Estadão (Viagem & Casa e Decoração):** Guia consolidado de destinos, hotelaria, arquitetura cotidiana e design residencial no país.
     4. **ANAC & Ministério do Turismo:** Dados oficiais sobre abertura de rotas aéreas diretas, fluxo de passageiros e políticas de turismo sustentável.
     5. **Casa e Jardim (Globo) & ArchDaily Brasil:** As maiores autoridades de alcance popular em arquitetura, moradia contemporânea, coliving e design de interiores.
     6. **Paladar (Estadão) & Prazeres da Mesa:** Referências máximas em cultura gastronômica, ingredientes brasileiros, agricultura familiar e hospitalidade afetiva.
     7. **Kayak Trends & Skyscanner Travel Insights:** Big data de buscas aéreas revelando em tempo real para onde os brasileiros estão viajando.
     8. **Airbnb Newsroom & Booking.com Travel Predictions:** Relatórios globais baseados em bilhões de reservas sobre trabalho remoto, nômades digitais e formatos de hospedagem.
     9. **Wallpaper\* & Architectural Digest (Global):** Principais vitrines globais de estilo de vida, arquitetura inovadora e design de espaços inspiradores.
     10. **Time Out (Global & Brasil):** Referência mundial em cultura de rua, bairros em ascensão, gastronomia urbana e roteiros autênticos fora do óbvio.
   - *Radares & Inteligência de Viagem:* **Skift (Daily Briefing & Trends)**, **Robb Report**, **Afar Magazine**, **Luxury Travel Intelligence (LTI)**, **DarkSky International (Astroturismo & Noctourism)**.
   - *Globais:* Condé Nast Traveler, Lonely Planet, Travel + Leisure, National Geographic Travel.
7. **Tendências:**
   - *Nacionais:* Consumidor Moderno, Fast Company Brasil, Meio & Mensagem, StartSe.
   - *Matrizes Populares de Grande Alcance & Autoridade (+5):*
     1. **Época Negócios & Exame Tendências:** Os maiores veículos populares de tendências corporativas, novos mercados e futuro do trabalho no Brasil.
     2. **Wired & Gizmodo Brasil:** Gigantes da cultura pop e tecnologia de massa, traduzindo grandes inovações e novos hábitos de consumo para o grande público.
     3. **Google Trends & Think with Google Brasil:** A maior matriz de inteligência de busca em tempo real do planeta, revelando os reais interesses e intenções da população brasileira.
     4. **StartSe & Meio & Mensagem:** Cobertura de massa do varejo, publicidade, startups e novos produtos que chegam ao mercado brasileiro.
     5. **Fast Company (Global & Brasil):** Um dos maiores veículos de inovação do mundo, conectando tendências de consumo, marcas transformadoras e design de vida.
   - *Radares de Indústria, Mobilidade & Vanguarda:* **ANAC & IATA (Aviação/eVTOLs)**, **Eve Air Mobility / Embraer**, **Embrapa (Bioeconomia e Sintéticos)**, **IEEE Spectrum**, **MIT Technology Review Pro**.
   - *Radares & Macrotendências:* **VOX Insights Weekly**, **WGSN Insider**, **TrendWatching**, **Springwise**.
   - *Globais:* Fast Company, Wired Culture, **Puck News**, **Canvas8**.
8. **Comportamento:**
   - *Nacionais:* Consumidor Moderno (Comportamento), Folha Cotidiano, Estadão Comportamento, The Shift (B9).
   - *Matrizes Populares de Grande Alcance & Autoridade (+5):*
     1. **UOL Notícias & VivaBem Comportamento:** O portal horizontal de maior tráfego do Brasil, captando o pulso dos costumes, dilemas de relacionamento e vida cotidiana.
     2. **Tab UOL / Canal Futura (Fundação Roberto Marinho):** Jornalismo premiado de juventude, cultura urbana, transformações sociais e comportamento de massa no Brasil.
     3. **Nexo Jornal / Piauí (Comportamento & Sociedade):** Jornalismo de contexto, dados e narrativas sobre mudanças geracionais, novos formatos de família e convivência.
     4. **The Atlantic & Vox (Culture & Society):** Gigantes do jornalismo cultural de massa global, antecipando conversas sobre trabalho, comunidade e relações sociais.
     5. **Consumidor Moderno & Instituto Datafolha / Ipec:** As maiores matrizes de pesquisas de opinião pública e pesquisas por amostragem populacional do Brasil.
   - *Demografia, Políticas Públicas & Leis:* **Censo IBGE & PNAD Contínua**, **Ministério da Educação (MEC)**, **Agência Senado / Legislação Federal**, **IPEA & FGV Social**.
   - *Radares & Mudança Social:* **VOX Insights**, **GWI (GlobalWebIndex)**, **Pew Research**.
   - *Globais:* The Atlantic (Culture), Vox Media, Dazed, BBC Worklife.
9. **Sustentabilidade:**
   - *Nacionais, Regulação & Energia:* **Agência Nacional do Petróleo, Gás Natural e Biocombustíveis (ANP / ProBioQAV)**, **Empresa de Pesquisa Energética (EPE)**, Capital Reset, Exame ESG, Um Só Planeta (Globo), Página 22.
   - *Matrizes Populares de Grande Alcance, Clima, Cidades & Economia Circular (+10):*
     1. **G1 Meio Ambiente & Fantástico (Globo):** O maior canal de alcance popular no país para eventos climáticos, soluções urbanas, reciclagem e impactos ambientais no cotidiano.
     2. **Folha de S.Paulo (Ambiente & Clima):** Cobertura jornalística de referência sobre políticas ambientais, transição energética, COPs e infraestrutura verde.
     3. **BBC News Brasil (Meio Ambiente & Ciência):** Reportagens explicativas de grande alcance sobre inovações ecológicas globais, crise hídrica e soluções climáticas práticas.
     4. **Conexão Planeta & CicloVivo:** Portais brasileiros líderes junto ao grande público sobre economia circular, cidades sustentáveis, agroecologia e consumo consciente.
     5. **Instituto Ethos & Pacto Global da ONU (Rede Brasil):** Principais referências corporativas em governança socioambiental (ESG), metas climáticas empresariais e economia regenerativa.
     6. **MapBiomas & Observatório do Clima:** Autoridade científica e geoespacial de classe mundial sobre uso da terra, restauração florestal, carbono e biomas brasileiros.
     7. **Embrapa Meio Ambiente & Embrapa Florestas:** Autoridade máxima em agricultura regenerativa, fixação de carbono no solo, bioinsumos e manejo sustentável no campo.
     8. **WRI Brasil (World Resources Institute):** Think tank focado em mobilidade urbana limpa (ônibus elétricos), planejamento de cidades resilientes ao calor e infraestrutura hídrica.
     9. **Ellen MacArthur Foundation (Economia Circular):** A maior referência global em economia circular, redesign de embalagens, redução de plásticos e reutilização industrial.
     10. **Yale Environment 360 & Mongabay Brasil:** Jornalismo ambiental investigativo de prestígio internacional sobre biodiversidade, conservação e novas tecnologias ecológicas.
   - *Radares, Transição Ecológica & Baterias:* **BloombergNEF (BNEF - Energy Storage & Clean Energy)**, **CleanTechnica**, **ESG Today**, **Reuters Sustainable Business**, **Bloomberg Green**, **IATA Sustainability (Sustainable Aviation Fuel - SAF)**.

---

## 2. Fila Estratégica de Pautas & Filtro Anti-Duplicidade

Antes de aprovar ou formular qualquer nova pauta:
1. **Consulte a Fila Estratégica de Pautas:** Verifique o arquivo `scripts/editorial-queue.json` para inspecionar pautas prioritárias já validadas e em espera por categoria.
2. **Consulte o Histórico Publicado:** Leia `scripts/published-history.json` para verificar se o tema central, as palavras-chave principais ou o ângulo já foram abordados nos últimos **30 dias**.
3. **Rejeite temas repetitivos:** Se for uma evolução de um caso anterior, destaque o **novo fato** como gancho obrigatório.

---

## 3. Critérios E-E-A-T & Verificação de Fatos para Google Search Console e IAs
- Pelo menos **2 fontes de alta autoridade** devem corroborar os fatos.
- Pelo menos **1 dado estatístico ou número comprovado** (ex: porcentagens de crescimento, valores de aportes, dados de pesquisas científicas ou órgãos oficiais como IBGE, Anvisa, SEC, etc.).
- **Mapeamento de Entidades Nomeadas (NER):** Identificar os nomes próprios exatos de instituições, leis/resoluções, empresas e tecnologias envolvidas para indexação no Google Knowledge Graph e RAGs de IA.
- **Mapeamento de Dúvidas Comuns (People Also Ask):** Mapear 2 a 3 perguntas que usuários fazem no Google sobre o tema para estruturar a seção de FAQ da redação.
- Janela de atualidade: acontecimentos das últimas **24 a 48 horas** (ou no máximo 72h para análises de tendências aprofundadas).

---

## 4. Contrato de Saída Obrigatório: Briefing JSON

O resultado final do trabalho da `onda-researcher` deve ser entregue estritamente no seguinte formato estruturado:

```json
{
  "topic": "<Título de trabalho da pauta>",
  "category": "<Uma das categorias válidas do portal>",
  "urgency_score": <1 a 10, onde 10 é furo urgente>,
  "national_relevance_angle": "<Explicação de 2-3 frases sobre o impacto direto para o Brasil ou leitor brasileiro>",
  "named_entities": [
    "<Entidade/Órgão 1>",
    "<Empresa/Lei 2>"
  ],
  "primary_sources": [
    { "name": "<Nome do Veículo>", "url": "<URL ou referência da matéria>" }
  ],
  "key_data_points": [
    "<Dado quantitativo ou estatística 1>",
    "<Dado quantitativo ou estatística 2>"
  ],
  "common_questions_paa": [
    "<Pergunta 1 que os usuários pesquisam no Google>",
    "<Pergunta 2 que os usuários pesquisam no Google>"
  ],
  "target_keywords": [
    "<palavra-chave 1>",
    "<palavra-chave 2>",
    "<palavra-chave 3>"
  ],
  "suggested_slug": "<slug-amigavel-separado-por-hifens>"
}
```
