function PublicationsPage() {
  return (
    <>
      <div className="publicationsPage__background w-full px-(--mobile-padding) sm:px-(--desktop-padding) py-6">
        <header className="header header--publicationsPage mx-auto max-w-(--width-size) flex flex-col gap-4">
          <h1 className="header__title header__title--publicationsPage text-4xl font-semibold text-dark-cyan max-w-200">Produções Bibliográficas</h1>
          <p className="header__subtitle text-neutral-400 text-[1.125rem] max-w-200">Explore artigos científicos, teses, dissertações e demais produções acadêmicas desenvolvidas pelos pesquisadores da Fiocruz.</p>
        </header>
      </div>
    </>
  )
}

export default PublicationsPage;