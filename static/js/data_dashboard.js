// -----------------------------
// Estado Global
// -----------------------------
let leafletMapInstance = null
let geojsonLayer = null

const ITENS_POR_PAGINA = 20

let state = {
  municipioSelecionado: null,
  comparacaoSelecionada: "IED",
  geojson: null,
  regiaoSelecionada: "Brasil",
  indiceSelecionado: 0,
  dropdownOpen: false,
  indiceComparacao: "Ind_mun",
  paginaMunicipios: 1,

  indices: [
    { value: "Ind_mun", label: "Índice Municipal de Desenvolvimento Sustentável em Saúde (IMDSS)" },
    { value: "Ind_rep_materna", label: "Saúde reprodutiva e materna" },
    { value: "Ind_rn_cr", label: "Saúde neonatal e da criança" },
    { value: "Ind_doen_infec", label: "Doenças infecciosas" },
    { value: "Ind_doen_nt", label: "Doenças crônicas não transmissíveis" },
    { value: "Ind_les_viol", label: "Lesões e violências" },
    { value: "Ind_risc_amb", label: "Riscos ambientais" },
    { value: "Ind_cob_saude", label: "Cobertura universal de saúde e sistemas de saúde" }
  ],


  paletas: {
  Ind_mun: ["#eef6fb", "#3a7fb6"],
  Ind_rep_materna: ["#eef9f3", "#4aa879"],
  Ind_rn_cr: ["#fbf6ed", "#c8a97e"],
  Ind_doen_infec: ["#f6f2fb", "#9a7fd1"],
  Ind_doen_nt: ["#edf6f8", "#4f8f9d"],
  Ind_les_viol: ["#f4f6f8", "#7b8a9a"],
  Ind_risc_amb: ["#f4f8ed", "#7ea85b"],
  Ind_cob_saude: ["#eef9f9", "#49a6a6"]

}
}

// -----------------------------
// Função para pegar cor da paleta
// -----------------------------
function getCorPaleta(valor) {

  const v = Math.max(0, Math.min(1, Number(valor ?? 0)))

  function interp(c1, c2, t) {
    return {
      r: Math.round(c1.r + (c2.r - c1.r) * t),
      g: Math.round(c1.g + (c2.g - c1.g) * t),
      b: Math.round(c1.b + (c2.b - c1.b) * t)
    }
  }

  let start, end, t

  // TIER 1 (0 – 0.40)
  if (v <= 0.40) {

    start = { r: 255, g: 205, b: 210 } // vermelho claro
    end   = { r: 183, g: 28,  b: 28 }  // vermelho forte

    t = v / 0.40
  }

  // TIER 2 (0.41 – 0.69)
  else if (v <= 0.69) {

    start = { r: 255, g: 249, b: 196 } // amarelo claro
    end   = { r: 251, g: 192, b: 45 }  // amarelo forte

    t = (v - 0.41) / (0.69 - 0.41)
  }

  // TIER 3 (0.70 – 1)
  else {

    start = { r: 200, g: 230, b: 201 } // verde claro
    end   = { r: 27,  g: 94,  b: 32 }  // verde forte

    t = (v - 0.70) / (1 - 0.70)
  }

  const c = interp(start, end, t)

  return `rgb(${c.r},${c.g},${c.b})`
}

function getCorTier(valor){

  const v = Math.max(0, Math.min(1, Number(valor ?? 0)))

  function interp(c1, c2, t){
    return {
      r: Math.round(c1.r + (c2.r - c1.r) * t),
      g: Math.round(c1.g + (c2.g - c1.g) * t),
      b: Math.round(c1.b + (c2.b - c1.b) * t)
    }
  }

  let start, end, t

  // 0 – 0.40
  if(v <= 0.40){
    start = {r:255,g:205,b:210}
    end   = {r:183,g:28,b:28}
    t = v / 0.40
  }

  // 0.41 – 0.69
  else if(v <= 0.69){
    start = {r:255,g:249,b:196}
    end   = {r:251,g:192,b:45}
    t = (v - 0.41) / (0.69 - 0.41)
  }

  // 0.70 – 1
  else{
    start = {r:200,g:230,b:201}
    end   = {r:27,g:94,b:32}
    t = (v - 0.70) / (1 - 0.70)
  }

  const c = interp(start,end,t)

  return `rgb(${c.r},${c.g},${c.b})`
}

function hexToRgb(hex) {

  const bigint = parseInt(hex.replace("#",""), 16)

  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  }
}

// -----------------------------
// Atualiza cores do mapa
// -----------------------------

function atualizarCoresMapa() {

  if (!geojsonLayer || !state.geojson) return

  const indiceKey = state.indices[state.indiceSelecionado].value
  const paleta = state.paletas[indiceKey]

  let somaBrasil = 0
  let countBrasil = 0

  let somaRegiao = 0
  let countRegiao = 0

  const somaIED = {}
  const countIED = {}

  let min = Infinity
  let max = -Infinity

  // -------- PRÉ-CÁLCULO (apenas uma vez) --------
  state.geojson.features.forEach(f => {

    const p = f.properties
    const valor = Number(p[indiceKey])

    if (isNaN(valor)) return

    somaBrasil += valor
    countBrasil++

    if (valor < min) min = valor
    if (valor > max) max = valor

    if (p.SIGLA_RG === state.regiaoSelecionada) {
      somaRegiao += valor
      countRegiao++
    }

    if (!somaIED[p.IED]) {
      somaIED[p.IED] = 0
      countIED[p.IED] = 0
    }

    somaIED[p.IED] += valor
    countIED[p.IED]++
  })

  const mediaBrasil = somaBrasil / countBrasil

  const mediaRegiao =
    countRegiao > 0
      ? somaRegiao / countRegiao
      : null

  // -------- LOOP DO MAPA --------
  geojsonLayer.eachLayer(layer => {

    const p = layer.feature.properties
    const valor = Number(p[indiceKey])

    const pertence =
      state.regiaoSelecionada === "Brasil" ||
      p.SIGLA_RG === state.regiaoSelecionada

    if (!pertence) {

      layer.setStyle({
        fillColor: "#eeeeee",
        color: "#cccccc",
        weight: 1,
        fillOpacity: 1
      })

      layer.unbindTooltip()
      return
    }

    layer.setStyle({
      fillColor: getCorPaleta(valor),
      color: "#cccccc",
      weight: 0.8,
      fillOpacity: 0.9
    })

    const mediaIED =
      somaIED[p.IED] / countIED[p.IED]

    // -------- TOOLTIP --------
    let conteudo = `
      <div style="font-size:13px; line-height:1.5">
        <strong>${p.NM_MUN} — ${p.UF}</strong><br>
        Região: ${p.NM_REGIA}<br>
        População (2022): ${Number(p.populacao_2022).toLocaleString('pt-BR')}<br>
        Área (km²): ${Number(p.AREA_KM2).toLocaleString('pt-BR', {minimumFractionDigits:2})}<br><br>
        <strong>${state.indices[state.indiceSelecionado].label}</strong><br>
        Município: ${valor.toFixed(3)}<br>
        Média Brasil: ${mediaBrasil.toFixed(3)}<br>
        Média comparáveis por IED*: ${mediaIED.toFixed(3)}
    `

    if (state.regiaoSelecionada !== "Brasil" && mediaRegiao !== null) {
      conteudo += `<br>Média Região: ${mediaRegiao.toFixed(3)}`
    }

    conteudo += `</div>`

    layer.bindTooltip(conteudo, {
      sticky: true,
      direction: "auto",
      opacity: 0.95,
      className: "map-tooltip"
    })
  })
}

// -----------------------------
// Zoom por região
// -----------------------------
function zoomParaRegiao() {

  if (!leafletMapInstance || !geojsonLayer) return

  if (state.regiaoSelecionada === "Brasil") {
    leafletMapInstance.flyTo([-14.235, -51.925], 4, { duration: 0.5 })
    return
  }

  let bounds = null

  geojsonLayer.eachLayer(layer => {
    if (layer.feature.properties.SIGLA_RG === state.regiaoSelecionada) {
      if (!bounds) bounds = layer.getBounds()
      else bounds.extend(layer.getBounds())
    }
  })

  if (!bounds) return

  leafletMapInstance.flyToBounds(bounds, {
    padding: [20, 20],
    maxZoom: 8,
    duration: 0.5
  })
}

// -----------------------------
// Filtra municípios
// -----------------------------
function getMunicipiosFiltrados() {

  if (!state.geojson) return []

  const buscaInput = document.getElementById("municipios-busca")

  const busca = buscaInput
    ? buscaInput.value.toLowerCase().trim()
    : ""

  return state.geojson.features.filter(f => {

    const nome = f.properties.NM_MUN.toLowerCase()

    if (busca && !nome.includes(busca)) return false

    return true

  })

}

function atualizarBotaoVerMais(total, limite) {
  const btn = document.getElementById('municipios-ver-mais')
  if (!btn) return
  if (limite >= total) {
    btn.classList.add('hidden')
  } else {
    btn.classList.remove('hidden')
  }
}

function renderMunicipiosList() {

  const filtrados = getMunicipiosFiltrados()

  if (filtrados.length === 0) {
    atualizarBotaoVerMais(0, 0)
    return '<li class="dataDashboardPage__municipiosEmpty text-sm text-neutral-400 py-4 text-center">Nenhum município encontrado.</li>'
  }

  const indiceKey = state.indiceComparacao || "Ind_mun"
  const limite = state.paginaMunicipios * ITENS_POR_PAGINA
  const visiveis = filtrados.slice(0, limite)

  atualizarBotaoVerMais(filtrados.length, limite)

  return visiveis.map(m => {

    const p = m.properties

    const nome = p.NM_MUN
    const uf = p.UF
    const regiao = p.NM_REGIA
    const populacao = Number(p.populacao_2022).toLocaleString('pt-BR')
    const area = Number(p.AREA_KM2).toLocaleString('pt-BR', {minimumFractionDigits:2})
    const indice = Number(p[indiceKey] ?? 0)

    return `
      <li class="dataDashboardPage__municipiosItem">
        <button
          data-municipio="${nome}"
          data-uf="${uf}"
          class="dataDashboardPage__municipiosCard w-full text-left p-4 rounded-xl border-l-4 border-teal bg-gradient-to-br from-white to-teal-light transition-all duration-300 cursor-pointer hover:translate-x-1 hover:shadow-[0_4px_12px_rgba(0,121,107,0.15)] hover:border-l-[6px] ${state.municipioSelecionado === nome ? 'translate-x-1 shadow-[0_4px_12px_rgba(0,121,107,0.15)] !border-l-[6px]' : ''}"
        >

          <div class="dataDashboardPage__municipiosNomeRow mb-2">
            <span class="dataDashboardPage__municipiosNome text-base font-bold text-neutral-500">${nome}</span>
            <span class="dataDashboardPage__municipiosUf inline-block bg-teal text-white text-[11px] font-bold px-2 py-0.5 rounded ml-2">${uf}</span>
          </div>

          <div class="dataDashboardPage__municipiosIndiceRow flex items-baseline gap-2">
            <span class="dataDashboardPage__municipiosIndice text-[1.75rem] font-bold text-teal">${indice.toFixed(2)}</span>
            <span class="dataDashboardPage__municipiosIndiceLabel text-xs text-neutral-400 font-medium">${state.indices[state.indiceSelecionado].label}</span>
          </div>

          <div class="dataDashboardPage__municipiosDados grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-teal-light">

            <div class="dataDashboardPage__municipiosDado text-xs">
              <span class="dataDashboardPage__municipiosDadoLabel block text-neutral-400 font-medium">População</span>
              <span class="dataDashboardPage__municipiosDadoValor block text-neutral-500 font-semibold mt-0.5">${populacao}</span>
            </div>

            <div class="dataDashboardPage__municipiosDado text-xs">
              <span class="dataDashboardPage__municipiosDadoLabel block text-neutral-400 font-medium">Área</span>
              <span class="dataDashboardPage__municipiosDadoValor block text-neutral-500 font-semibold mt-0.5">${area} km²</span>
            </div>

            <div class="dataDashboardPage__municipiosDado text-xs">
              <span class="dataDashboardPage__municipiosDadoLabel block text-neutral-400 font-medium">Região</span>
              <span class="dataDashboardPage__municipiosDadoValor block text-neutral-500 font-semibold mt-0.5">${regiao}</span>
            </div>

          </div>

        </button>
      </li>
    `
  }).join('')
}

// -----------------------------
// Inicializa mapa
// -----------------------------
function initMap() {

  const mapEl = document.getElementById("leaflet-map")
  if (!mapEl || !state.geojson) return

  leafletMapInstance = L.map(mapEl, {
    renderer: L.canvas(),
    minZoom: 4,
    maxZoom: 10,
    zoomControl: true,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    keyboard: false
  }).setView([-14.235, -51.925], 4)

  L.rectangle(
    [[-90, -180], [90, 180]],
    { color: "#ffffff", weight: 0, fillOpacity: 1 }
  ).addTo(leafletMapInstance)

  geojsonLayer = L.geoJSON(state.geojson, {
    renderer: L.canvas(),
    style: () => ({
      fillColor: "#cccccc",
      color: "#ffffff",
      weight: 0.8,
      fillOpacity: 0.8
    })
  }).addTo(leafletMapInstance)

  leafletMapInstance.fitBounds(geojsonLayer.getBounds())

  atualizarCoresMapa()

  const loadingEl = document.getElementById('map-loading')
  if (loadingEl) loadingEl.classList.add('hidden')
}

// -----------------------------
// Toggle Região
// -----------------------------
function ativarToggleRegiao() {

  const botoes = document.querySelectorAll("#modo-toggle button")

  botoes.forEach(btn => {
    btn.addEventListener("click", function () {

      botoes.forEach(b => {
        b.classList.remove("bg-white","text-teal","shadow-[0_2px_8px_rgba(0,0,0,0.2)]","pointer-events-none")
        b.classList.add("bg-transparent","text-white","hover:bg-white/15")
      })

      this.classList.remove("bg-transparent","text-white","hover:bg-white/15")
      this.classList.add("bg-white","text-teal","shadow-[0_2px_8px_rgba(0,0,0,0.2)]","pointer-events-none")

      state.regiaoSelecionada = this.dataset.regiao

      atualizarCoresMapa()
      zoomParaRegiao()
    })
  })
}

// -----------------------------
// Dropdown Índice
// -----------------------------
function renderDropdownOptions() {
  return state.indices.map((option, i) => `
    <button
      type="button"
      data-indice="${i}"
      class="dataDashboardPage__itemDropdown w-full text-left px-2 py-4 sm:px-4 sm:py-3 text-sm transition-colors ${
        state.indiceSelecionado === i
          ? "bg-teal-light text-teal font-semibold"
          : "text-neutral-500 hover:bg-neutral-50"
      }"
    >
      ${option.label}
    </button>
  `).join("")
}

function ativarDropdownIndice() {

  const trigger = document.getElementById("indice-select-trigger")
  const dropdown = document.getElementById("indice-select-dropdown")
  const valueEl = document.getElementById("indice-select-value")
  const chevron = document.getElementById("indice-select-chevron")

  dropdown.innerHTML = renderDropdownOptions()
  valueEl.textContent = state.indices[state.indiceSelecionado].label

  trigger.addEventListener("click", (e) => {
    e.stopPropagation()
    state.dropdownOpen = !state.dropdownOpen
    dropdown.classList.toggle("hidden", !state.dropdownOpen)
    chevron.classList.toggle("rotate-180", state.dropdownOpen)
  })

  dropdown.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-indice]")
    if (!btn) return

    state.indiceSelecionado = parseInt(btn.dataset.indice)
    valueEl.textContent = state.indices[state.indiceSelecionado].label

    state.dropdownOpen = false
    dropdown.classList.add("hidden")
    chevron.classList.remove("rotate-180")

    dropdown.innerHTML = renderDropdownOptions()

    atualizarCoresMapa()
  })

  document.addEventListener("click", (e) => {
    if (!e.target.closest("#indice-select")) {
      dropdown.classList.add("hidden")
      chevron.classList.remove("rotate-180")
      state.dropdownOpen = false
    }
  })
}

// -----------------------------
// Carregar Dados
// -----------------------------
function carregarDados() {

  fetch("/api/dashboard")
    .then(r => r.json())
    .then(data => {

      console.log("GeoJSON carregado:", data.features.length)

      state.geojson = data

      const municipioRJ = data.features.find(f =>
          f.properties.NM_MUN === "Rio de Janeiro" &&
          f.properties.UF === "RJ"
      )

      if (municipioRJ) {
          state.municipioSelecionado = municipioRJ
      }

      state.municipios = data.features.map(f => f.properties)

      setTimeout(() => initMap(), 0)

      const listEl = document.querySelector("#municipios-list")
      if (listEl) {
        listEl.innerHTML = renderMunicipiosList()
      }

      atualizarGraficoComparacao()

      const selectComparacao = document.getElementById("indice-select-comparacao")

      if (selectComparacao) {

        selectComparacao.addEventListener("change", function () {

          state.indiceComparacao = this.value

          const listEl = document.querySelector("#municipios-list")
          if (listEl) {
            listEl.innerHTML = renderMunicipiosList()
          }

        })

      }

    })
    .catch(err => console.error(err))
}


let comparacaoChart = null

function initComparacaoChart() {

  const ctx = document.getElementById("comparacao-chart")

  if (!ctx) return

  comparacaoChart = new Chart(ctx, {

    type: "bar",

    data: {
      labels: [
        "Município",
        "IED",
        "Região",
        "Estado",
        "País"
      ],

      datasets: []
    },

    options: {

      responsive: true,
      maintainAspectRatio: false,

      plugins: {

        legend: {
          display: false
        },

        title: {
          display: true,
          text: "",
          font: {
            size: 16,
            weight: "bold"
          },
          padding: {
            bottom: 10
          }
        },

        tooltip: {
          callbacks: {

            label: function(context) {

              const valor = context.raw.toFixed(3)

              const nomeMunicipio =
                state.municipioSelecionado?.properties?.NM_MUN || "Município"

              let nomeReferencia = "Referência"

              if(state.comparacaoSelecionada === "IED")
                nomeReferencia = "Média IED"

              if(state.comparacaoSelecionada === "REGIAO")
                nomeReferencia = "Média Região"

              if(state.comparacaoSelecionada === "ESTADO")
                nomeReferencia = "Média Estado"

              if(state.comparacaoSelecionada === "PAIS")
                nomeReferencia = "Média País"

              if(context.datasetIndex === 0){
                return `${nomeMunicipio}: ${valor}`
              } else {
                return `${nomeReferencia}: ${valor}`
              }

            }

          }
        }

      },

      scales: {

        y: {
          beginAtZero: true,
          max: 1,
          ticks: {
            stepSize: 0.2
          }
        },

        x: {
          grid: {
            display: false
          }
        }

      }

    }

  })

}

function ativarToggleComparacao(){

  const botoes = document.querySelectorAll("#modo-toggle-comparacao button")

  botoes.forEach(btn => {

    btn.addEventListener("click", function(){

      botoes.forEach(b=>{
        b.classList.remove("bg-white","text-teal","pointer-events-none")
        b.classList.add("bg-transparent","text-white","hover:bg-white/15")
      })

      this.classList.remove("bg-transparent","text-white","hover:bg-white/15")
      this.classList.add("bg-white","text-teal","pointer-events-none")

      state.comparacaoSelecionada = this.dataset.comparacao

      atualizarGraficoComparacao()

    })

  })

}

function ativarCliqueMunicipio() {

  document.addEventListener("click", function(e){

    const card = e.target.closest("[data-municipio]")
    if(!card) return

    const nome = card.dataset.municipio
    const uf = card.dataset.uf

    const municipio = state.geojson.features.find(f =>
      f.properties.NM_MUN === nome && f.properties.UF === uf
    )

    if(!municipio) return

    state.municipioSelecionado = municipio

    atualizarGraficoComparacao()

  })

}

function calcularMediaGrupo(campo, valor, indice){

  let soma = 0
  let count = 0

  state.geojson.features.forEach(f => {

    if(valor === "PAIS" || f.properties[campo] === valor){

      const v = Number(f.properties[indice])

      if(!isNaN(v)){
        soma += v
        count++
      }

    }

  })

  return count > 0 ? soma / count : 0

}

function atualizarGraficoComparacao(){

  if(!state.municipioSelecionado || !comparacaoChart) return

  const p = state.municipioSelecionado.properties

  comparacaoChart.options.plugins.title.text =
  `${p.NM_MUN} — ${p.UF}`

  const indices = state.indices.map(i => i.value)

  const valoresMunicipio = []
  const valoresGrupo = []

  indices.forEach(indice => {

    valoresMunicipio.push(Number(p[indice]))

    let media = 0

    if(state.comparacaoSelecionada === "IED")
      media = calcularMediaGrupo("IED", p.IED, indice)

    if(state.comparacaoSelecionada === "REGIAO")
      media = calcularMediaGrupo("SIGLA_RG", p.SIGLA_RG, indice)

    if(state.comparacaoSelecionada === "ESTADO")
      media = calcularMediaGrupo("UF", p.UF, indice)

    if(state.comparacaoSelecionada === "PAIS")
      media = calcularMediaGrupo("PAIS", "PAIS", indice)

    valoresGrupo.push(media)

  })

  comparacaoChart.data.labels = state.indices.map((_, i) => [
    `Índice ${i+1}`,
  ])

  comparacaoChart.data.datasets = [

    {
      label:"Município",
      data: valoresMunicipio,
      backgroundColor: "#5fa3b3", // azul claro
      borderRadius:6
    },

    {
      label:"Referência",
      data: valoresGrupo,
      backgroundColor: "#2f6f7a", // azul escuro
      borderRadius:6
    }

  ]

  comparacaoChart.update()

}

document.addEventListener("DOMContentLoaded", () => {

  lucide.createIcons()

  ativarToggleRegiao()
  ativarDropdownIndice()
  carregarDados()
  initComparacaoChart()
  ativarCliqueMunicipio()
  ativarToggleComparacao()

  const buscaInput = document.getElementById("municipios-busca")

  if (buscaInput) {
    buscaInput.addEventListener("input", () => {
      state.paginaMunicipios = 1
      const listEl = document.querySelector("#municipios-list")
      if (listEl) {
        listEl.innerHTML = renderMunicipiosList()
      }
    })
  }

  const verMaisBtn = document.getElementById('municipios-ver-mais')
  if (verMaisBtn) {
    verMaisBtn.addEventListener('click', () => {
      state.paginaMunicipios++
      const listEl = document.querySelector('#municipios-list')
      if (listEl) {
        listEl.innerHTML = renderMunicipiosList()
      }
    })
  }

})