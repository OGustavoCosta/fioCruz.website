function IndicatorsDashboardPage() {
  return (
    <>
      <div className="indicatorsDashboardPage__background w-full px-(--mobile-padding) sm:px-(--desktop-padding) py-6">
        <header className="header header--indicatorsDashboardPage mx-auto max-w-(--width-size) flex flex-col gap-4">
          <h1 className="header__title header__title--indicatorsDashboardPage text-4xl font-semibold text-dark-cyan max-w-200">Painel de Indicadores</h1>
          <p className="header__subtitle text-neutral-400 text-[1.125rem] max-w-200">Acompanhe os principais indicadores de saúde pública com visualizações interativas, comparações históricas e análises por região e período.</p>
        </header>
      </div>
    </>
  )
}

export default IndicatorsDashboardPage;