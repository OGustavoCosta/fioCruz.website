import { useState, useRef, useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import { Info, ArrowRight, SlidersHorizontal, Map, RefreshCw, Search, BarChart2, Download, ChevronDown, Check, Loader2, AlertCircle } from 'lucide-react'
import { getDashboardData, type Municipio } from '../../services/dashboardService'

function getCorHexIndice(indice: number): string {
  if (indice >= 0.85) return '#168821'
  if (indice >= 0.75) return '#4CAF50'
  if (indice >= 0.70) return '#FDB813'
  if (indice >= 0.65) return '#FF8C42'
  return '#E52207'
}

function IndiceSelect({ options, value, onChange }: {
  options: string[]
  value: number
  onChange: (v: number) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="dataDashboardPage__select relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="dataDashboardPage__selectTrigger w-full flex items-center justify-between gap-3 px-4 py-3 border-2 border-white/20 rounded-lg bg-white/95 text-[0.9375rem] text-neutral-500 hover:bg-white hover:border-white/40 transition-all cursor-pointer"
      >
        <span className="dataDashboardPage__selectValue truncate">Índice {value + 1} — {options[value]}</span>
        <ChevronDown
          className={`dataDashboardPage__selectChevron shrink-0 text-neutral-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          size={18}
        />
      </button>

      {open && (
        <ul className="dataDashboardPage__selectDropdown absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-neutral-150 z-50 overflow-hidden max-h-64 overflow-y-auto">
          {options.map((option, i) => (
            <li key={i} className="dataDashboardPage__selectOption">
              <button
                type="button"
                onClick={() => { onChange(i); setOpen(false) }}
                className={`dataDashboardPage__selectOptionBtn w-full flex items-center justify-between gap-3 px-4 py-3 text-sm text-left transition-colors cursor-pointer ${value === i ? 'bg-teal-light text-teal font-semibold' : 'text-neutral-500 hover:bg-neutral-50'}`}
              >
                <span className="dataDashboardPage__selectOptionLabel">
                  <span className="dataDashboardPage__selectOptionIndex text-xs font-bold text-neutral-300 mr-2">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {option}
                </span>
                {value === i && <Check className="dataDashboardPage__selectOptionCheck shrink-0 text-teal" size={15} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function DataDashboardPage() {
  const [municipios, setMunicipios] = useState<Municipio[]>([])
  const [indices, setIndices] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [iedSelecionado, setIedSelecionado] = useState(1)
  const [indiceSelecionado, setIndiceSelecionado] = useState(0)
  const [busca, setBusca] = useState('')
  const [municipioSelecionado, setMunicipioSelecionado] = useState<string | null>(null)

  useEffect(() => {
    getDashboardData()
      .then(data => {
        setMunicipios(data.municipios)
        setIndices(data.indices)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const municipiosFiltrados = municipios.filter((m: Municipio) =>
    m.nome.toLowerCase().includes(busca.toLowerCase()) ||
    m.uf.toLowerCase().includes(busca.toLowerCase())
  )

  const municipioAtual = municipios.find((m: Municipio) => m.nome === municipioSelecionado) ?? null

  if (loading) return (
    <div className="dataDashboardPage__loading w-full flex flex-col items-center justify-center gap-4 py-32 text-neutral-400">
      <Loader2 className="dataDashboardPage__loadingIcon animate-spin text-teal" size={40} />
      <p className="dataDashboardPage__loadingText text-sm">Carregando dados...</p>
    </div>
  )

  if (error) return (
    <div className="dataDashboardPage__error w-full flex flex-col items-center justify-center gap-4 py-32 text-neutral-400">
      <AlertCircle className="dataDashboardPage__errorIcon text-red" size={40} />
      <p className="dataDashboardPage__errorText text-sm text-center max-w-xs">{error}</p>
    </div>
  )

  return (
    <>
      {/* Título da página */}
      <div className="dataDashboardPage__background w-full px-(--mobile-padding) sm:px-(--desktop-padding) py-8 bg-neutral-50">
        <header className="header header--dataDashboardPage mx-auto max-w-(--width-size) flex flex-col gap-3">
          <h1 className="header__title header__title--dataDashboardPage text-4xl font-semibold text-dark-cyan max-w-200">Observatório da Saúde para a Agenda 2030</h1>
          <p className="header__subtitle text-neutral-400 text-[1.125rem] max-w-200">Explore dados atualizados sobre indicadores de desenvolvimento sustentável em saúde no Brasil. Utilize os filtros para visualizar distribuição geográfica e realizar comparações municipais detalhadas.</p>
        </header>
      </div>

      {/* Informativo: Sobre os Índices e IEDs */}
      <div className="dataDashboardPage__background w-full px-(--mobile-padding) sm:px-(--desktop-padding) pb-6 bg-neutral-50">
        <section className="info">
          <div className="dataDashboardPage__infoContent mx-auto max-w-(--width-size)">
            <div className="dataDashboardPage__infoBox bg-gradient-to-br from-teal-light to-white border-l-4 border-teal rounded-xl p-5">
              <h2 className="dataDashboardPage__infoTitle text-xl font-semibold text-teal-dark mb-3 flex items-center gap-2">
                <Info className="dataDashboardPage__infoIcon shrink-0" size={20} />
                Sobre os Índices e IEDs
              </h2>
              <p className="dataDashboardPage__infoText text-neutral-500 text-[0.9375rem] leading-[1.7] mb-3">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. At deleniti neque vel eligendi perferendis provident adipisci possimus architecto, cupiditate officiis rerum dolore reprehenderit consequatur cum autem reiciendis natus corrupti rem.
              </p>
              <p className="dataDashboardPage__infoText text-neutral-500 text-[0.9375rem] leading-[1.7] mb-3">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit pariatur reiciendis dolor? Unde est inventore debitis ab accusantium. Quod vitae quae accusamus impedit saepe deserunt modi sit aperiam asperiores nihil.
              </p>
              <a href="#" className="dataDashboardPage__infoLink inline-flex items-center gap-2 text-teal font-semibold text-[0.9375rem] hover:text-teal-dark hover:gap-3 transition-all">
                Saiba mais sobre a metodologia
                <ArrowRight className="dataDashboardPage__infoLinkIcon shrink-0" size={16} />
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* Filtros */}
      <div className="dataDashboardPage__background w-full px-(--mobile-padding) sm:px-(--desktop-padding) pb-6 bg-neutral-50">
        <section className="filters">
          <div className="dataDashboardPage__filtersContent mx-auto max-w-(--width-size) bg-gradient-to-br from-teal to-teal-dark rounded-2xl p-6 shadow-[0_4px_16px_rgba(0,121,107,0.15)]">
            <h2 className="dataDashboardPage__filtersTitle text-xl font-semibold text-white mb-5 flex items-center gap-2">
              <SlidersHorizontal className="dataDashboardPage__filtersTitleIcon shrink-0" size={20} />
              Filtros de Visualização
            </h2>
            <div className="dataDashboardPage__filtersGroup flex flex-col gap-5">

              {/* IED Toggle */}
              <div className="dataDashboardPage__iedSection bg-white/10 rounded-xl p-4">
                <span className="dataDashboardPage__iedLabel block text-sm font-semibold text-white/95 mb-3">
                  Lorem Ipsum Dolor (IED)
                </span>
                <div className="dataDashboardPage__iedButtons grid grid-cols-2 sm:grid-cols-4 gap-2 bg-black/20 p-1 rounded-xl">
                  {[1, 2, 3, 4].map(ied => (
                    <button
                      key={ied}
                      className={`dataDashboardPage__iedButton w-full py-3 px-4 rounded-lg text-[0.9375rem] font-semibold transition-all duration-300 cursor-pointer ${iedSelecionado === ied ? 'bg-white text-teal shadow-[0_2px_8px_rgba(0,0,0,0.2)]' : 'bg-transparent text-white hover:bg-white/15'}`}
                      onClick={() => setIedSelecionado(ied)}
                    >
                      IED {ied}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dropdown de índice */}
              <div className="dataDashboardPage__selectGroup flex flex-col gap-2">
                <span className="dataDashboardPage__selectLabel text-sm font-semibold text-white/95">
                  Índice Observado
                </span>
                <IndiceSelect
                  options={indices}
                  value={indiceSelecionado}
                  onChange={setIndiceSelecionado}
                />
              </div>

              {/* Aplicar */}
              <button className="dataDashboardPage__filtersApply self-start inline-flex items-center gap-2 px-6 py-3 bg-white text-teal rounded-lg text-base font-semibold hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all cursor-pointer">
                <RefreshCw className="dataDashboardPage__filtersApplyIcon shrink-0" size={16} />
                Aplicar Filtros
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Mapa Geográfico */}
      <div className="dataDashboardPage__background w-full px-(--mobile-padding) sm:px-(--desktop-padding) pb-6 bg-neutral-50">
        <section className="map">
          <div className="dataDashboardPage__mapContent mx-auto max-w-(--width-size) bg-white rounded-xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
            <div className="dataDashboardPage__mapHeader flex justify-between items-center mb-4 pb-3 border-b-2 border-teal-light">
              <h2 className="dataDashboardPage__mapTitle text-xl font-semibold text-neutral-500">Distribuição Geográfica</h2>
              <Map className="dataDashboardPage__mapIcon text-teal shrink-0" size={20} />
            </div>
            <div className="dataDashboardPage__mapContainer w-full h-[600px] rounded-lg overflow-hidden border border-neutral-200">
              <MapContainer
                center={[-14.235, -51.925]}
                zoom={4}
                className="dataDashboardPage__mapLeaflet w-full h-full"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                {municipios.map(m => (
                  <CircleMarker
                    key={m.nome}
                    center={[m.lat, m.lng]}
                    radius={8}
                    pathOptions={{
                      fillColor: getCorHexIndice(m.indice),
                      fillOpacity: 0.85,
                      color: '#fff',
                      weight: 2,
                    }}
                  >
                    <Popup className="dataDashboardPage__mapPopup">
                      <strong>{m.nome} — {m.uf}</strong><br />
                      Índice: <strong>{m.indice.toFixed(2)}</strong><br />
                      Pop.: {m.populacao}<br />
                      Região: {m.regiao}
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            </div>
          </div>
        </section>
      </div>

      {/* Comparativo Municipal */}
      <div className="dataDashboardPage__background w-full px-(--mobile-padding) sm:px-(--desktop-padding) pb-6 bg-neutral-50">
        <section className="comparativo">
          <div className="dataDashboardPage__comparativoContent mx-auto max-w-(--width-size) bg-white rounded-xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
            <div className="dataDashboardPage__comparativoHeader mb-6 pb-4 border-b-2 border-teal-light">
              <h2 className="dataDashboardPage__comparativoTitle text-xl font-semibold text-neutral-500 mb-2">Comparativo Municipal</h2>
              <p className="dataDashboardPage__comparativoSubtitle text-sm text-neutral-400">Selecione um município na lista para visualizar o comparativo de índices</p>
            </div>

            <div className="dataDashboardPage__comparativoGrid grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">

              {/* Lista de municípios */}
              <div className="dataDashboardPage__municipiosPanel flex flex-col gap-4">
                <div className="dataDashboardPage__municipiosBusca relative">
                  <input
                    type="text"
                    className="dataDashboardPage__municipiosBuscaInput w-full px-4 py-3 pl-10 border-2 border-neutral-200 rounded-lg text-sm text-neutral-500 focus:outline-none focus:border-teal focus:shadow-[0_0_0_3px_var(--color-teal-light)] transition-all"
                    placeholder="Pesquisar município..."
                    value={busca}
                    onChange={e => setBusca(e.target.value)}
                  />
                  <Search className="dataDashboardPage__municipiosBuscaIcon absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 shrink-0" size={16} />
                </div>
                <ul className="dataDashboardPage__municipiosList flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-neutral-50 [&::-webkit-scrollbar-track]:rounded [&::-webkit-scrollbar-thumb]:bg-teal [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb:hover]:bg-teal-dark">
                  {municipiosFiltrados.map(m => (
                    <li key={m.nome} className="dataDashboardPage__municipiosItem">
                      <button
                        className={`dataDashboardPage__municipiosCard w-full text-left p-4 rounded-xl border-l-4 border-teal bg-gradient-to-br from-white to-teal-light transition-all duration-300 cursor-pointer hover:translate-x-1 hover:shadow-[0_4px_12px_rgba(0,121,107,0.15)] hover:border-l-[6px] ${municipioSelecionado === m.nome ? 'translate-x-1 shadow-[0_4px_12px_rgba(0,121,107,0.15)] border-l-[6px]!' : ''}`}
                        onClick={() => setMunicipioSelecionado(m.nome)}
                      >
                        <div className="dataDashboardPage__municipiosNomeRow mb-2">
                          <span className="dataDashboardPage__municipiosNome text-base font-bold text-neutral-500">{m.nome}</span>
                          <span className="dataDashboardPage__municipiosUf inline-block bg-teal text-white text-[11px] font-bold px-2 py-0.5 rounded ml-2">{m.uf}</span>
                        </div>
                        <div className="dataDashboardPage__municipiosIndiceRow flex items-baseline gap-2">
                          <span className="dataDashboardPage__municipiosIndice text-[1.75rem] font-bold text-teal">{m.indice.toFixed(2)}</span>
                          <span className="dataDashboardPage__municipiosIndiceLabel text-xs text-neutral-400 font-medium">IMDSS</span>
                        </div>
                        <div className="dataDashboardPage__municipiosDados grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-teal-light">
                          <div className="dataDashboardPage__municipiosDado text-xs">
                            <span className="dataDashboardPage__municipiosDadoLabel block text-neutral-400 font-medium">População</span>
                            <span className="dataDashboardPage__municipiosDadoValor block text-neutral-500 font-semibold mt-0.5">{m.populacao}</span>
                          </div>
                          <div className="dataDashboardPage__municipiosDado text-xs">
                            <span className="dataDashboardPage__municipiosDadoLabel block text-neutral-400 font-medium">Área</span>
                            <span className="dataDashboardPage__municipiosDadoValor block text-neutral-500 font-semibold mt-0.5">{m.area}</span>
                          </div>
                          <div className="dataDashboardPage__municipiosDado text-xs">
                            <span className="dataDashboardPage__municipiosDadoLabel block text-neutral-400 font-medium">Região</span>
                            <span className="dataDashboardPage__municipiosDadoValor block text-neutral-500 font-semibold mt-0.5">{m.regiao}</span>
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Gráfico comparativo */}
              <div className="dataDashboardPage__chartPanel bg-neutral-50 rounded-xl p-5 min-h-125 flex flex-col">
                {municipioAtual ? (
                  <div className="dataDashboardPage__chartWrapper flex flex-col gap-3 flex-1">
                    <h3 className="dataDashboardPage__chartTitle text-sm font-semibold text-neutral-500">
                      {municipioAtual.nome} — {municipioAtual.uf}
                    </h3>
                    <div className="dataDashboardPage__chartContainer flex-1 min-h-[400px] bg-white border border-neutral-175 rounded-lg flex items-center justify-center">
                      <p className="dataDashboardPage__chartPlaceholder text-neutral-400 text-sm">Gráfico comparativo de índices</p>
                    </div>
                  </div>
                ) : (
                  <div className="dataDashboardPage__chartEmpty flex-1 flex flex-col items-center justify-center gap-4 text-neutral-400">
                    <BarChart2 className="dataDashboardPage__chartEmptyIcon opacity-30" size={48} />
                    <p className="dataDashboardPage__chartEmptyText text-[0.9375rem] text-center">
                      Selecione um município na lista ao lado<br />para visualizar o comparativo de índices
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Exportar Dados */}
      <div className="dataDashboardPage__background w-full px-(--mobile-padding) sm:px-(--desktop-padding) pb-8 bg-neutral-50">
        <section className="download">
          <div className="dataDashboardPage__downloadContent mx-auto max-w-(--width-size) bg-white rounded-xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] flex flex-col sm:flex-row items-start sm:items-center justify-between flex-wrap gap-4">
            <div className="dataDashboardPage__downloadInfo flex-1 min-w-60">
              <h2 className="dataDashboardPage__downloadTitle text-[1.125rem] font-semibold text-neutral-500 mb-2">Exportar Dados</h2>
              <p className="dataDashboardPage__downloadSubtitle text-sm text-neutral-400">Faça o download dos dados filtrados em diferentes formatos para análise offline.</p>
            </div>
            <div className="dataDashboardPage__downloadButtons flex gap-3 flex-wrap">
              <button className="dataDashboardPage__downloadBtn dataDashboardPage__downloadBtn--csv inline-flex items-center gap-2 px-5 py-3 bg-teal text-white border-2 border-teal rounded-lg text-[0.9375rem] font-semibold hover:bg-teal-dark hover:border-teal-dark hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,121,107,0.3)] transition-all cursor-pointer">
                <Download className="dataDashboardPage__downloadBtnIcon shrink-0" size={16} />
                Baixar CSV
              </button>
              <button className="dataDashboardPage__downloadBtn dataDashboardPage__downloadBtn--excel inline-flex items-center gap-2 px-5 py-3 bg-white text-teal border-2 border-teal rounded-lg text-[0.9375rem] font-semibold hover:bg-teal-light transition-all cursor-pointer">
                <Download className="dataDashboardPage__downloadBtnIcon shrink-0" size={16} />
                Baixar Excel
              </button>
              <button className="dataDashboardPage__downloadBtn dataDashboardPage__downloadBtn--json inline-flex items-center gap-2 px-5 py-3 bg-white text-teal border-2 border-teal rounded-lg text-[0.9375rem] font-semibold hover:bg-teal-light transition-all cursor-pointer">
                <Download className="dataDashboardPage__downloadBtnIcon shrink-0" size={16} />
                Baixar JSON
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default DataDashboardPage
