function DataDashboardPage() {
  return (
    <>
      <div className="dataDashboardPage__background w-full px-(--mobile-padding) sm:px-(--desktop-padding) py-6">
        <header className="header header--dataDashboardPage mx-auto max-w-(--width-size) flex flex-col gap-4">
          <h1 className="header__title header__title--dataDashboardPage text-4xl font-semibold text-dark-cyan max-w-200">Observatório de Indicadores em Saúde</h1>
          <p className="header__subtitle text-neutral-400 text-[1.125rem] max-w-200">Explore dados atualizados sobre indicadores de saúde pública no Brasil. Filtre por região, estado ou município e visualize tendências em tempo real.</p>
        </header>
      </div>
    </>
  );
}

export default DataDashboardPage;