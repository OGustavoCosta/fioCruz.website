# Acessibilidade — Referência para Desenvolvimento

> Documento de referência para devs e IAs realizarem varreduras e manter a acessibilidade do projeto.
> Padrão-alvo: **eMAG** (Modelo de Acessibilidade em Governo Eletrônico) + **WCAG 2.1 AA**.

---

## Implementações existentes

### 1. Idioma (`lang`)
- **Arquivo:** `templates/layout.html`
- **Implementação:** `<html lang="pt-BR">`
- **Impacto:** Leitores de tela pronunciam o conteúdo corretamente em português brasileiro.

---

### 2. Skip to content
- **Arquivo:** `templates/layout.html`, `static/css/accessibility/accessibility.css`
- **Implementação:** `<a href="#main" class="skip-link">Pular para o conteúdo principal</a>` inserido como primeiro filho de `<body>`. O `<main>` tem `id="main"`.
- **Comportamento:** Visualmente oculto (`top: -100%`), aparece no foco via teclado com `top: 0`.
- **Regra eMAG:** Recomendação 1.7.

---

### 3. Alto contraste
- **Arquivos:** `static/js/accessibility.js`, `static/css/accessibility/high-contrast.css`, `templates/layout.html`
- **Implementação:**
  - Botão fixo `#btn-alto-contraste` com `aria-pressed` sincronizado.
  - Ativa/desativa a classe `html.high-contrast`.
  - Preferência persistida em `localStorage` com três estados:
    - `'1'` = usuário ativou explicitamente
    - `'0'` = usuário desativou explicitamente
    - `null` = nunca configurou (usa preferência do SO)
  - Ativa automaticamente se o SO tiver `prefers-contrast: more` e não houver preferência salva.
  - Reage a mudanças do SO em tempo real via `matchMedia.addEventListener('change', ...)`.
- **Cores (WCAG AAA, razão 7:1):** fundo `#000000`, texto `#ffffff`, links/destaque `#fff333`.

---

### 4. Links em alto contraste
- **Arquivo:** `static/css/accessibility/high-contrast.css`
- **Implementação:**
  ```css
  html.high-contrast a,
  html.high-contrast a[href] {
    color: #fff333 !important;
    text-decoration: underline !important;
  }
  ```
- **Atenção:** O seletor `a[href]` tem especificidade `(0,2,2)` para superar classes Tailwind de cor como `.text-white` `(0,2,1)`. Se adicionar novos links com classes de cor, esse par de seletores já cobre. Se criar seletores de cor com **duas ou mais classes** (ex: `html.high-contrast .grupo .texto`), pode ser necessário adicionar um override específico.

---

### 5. Ajuste de tamanho de fonte (A- / A / A+)
- **Arquivos:** `static/js/accessibility.js`, `static/css/accessibility/accessibility.css`, `templates/layout.html`
- **Implementação:**
  - Grupo de botões `.fontSize__group` fixo na lateral direita.
  - Altera `html.style.fontSize`: `87.5%` (pequeno) / `100%` (normal) / `112.5%` (grande).
  - Persistido em `localStorage` com chave `'tamanho-fonte'`.
  - `aria-pressed` sincronizado em cada botão.
- **Atenção:** Tamanhos de fonte definidos em `rem` respondem automaticamente. Tamanhos em `px` no CSS customizado **não** respondem — evitar `px` para fontes.

---

### 6. VLibras
- **Arquivo:** `templates/layout.html`
- **Implementação:** Widget oficial do governo federal. O botão "Acessibilidade" no drawer mobile (`#botao-acessibilidade`) abre/fecha o widget via JS.

---

### 7. `prefers-reduced-motion`
- **Arquivo:** `static/css/accessibility/accessibility.css`
- **Implementação:**
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```
- **Cobertura:** `animate-spin` (loader do mapa), `animate-pulse` (skeleton da lista), `transition-transform` (drawer), `transition-opacity` (overlay), todos os `transition-all` e `hover:-translate-y-*` do Tailwind.
- **Atenção:** Ao adicionar novas animações via JS (ex: `requestAnimationFrame`, `setTimeout` para efeitos visuais), verificar `window.matchMedia('(prefers-reduced-motion: reduce)').matches` e pular a animação se `true`.

---

### 8. Focus visible
- **Arquivo:** `static/css/accessibility/accessibility.css`
- **Implementação:**
  ```css
  :focus-visible {
    outline: 3px solid #00796B;
    outline-offset: 3px;
    border-radius: 2px;
  }
  ```
- **Contextos escuros** (header, filtros, chart panel): `outline-color: #ffffff`.
- **Alto contraste:** `outline-color: #fff333 !important`.
- **Atenção:** Não usar `outline: none` ou `focus:outline-none` (Tailwind) em elementos interativos. Se precisar de foco customizado por design, usar `:focus-visible` com estilo próprio — nunca remover sem substituir.

---

### 9. Drawer mobile — semântica e comportamento de teclado
- **Arquivos:** `templates/components/header.html`, `static/js/header.js`
- **Implementação:**
  - `<aside role="dialog" aria-modal="true" aria-label="Menu de navegação">`
  - Botões hamburguer: `aria-expanded="false/true"` + `aria-controls="header__drawer"` — atualizados via JS ao abrir/fechar.
  - **Trap de foco:** Tab e Shift+Tab circulam dentro do drawer enquanto está aberto.
  - **Escape:** fecha o drawer.
  - **Foco inicial:** ao abrir, foco vai para o primeiro elemento focável do drawer.
  - **Foco de retorno:** ao fechar, foco volta ao botão que abriu o drawer.

---

### 10. Widgets de acessibilidade — ocultar no footer
- **Arquivos:** `static/js/accessibility.js`, `static/css/accessibility/accessibility.css`
- **Implementação:** `IntersectionObserver` no `<footer>`. Quando o footer entra na viewport, aplica `.a11y-hidden` (`opacity: 0; pointer-events: none`) nos widgets `.fontSize__group` e `#btn-alto-contraste`.

---

### 11. ARIA em elementos interativos
- **Arquivo:** vários
- **Implementação atual:**
  - Botões de toggle (IED, comparação, fonte, contraste): `aria-pressed`
  - Botões hamburguer: `aria-label`, `aria-expanded`, `aria-controls`
  - Botão fechar drawer: `aria-label="Fechar menu"`
  - Dropdown de índice: `id="indice-select"`, trigger com `id="indice-select-trigger"`

---

### 12. Imagens
- **Arquivos:** `templates/components/header.html`, `templates/components/footer.html`
- **Implementação atual:**
  - Logos da Fiocruz: `alt="FioCruz"`
  - Logo SUS: `alt="Sistema Único de Saúde (SUS)"`
  - Logo Showcase: `alt="Fiocruz Showcase"` ← **confirmar texto correto**
- **Regra:** imagens informativas → `alt` descritivo; imagens decorativas → `alt=""`.

---

## Pendências conhecidas

| # | Item | Prioridade | Observação |
|---|------|------------|------------|
| 1 | ARIA live region para dados dinâmicos | Média | Quando mapa/lista atualiza via JS, leitores de tela não são notificados. Adicionar `aria-live="polite"` em um elemento de status. |
| 2 | Alternativa textual para o mapa Leaflet | Média | Leaflet não é acessível nativamente. Considerar tabela/lista `sr-only` com os dados exibidos. |
| 3 | Verificação de contraste de cores | Média | Tons de teal claro sobre fundo branco podem não atingir 4.5:1 (WCAG AA). Checar com [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/). |
| 4 | `prefers-color-scheme: dark` | Baixa | Modo escuro automático pelo SO (diferente do alto contraste). |
| 5 | `alt` do logo Showcase | Baixa | Confirmar o nome/descrição corretos da imagem `logo-showcase.png`. |

---

## Convenções do projeto

### Arquivos de acessibilidade
```
static/css/accessibility/
  accessibility.css     ← skip link, font size, focus visible, reduced motion, .a11y-hidden
  high-contrast.css     ← tudo relacionado a html.high-contrast

static/js/
  accessibility.js      ← alto contraste, ajuste de fonte, ocultar no footer
  header.js             ← drawer: trap de foco, aria-expanded, escape
```

### Classes CSS de acessibilidade
| Classe | Uso |
|--------|-----|
| `.skip-link` | Link "pular para conteúdo" |
| `.fontSize__group` | Container dos botões A-/A/A+ |
| `.fontSize__btn` | Botão individual de tamanho |
| `.highContrast__btn` | Botão de alto contraste |
| `.a11y-hidden` | Oculta widget visualmente sem remover do DOM |
| `html.high-contrast` | Ativa overrides de alto contraste |

### Checklist para novos componentes

Ao criar um novo componente interativo, verificar:

- [ ] Elemento semântico correto (`<button>` para ação, `<a>` para navegação)
- [ ] `aria-label` se o texto visível não descreve a ação (ex: ícone sem texto)
- [ ] `aria-pressed` se for toggle
- [ ] `aria-expanded` + `aria-controls` se abrir/fechar outro elemento
- [ ] `aria-live="polite"` se o conteúdo ao redor atualiza dinamicamente
- [ ] Foco visível via `:focus-visible` (não remover outline sem substituir)
- [ ] Funciona só com teclado (Tab, Enter, Escape onde aplicável)
- [ ] Cores com contraste mínimo 4.5:1 (AA) — verificar em alto contraste também
- [ ] Animações respeitam `prefers-reduced-motion`
- [ ] Imagens com `alt` descritivo ou `alt=""` se decorativa
- [ ] Tamanhos de fonte em `rem`, não `px`
