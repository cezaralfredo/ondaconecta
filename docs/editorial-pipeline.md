# 🧭 Onda Conecta — Pipeline Editorial Estratégico (Fila de Pautas)

Este documento organiza a **fila estruturada de pautas prioritárias de alta conversão e audiência popular**, alimentadas pelos novos radares de vanguarda e inteligência de dados integrados à skill `onda-researcher`.

---

## 📑 Visão Geral da Fila por Categoria (9 Verticais)

| Vertical | Pauta Prioritária 1 | Pauta Prioritária 2 | Fontes / Radares Chave |
| :--- | :--- | :--- | :--- |
| **Inovação & IA** | *World Models e IA Espacial 3D na Arquitetura e Varejo* | *Small Language Models (SLMs) e NPUs Corporativas* | Stratechery, TLDR AI, TechDrop, The Brief |
| **Mercado & Negócios** | *Bootstrapping Turbinado: Startups Rentáveis sem VC* | *Data Centers Verdes e Nuvem Limpa no Brasil* | DealflowBR, Bloomberg, PitchBook, Endeavor |
| **Finanças Pessoais** | *Carteira Antifrágil de Dividendos (FIIs/Fiagro Isentos)* | *Cartões Ultra Premium e Isenção de Anuidade* | Bora Investir (B3), Finsiders, FlipMilhas |
| **Saúde & Bem-estar** | *GLP-1 Orais e Combate à Sarcopenia / Músculo* | *Engenharia do Sono Profundo e Protocolo Circadiano* | STAT News, Peter Attia, FoundMyFitness |
| **Estética & Beleza** | *PDRN (DNA de Salmão) e Biorregeneração Celular* | *Skinimalism Clínico (Cleanical Beauty com 3 Ativos)* | BeautyMatter, Spate NYC, Bits to Brands |
| **Estilo de Vida & Viagens** | *Guia do Stopover Inteligente (2 Cidades em 1 Voo)* | *Rota dos Lodges de Altitude e Vinícolas na Serra* | Skift, Robb Report, Luxury Travel Intelligence |
| **Tendências** | *Loud Budgeting: Disciplina Financeira como Status* | *Micro-Aposentadorias e Sabáticos Recorrentes* | VOX Insights, WGSN, TrendWatching |
| **Comportamento** | *Terceiros Lugares (Third Places) Contra a Solidão* | *Desintoxicação Dopaminérgica e Fins de Semana Dumbphone* | GWI, The Atlantic Culture, Pew Research |
| **Sustentabilidade** | *Vale do Lítio Verde e Hidrogênio Renovável* | *Madeira Engenheirada (CLT) e Arquitetura Biofílica* | CleanTechnica, Bloomberg Green, ESG Today |

---

## 🎯 Como o Agente Utiliza a Fila

1. **Seleção Round-Robin:** O orquestrador `onda-cron-agent` identifica a categoria com maior defasagem de publicação.
2. **Consulta Imediata à Fila:** Em vez de partir do zero, a `onda-researcher` consulta [editorial-queue.json](file:///e:/Projetos/onda%20conecta/scripts/editorial-queue.json), validando o frescor factual das últimas 24h e o ângulo 50/50.
3. **Consumo e Atualização:** Quando uma pauta da fila é redigida e publicada, ela é transferida automaticamente para o [published-history.json](file:///e:/Projetos/onda%20conecta/scripts/published-history.json), e uma nova pauta é reposta no topo da fila.

