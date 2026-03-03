# Observatório da Saúde para a Agenda 2030

Aplicação web Flask para visualização de indicadores de desenvolvimento sustentável em saúde no Brasil, desenvolvida para a Fiocruz.

## Tecnologias

- **Backend:** Python + Flask
- **Templates:** Jinja2
- **Estilo:** Tailwind CSS v3 (CDN) + CSS customizado
- **Ícones:** Lucide
- **Mapas:** Leaflet.js
- **Deploy:** Vercel

## Estrutura

```
fiocruz-flask/
├── app.py                        # Aplicação Flask e rotas
├── requirements.txt              # Dependências Python
├── vercel.json                   # Configuração de deploy
├── data/
│   └── dashboard.json            # Dados do painel (municipios, indices)
├── static/
│   ├── css/
│   │   ├── main.css              # Entrypoint CSS
│   │   ├── base/
│   │   │   ├── base.css          # Variáveis CSS globais
│   │   │   └── typography.css    # @font-face (Rawline)
│   │   └── pages/
│   │       └── dataDashboardPage.css
│   ├── fonts/                    # Fonte Rawline (TTF)
│   ├── images/
│   │   ├── header/               # Logos do header
│   │   └── footer/               # Logos do footer
│   └── js/
│       ├── header.js             # Lógica do menu mobile
│       └── data_dashboard.js     # Painel de dados (mapa, filtros, comparativo)
└── templates/
    ├── layout.html               # Template base
    ├── components/
    │   ├── header.html
    │   └── footer.html
    └── pages/
        ├── data_dashboard.html
        ├── indicators_dashboard.html
        ├── library.html
        ├── publications.html
        └── about.html
```

## Rotas

| Rota | Página |
|------|--------|
| `/` | Painel de Dados |
| `/painel-de-indicadores` | Painel de Indicadores |
| `/biblioteca` | Biblioteca |
| `/publicacoes` | Publicações |
| `/sobre` | Sobre |
| `/api/dashboard` | API — retorna `dashboard.json` |

## Desenvolvimento local

**Pré-requisitos:** Python 3.10+

```bash
# Criar e ativar ambiente virtual
python -m venv fiocruz-venv
source fiocruz-venv/bin/activate  # Linux/Mac
fiocruz-venv\Scripts\activate     # Windows

# Instalar dependências
pip install -r requirements.txt

# Iniciar servidor
python app.py
```

Acesse `http://localhost:5000`.

## Dados

O painel de dados consome `data/dashboard.json`, que deve seguir o formato:

```json
{
  "municipios": [
    {
      "nome": "Nome do Município",
      "uf": "UF",
      "indice": 0.82,
      "populacao": "100.000",
      "area": "1.234 km²",
      "regiao": "Sudeste",
      "lat": -23.5,
      "lng": -46.6
    }
  ],
  "indices": ["Nome do Índice 1", "Nome do Índice 2"]
}
```

Quando vazio (`{}`), o painel exibe um estado de dados indisponíveis mantendo o cabeçalho e informativo visíveis.

## Deploy (Vercel)

Conecte o repositório no [vercel.com](https://vercel.com). O `vercel.json` já está configurado para o runtime Python.
