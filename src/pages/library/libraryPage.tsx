function LibraryPage() {
  return (
    <>
      <div className="libraryPage__background w-full px-(--mobile-padding) sm:px-(--desktop-padding) py-6">
        <header className="header header--libraryPage mx-auto max-w-(--width-size) flex flex-col gap-4">
          <h1 className="header__title header__title--libraryPage text-4xl font-semibold text-dark-cyan max-w-200">Biblioteca de Documentos</h1>
          <p className="header__subtitle text-neutral-400 text-[1.125rem] max-w-200">Acesse relatórios, publicações técnicas e documentos institucionais produzidos pela Fiocruz sobre saúde pública no Brasil.</p>
        </header>
      </div>
    </>
  )
}

export default LibraryPage;