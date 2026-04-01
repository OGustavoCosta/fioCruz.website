// ─────────────────────────────────────────────
// Estado
// ─────────────────────────────────────────────
const state = {
  municipios: [],
  selecionado: null,
  dropdownOpen: false
}

// ─────────────────────────────────────────────
// Helpers de classificação
// ─────────────────────────────────────────────
function getPrioridade(escore) {
  if (escore < 25) return { label: 'ALTÍSSIMA', mod: 'altissima' }
  if (escore < 50) return { label: 'ALTA',      mod: 'alta' }
  if (escore < 75) return { label: 'MÉDIA',     mod: 'media' }
  return              { label: 'BAIXA',      mod: 'baixa' }
}

function getPerformance(valor) {
  if (valor < 0.6) return { mod: 'insuf' }
  if (valor < 0.8) return { mod: 'mod' }
  return              { mod: 'adeq' }
}

// ─────────────────────────────────────────────
// Renderização: badge de prioridade
// ─────────────────────────────────────────────
const BADGE_CLASSES = {
  altissima: 'bg-red-100 text-red-700',
  alta:      'bg-orange-100 text-orange-700',
  media:     'bg-amber-100 text-amber-700',
  baixa:     'bg-teal-light text-teal-dark'
}

const SCORE_COLORS = {
  altissima: 'text-red-700',
  alta:      'text-orange-600',
  media:     'text-amber-600',
  baixa:     'text-teal'
}

function renderBadge(escore, prefixo = '') {
  const p = getPrioridade(escore)
  return `<span class="self-start inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${BADGE_CLASSES[p.mod]}">${prefixo}${p.label}</span>`
}

// ─────────────────────────────────────────────
// Renderização: 4 cards de dimensão
// ─────────────────────────────────────────────
const DIMENSOES = [
  { key: 'desenvolvimento_sustentavel', label: 'Desenvolvimento Sustentável em Saúde' },
  { key: 'recursos_infraestrutura',     label: 'Recursos e Infraestrutura em Saúde' },
  { key: 'aspectos_populacionais',      label: 'Aspectos Populacionais' },
  { key: 'vulnerabilidade_social',      label: 'Vulnerabilidade Social' }
]

function renderDimensoes(municipio) {
  return DIMENSOES.map(d => {
    const escore = municipio.dimensoes[d.key]
    const p = getPrioridade(escore)
    return `
      <div class="indicatorsDashboardPage__dimensionCard--${p.mod} flex flex-col gap-2 border border-neutral-150 border-t-4 rounded-xl p-4">
        <span class="text-xs font-semibold text-neutral-400 uppercase tracking-wide leading-snug">${d.label}</span>
        <span class="text-3xl font-extrabold text-neutral-500">${escore.toFixed(2).replace('.', ',')}</span>
        ${renderBadge(escore)}
      </div>
    `
  }).join('')
}

// ─────────────────────────────────────────────
// Renderização: card de resumo
// ─────────────────────────────────────────────
function renderSummary(municipio) {
  const p = getPrioridade(municipio.escore_final)
  return `
    <div class="flex flex-col gap-0.5">
      <span class="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Nível de Priorização</span>
      <span class="text-lg sm:text-2xl font-bold text-neutral-500">${municipio.nome} — ${municipio.uf}</span>
    </div>
    <div class="flex items-center gap-3">
      <span class="text-3xl sm:text-4xl font-extrabold ${SCORE_COLORS[p.mod]}">${municipio.escore_final.toFixed(2).replace('.', ',')}</span>
      <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${BADGE_CLASSES[p.mod]}">PRIORIDADE ${p.label}</span>
    </div>
  `
}

// ─────────────────────────────────────────────
// Renderização: 7 barras de eixo temático
// ─────────────────────────────────────────────
const EIXOS = [
  { key: 'saude_recem_nascido', label: 'Saúde do recém-nascido e criança' },
  { key: 'doencas_infecciosas', label: 'Doenças infecciosas' },
  { key: 'lesoes_violencias',   label: 'Lesões e violências' },
  { key: 'doencas_cronicas',    label: 'Doenças crônicas não transmissíveis' },
  { key: 'saude_reprodutiva',   label: 'Saúde reprodutiva e materna' },
  { key: 'risco_ambiental',     label: 'Risco ambiental' },
  { key: 'cobertura_universal', label: 'Cobertura universal de saúde e sistemas' }
]

function renderEixos(municipio) {
  return EIXOS.map(e => {
    const valor = municipio.eixos[e.key]
    const perf  = getPerformance(valor)
    const pct   = Math.round(valor * 100)
    return `
      <div role="listitem">
        <div class="flex justify-between items-baseline mb-1.5">
          <span class="text-sm font-medium text-neutral-500">${e.label}</span>
          <span class="indicatorsDashboardPage__barScore--${perf.mod} text-sm font-bold ml-4 shrink-0">${valor.toFixed(2).replace('.', ',')}</span>
        </div>
        <div class="h-3 w-full bg-neutral-100 rounded-full overflow-hidden"
             role="progressbar"
             aria-valuenow="${pct}"
             aria-valuemin="0"
             aria-valuemax="100"
             aria-label="${e.label}: ${valor.toFixed(2)}">
          <div class="indicatorsDashboardPage__barFill--${perf.mod} h-full rounded-full transition-all duration-500"
               style="width:${pct}%"></div>
        </div>
      </div>
    `
  }).join('')
}

// ─────────────────────────────────────────────
// Atualizar UI com município selecionado
// ─────────────────────────────────────────────
function selecionarMunicipio(municipio) {
  state.selecionado = municipio

  const valueEl = document.getElementById('municipio-select-value')
  if (valueEl) valueEl.textContent = `${municipio.nome} — ${municipio.uf}`

  const cards = document.getElementById('etapa1-dimensoes')
  if (cards) cards.innerHTML = renderDimensoes(municipio)

  const summary = document.getElementById('etapa1-summary')
  if (summary) summary.innerHTML = renderSummary(municipio)

  const eixos = document.getElementById('etapa2-eixos')
  if (eixos) eixos.innerHTML = renderEixos(municipio)
}

// ─────────────────────────────────────────────
// Dropdown de municípios
// ─────────────────────────────────────────────
function renderDropdownOpcoes(filtro = '') {
  const termo = filtro.toLowerCase().trim()
  const lista = state.municipios
    .filter(m => !termo || m.nome.toLowerCase().includes(termo) || m.uf.toLowerCase().includes(termo))
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))

  if (lista.length === 0) {
    return '<li class="px-4 py-3 text-sm text-neutral-400 text-center">Nenhum município encontrado.</li>'
  }

  return lista.map(m => `
    <li>
      <button
        type="button"
        data-id="${m.id}"
        class="w-full text-left px-4 py-3 text-sm text-neutral-500 hover:bg-neutral-50 transition-colors flex items-center justify-between gap-3"
        role="option"
        aria-selected="${state.selecionado?.id === m.id}"
      >
        <span>${m.nome}</span>
        <span class="text-xs text-neutral-400 shrink-0 font-semibold">${m.uf}</span>
      </button>
    </li>
  `).join('')
}

function setupDropdown() {
  const trigger  = document.getElementById('municipio-select-trigger')
  const dropdown = document.getElementById('municipio-select-dropdown')
  if (!trigger || !dropdown) return

  const chevron = trigger.querySelector('[data-lucide="chevron-down"]')

  const abrirDropdown = () => {
    state.dropdownOpen = true
    dropdown.innerHTML = renderDropdownOpcoes()
    dropdown.classList.remove('hidden')
    trigger.setAttribute('aria-expanded', 'true')
    chevron?.classList.add('rotate-180')
  }

  const fecharDropdown = () => {
    state.dropdownOpen = false
    dropdown.classList.add('hidden')
    trigger.setAttribute('aria-expanded', 'false')
    chevron?.classList.remove('rotate-180')
  }

  trigger.addEventListener('click', (e) => {
    e.stopPropagation()
    state.dropdownOpen ? fecharDropdown() : abrirDropdown()
  })

  dropdown.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-id]')
    if (!btn) return
    const municipio = state.municipios.find(m => m.id === btn.dataset.id)
    if (!municipio) return
    selecionarMunicipio(municipio)
    fecharDropdown()
  })

  document.addEventListener('click', (e) => {
    if (!trigger.contains(e.target) && !dropdown.contains(e.target)) {
      fecharDropdown()
    }
  })

  // Escape fecha o dropdown
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.dropdownOpen) {
      fecharDropdown()
      trigger.focus()
    }
  })
}

// ─────────────────────────────────────────────
// Botões de filtro do mapa (Resultados Gerais)
// ─────────────────────────────────────────────
function setupMapButtons() {
  const btns = document.querySelectorAll('.indicatorsDashboardPage__mapBtn')
  btns.forEach(btn => {
    btn.addEventListener('click', function () {
      btns.forEach(b => {
        b.classList.remove('is-active')
        b.setAttribute('aria-pressed', 'false')
      })
      this.classList.add('is-active')
      this.setAttribute('aria-pressed', 'true')
    })
  })
}

// ─────────────────────────────────────────────
// Carregar dados e inicializar
// ─────────────────────────────────────────────
function carregarDados() {
  fetch('/api/indicadores')
    .then(r => r.json())
    .then(data => {
      state.municipios = data.municipios
      setupDropdown()

      // Belo Horizonte como padrão (dados do PDF já presentes no HTML)
      const padrao = state.municipios.find(m => m.nome === 'Belo Horizonte') ?? state.municipios[0]
      if (padrao) selecionarMunicipio(padrao)
    })
    .catch(err => console.error('Erro ao carregar indicadores:', err))
}

document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons()
  carregarDados()
  setupMapButtons()
})
