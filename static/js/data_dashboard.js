// ---- Leaflet instance ----
let leafletMapInstance = null

// ---- Helpers ----
function getCorHexIndice(indice) {
  if (indice >= 0.85) return '#168821'
  if (indice >= 0.75) return '#4CAF50'
  if (indice >= 0.70) return '#FDB813'
  if (indice >= 0.65) return '#FF8C42'
  return '#E52207'
}

// ---- State ----
let state = {
  municipios: [],
  indices: [],
  iedSelecionado: 1,
  indiceSelecionado: 0,
  dropdownOpen: false,
  busca: '',
  municipioSelecionado: null,
}

// ---- Partials ----
function getMunicipiosFiltrados() {
  return state.municipios.filter(m =>
    m.nome.toLowerCase().includes(state.busca.toLowerCase()) ||
    m.uf.toLowerCase().includes(state.busca.toLowerCase())
  )
}

function renderMunicipiosList() {
  const filtrados = getMunicipiosFiltrados()
  if (filtrados.length === 0) {
    return '<li class="dataDashboardPage__municipiosEmpty text-sm text-neutral-400 py-4 text-center">Nenhum município encontrado.</li>'
  }
  return filtrados.map(m => `
    <li class="dataDashboardPage__municipiosItem">
      <button
        data-municipio="${m.nome}"
        class="dataDashboardPage__municipiosCard w-full text-left p-4 rounded-xl border-l-4 border-teal bg-gradient-to-br from-white to-teal-light transition-all duration-300 cursor-pointer hover:translate-x-1 hover:shadow-[0_4px_12px_rgba(0,121,107,0.15)] hover:border-l-[6px] ${state.municipioSelecionado === m.nome ? 'translate-x-1 shadow-[0_4px_12px_rgba(0,121,107,0.15)] !border-l-[6px]' : ''}"
      >
        <div class="dataDashboardPage__municipiosNomeRow mb-2">
          <span class="dataDashboardPage__municipiosNome text-base font-bold text-neutral-500">${m.nome}</span>
          <span class="dataDashboardPage__municipiosUf inline-block bg-teal text-white text-[11px] font-bold px-2 py-0.5 rounded ml-2">${m.uf}</span>
        </div>
        <div class="dataDashboardPage__municipiosIndiceRow flex items-baseline gap-2">
          <span class="dataDashboardPage__municipiosIndice text-[1.75rem] font-bold text-teal">${m.indice.toFixed(2)}</span>
          <span class="dataDashboardPage__municipiosIndiceLabel text-xs text-neutral-400 font-medium">IMDSS</span>
        </div>
        <div class="dataDashboardPage__municipiosDados grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-teal-light">
          <div class="dataDashboardPage__municipiosDado text-xs">
            <span class="dataDashboardPage__municipiosDadoLabel block text-neutral-400 font-medium">População</span>
            <span class="dataDashboardPage__municipiosDadoValor block text-neutral-500 font-semibold mt-0.5">${m.populacao}</span>
          </div>
          <div class="dataDashboardPage__municipiosDado text-xs">
            <span class="dataDashboardPage__municipiosDadoLabel block text-neutral-400 font-medium">Área</span>
            <span class="dataDashboardPage__municipiosDadoValor block text-neutral-500 font-semibold mt-0.5">${m.area}</span>
          </div>
          <div class="dataDashboardPage__municipiosDado text-xs">
            <span class="dataDashboardPage__municipiosDadoLabel block text-neutral-400 font-medium">Região</span>
            <span class="dataDashboardPage__municipiosDadoValor block text-neutral-500 font-semibold mt-0.5">${m.regiao}</span>
          </div>
        </div>
      </button>
    </li>
  `).join('')
}

function renderChartPanel() {
  const municipioAtual = state.municipios.find(m => m.nome === state.municipioSelecionado) ?? null
  if (municipioAtual) {
    return `
      <div class="dataDashboardPage__chartWrapper flex flex-col gap-3 flex-1">
        <h3 class="dataDashboardPage__chartTitle text-sm font-semibold text-neutral-500">
          ${municipioAtual.nome} — ${municipioAtual.uf}
        </h3>
        <div class="dataDashboardPage__chartContainer flex-1 min-h-[400px] bg-white border border-neutral-175 rounded-lg flex items-center justify-center">
          <p class="dataDashboardPage__chartPlaceholder text-neutral-400 text-sm">Gráfico comparativo de índices</p>
        </div>
      </div>
    `
  }
  return `
    <div class="dataDashboardPage__chartEmpty flex-1 flex flex-col items-center justify-center gap-4 text-neutral-400">
      <i data-lucide="bar-chart-2" class="dataDashboardPage__chartEmptyIcon opacity-30" width="48" height="48"></i>
      <p class="dataDashboardPage__chartEmptyText text-[0.9375rem] text-center">
        Selecione um município na lista ao lado<br>para visualizar o comparativo de índices
      </p>
    </div>
  `
}

function renderDropdownOptions() {
  return state.indices.map((option, i) => `
    <li class="dataDashboardPage__selectOption">
      <button
        type="button"
        data-indice="${i}"
        class="dataDashboardPage__selectOptionBtn w-full flex items-center justify-between gap-3 px-4 py-3 text-sm text-left transition-colors cursor-pointer ${state.indiceSelecionado === i ? 'bg-teal-light text-teal font-semibold' : 'text-neutral-500 hover:bg-neutral-50'}"
      >
        <span class="dataDashboardPage__selectOptionLabel">
          <span class="dataDashboardPage__selectOptionIndex text-xs font-bold text-neutral-300 mr-2">
            ${String(i + 1).padStart(2, '0')}
          </span>
          ${option}
        </span>
        ${state.indiceSelecionado === i ? `<i data-lucide="check" class="dataDashboardPage__selectOptionCheck shrink-0 text-teal" width="15" height="15"></i>` : ''}
      </button>
    </li>
  `).join('')
}

// ---- Map ----
function initMap() {
  if (leafletMapInstance) {
    try { leafletMapInstance.remove() } catch { /* container já removido */ }
    leafletMapInstance = null
  }

  const mapEl = document.getElementById('leaflet-map')
  if (!mapEl) return

  leafletMapInstance = L.map(mapEl).setView([-14.235, -51.925], 4)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(leafletMapInstance)

  state.municipios.forEach(m => {
    L.circleMarker([m.lat, m.lng], {
      fillColor: getCorHexIndice(m.indice),
      fillOpacity: 0.85,
      color: '#fff',
      weight: 2,
      radius: 8,
    })
      .bindPopup(`<strong>${m.nome} — ${m.uf}</strong><br>Índice: <strong>${m.indice.toFixed(2)}</strong><br>Pop.: ${m.populacao}<br>Região: ${m.regiao}`)
      .addTo(leafletMapInstance)
  })
}

// ---- Events ----
function setupMunicipioEvents(container) {
  container.querySelectorAll('[data-municipio]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.municipioSelecionado = btn.dataset.municipio ?? null

      const listEl = container.querySelector('#municipios-list')
      if (listEl) {
        listEl.innerHTML = renderMunicipiosList()
        setupMunicipioEvents(container)
      }

      const chartPanel = container.querySelector('#chart-panel')
      if (chartPanel) {
        chartPanel.innerHTML = renderChartPanel()
        lucide.createIcons()
      }
    })
  })
}

function setupEvents(container) {
  // IED buttons
  container.querySelectorAll('[data-ied]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.iedSelecionado = parseInt(btn.dataset.ied ?? '1')
      container.querySelectorAll('[data-ied]').forEach(b => {
        const isActive = parseInt(b.dataset.ied ?? '') === state.iedSelecionado
        b.className = `dataDashboardPage__iedButton w-full py-3 px-4 rounded-lg text-[0.9375rem] font-semibold transition-all duration-300 cursor-pointer ${isActive ? 'bg-white text-teal shadow-[0_2px_8px_rgba(0,0,0,0.2)]' : 'bg-transparent text-white hover:bg-white/15'}`
      })
    })
  })

  // Dropdown
  const trigger = container.querySelector('#indice-select-trigger')
  const dropdown = container.querySelector('#indice-select-dropdown')
  const chevron = container.querySelector('#indice-select-chevron')

  trigger?.addEventListener('click', () => {
    state.dropdownOpen = !state.dropdownOpen
    dropdown?.classList.toggle('hidden', !state.dropdownOpen)
    chevron?.classList.toggle('rotate-180', state.dropdownOpen)
  })

  dropdown?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-indice]')
    if (!btn) return
    state.indiceSelecionado = parseInt(btn.dataset.indice ?? '0')
    state.dropdownOpen = false

    const valueEl = container.querySelector('#indice-select-value')
    if (valueEl) valueEl.textContent = `Índice ${state.indiceSelecionado + 1} — ${state.indices[state.indiceSelecionado]}`

    dropdown.classList.add('hidden')
    chevron?.classList.remove('rotate-180')
    dropdown.innerHTML = renderDropdownOptions()
    lucide.createIcons()
  })

  document.addEventListener('mousedown', (e) => {
    const selectEl = container.querySelector('#indice-select')
    if (selectEl && !selectEl.contains(e.target)) {
      state.dropdownOpen = false
      dropdown?.classList.add('hidden')
      chevron?.classList.remove('rotate-180')
    }
  })

  // Search
  container.querySelector('#municipios-busca')?.addEventListener('input', (e) => {
    state.busca = e.target.value
    const listEl = container.querySelector('#municipios-list')
    if (listEl) {
      listEl.innerHTML = renderMunicipiosList()
      setupMunicipioEvents(container)
    }
  })

  setupMunicipioEvents(container)
}

// ---- Entry point ----
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('main')

  // Equivalente ao import pageHTML — captura o HTML renderizado pelo Jinja
  const pageHTML = container.innerHTML

  state = {
    municipios: [],
    indices: [],
    iedSelecionado: 1,
    indiceSelecionado: 0,
    dropdownOpen: false,
    busca: '',
    municipioSelecionado: null,
  }

  container.innerHTML = `
    <div class="dataDashboardPage__loading w-full flex flex-col items-center justify-center gap-4 py-32 text-neutral-400">
      <i data-lucide="loader-2" class="dataDashboardPage__loadingIcon text-teal animate-spin" width="40" height="40"></i>
      <p class="dataDashboardPage__loadingText text-sm">Carregando dados...</p>
    </div>
  `
  lucide.createIcons()

  fetch('/api/dashboard')
    .then(r => r.json())
    .then(data => {
      state.municipios = data.municipios ?? []
      state.indices = data.indices ?? []

      container.innerHTML = pageHTML
      lucide.createIcons()

      if (state.municipios.length === 0 && state.indices.length === 0) {
        const filterWrapper = container.querySelector('section.filters')?.closest('.dataDashboardPage__background')
        const mapWrapper = container.querySelector('section.map')?.closest('.dataDashboardPage__background')
        const comparativoWrapper = container.querySelector('section.comparativo')?.closest('.dataDashboardPage__background')
        const downloadWrapper = container.querySelector('section.download')?.closest('.dataDashboardPage__background')

        const emptyEl = document.createElement('div')
        emptyEl.className = 'dataDashboardPage__background w-full px-mobile-padding sm:px-desktop-padding py-16'
        emptyEl.innerHTML = `
          <div class="dataDashboardPage__empty mx-auto max-w-width-size flex flex-col items-center justify-center gap-4 text-neutral-400">
            <i data-lucide="database" class="dataDashboardPage__emptyIcon opacity-30" width="48" height="48"></i>
            <p class="dataDashboardPage__emptyText text-[0.9375rem] text-center">
              Nenhum dado disponível no momento.
            </p>
          </div>
        `

        filterWrapper?.replaceWith(emptyEl)
        mapWrapper?.remove()
        comparativoWrapper?.remove()
        downloadWrapper?.remove()
        lucide.createIcons()
        return
      }

      const valueEl = container.querySelector('#indice-select-value')
      if (valueEl && state.indices.length > 0) valueEl.textContent = `Índice 1 — ${state.indices[0]}`

      const dropdown = container.querySelector('#indice-select-dropdown')
      if (dropdown) dropdown.innerHTML = renderDropdownOptions()

      const listEl = container.querySelector('#municipios-list')
      if (listEl) listEl.innerHTML = renderMunicipiosList()

      const chartPanel = container.querySelector('#chart-panel')
      if (chartPanel) {
        chartPanel.innerHTML = renderChartPanel()
        lucide.createIcons()
      }

      setupEvents(container)
      initMap()
    })
    .catch(err => {
      container.innerHTML = `
        <div class="dataDashboardPage__error w-full flex flex-col items-center justify-center gap-4 py-32 text-neutral-400">
          <i data-lucide="alert-circle" class="dataDashboardPage__errorIcon text-red" width="40" height="40"></i>
          <p class="dataDashboardPage__errorText text-sm text-center max-w-xs">${err.message}</p>
        </div>
      `
      lucide.createIcons()
    })
})
