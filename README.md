# Observatório da Saúde para a Agenda 2030 — FioCruz

Website do Observatório de Saúde da FioCruz, com foco em indicadores de desenvolvimento sustentável em saúde nos municípios brasileiros.

## Stack

- **React 19** + **TypeScript**
- **React Router 7** — roteamento com layout aninhado
- **Tailwind CSS 4** — estilização com `@theme` para tokens customizados
- **Leaflet** / **React Leaflet** — mapas interativos
- **Lucide React** — ícones
- **Vite 7** — build e dev server

## Estrutura do projeto

```
src/
├── assets/
│   ├── fonts/rawline/          # Fonte Rawline (100–900, regular + itálico)
│   ├── images/
│   │   ├── header/             # logo-govbr.png, logo-fiocruz.png
│   │   └── footer/             # logo-sus.png, logo-showcase.png
│   └── style/
│       ├── main.css            # Entry CSS: Tailwind + @theme + imports
│       └── base/               # base.css (variáveis CSS), typography.css
├── components/
│   ├── header/header.tsx       # Header responsivo com menu mobile drawer
│   └── footer/footer.tsx       # Footer com links e logos
├── layouts/
│   └── mainLayout/mainLayout.tsx  # Grid layout: header / main (Outlet) / footer
├── pages/
│   ├── dataDashboard/dataDashboardPage.tsx   # Painel principal (mapa, filtros, comparativo)
│   ├── indicatorsDashboard/                  # Stub — Painel de Indicadores
│   ├── library/                              # Stub — Biblioteca
│   ├── publications/                         # Stub — Publicações
│   └── about/                               # Stub — Sobre
├── routes/routes.tsx           # Definição de rotas
├── services/
│   └── dashboardService.ts     # Fetch de dados + interfaces Municipio / DashboardData
└── main.tsx                    # Ponto de entrada React

public/
└── data/dashboard.json         # Dados estáticos dos municípios (substituível por API)
```

## Rotas

| Caminho                    | Página                  |
|----------------------------|-------------------------|
| `/`                        | Painel de Dados         |
| `/painel-de-indicadores`   | Painel de Indicadores   |
| `/sobre`                   | Sobre                   |
| `/biblioteca`              | Biblioteca              |
| `/publicacoes`             | Publicações             |

## Tokens de cor (`@theme`)

| Token             | Hex       | Uso                                    |
|-------------------|-----------|----------------------------------------|
| `blue`            | `#1351b4` | Cor institucional gov.br               |
| `dark-blue`       | `#0c326f` | Variação escura do azul                |
| `dark-cyan`       | `#037478` | Header, footer                         |
| `cyan`            | `#0bb19d` | Destaques secundários                  |
| `teal`            | `#00796B` | Cor primária do dashboard              |
| `teal-dark`       | `#004D40` | Gradientes escuros, hovers             |
| `teal-light`      | `#E0F2F1` | Fundos suaves, bordas                  |
| `green`           | `#268744` | Indicadores positivos                  |
| `neutral-{shade}` | —         | Escala de cinzas (0, 50, 100 … 900)    |

## Dados e serviço

`src/services/dashboardService.ts` abstrai a origem dos dados. Para trocar o JSON estático por uma API real:

```ts
// dashboardService.ts
const API_URL = import.meta.env.VITE_API_URL ?? '/data/dashboard.json'
```

Basta definir `VITE_API_URL` no `.env`.

## Scripts

```bash
npm run dev       # Dev server (http://localhost:5173)
npm run build     # Build de produção
npm run preview   # Preview do build
npm run lint      # ESLint
```

## Deploy

O projeto inclui `vercel.json` para deploy direto na Vercel.
