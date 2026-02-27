import { useState } from 'react'
import { Link } from 'react-router'

const logoGovBr = '/images/header/logo-govbr.png'
const logoFioCruz = '/images/header/logo-fiocruz.png'

function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      {/* Overlay */}
      <div
        className={`header__overlay fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 sm:hidden ${drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* Drawer */}
      <aside
        className={`header__drawer fixed top-0 left-0 h-full w-72 bg-dark-cyan text-white z-50 flex flex-col transition-transform duration-300 sm:hidden ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="header__drawerHeader flex items-center justify-between px-4 py-4 border-b border-white/20">
          <div className="header__logo header__logo--fiocruz">
            <img src={logoFioCruz} alt="FioCruz" className="header__logoImg h-8" />
          </div>
          <button
            className="header__drawerClose text-white p-1 cursor-pointer"
            onClick={() => setDrawerOpen(false)}
            aria-label="Fechar menu"
          >
            <svg className="header__drawerCloseIcon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <nav className="header__drawerNavigation flex-1 px-4 py-6">
          <ul className="header__drawerList flex flex-col gap-1">
            <li className="header__drawerItem"><Link to="/" className="header__drawerLink block py-3 text-white hover:underline border-b border-white/10">Painel de dados</Link></li>
            <li className="header__drawerItem"><Link to="/painel-de-indicadores" className="header__drawerLink block py-3 text-white hover:underline border-b border-white/10">Painel de indicadores</Link></li>
            <li className="header__drawerItem"><Link to="/biblioteca" className="header__drawerLink block py-3 text-white hover:underline border-b border-white/10">Biblioteca de documentos</Link></li>
            <li className="header__drawerItem"><Link to="/publicacoes" className="header__drawerLink block py-3 text-white hover:underline border-b border-white/10">Produções bibliográficas</Link></li>
            <li className="header__drawerItem"><Link to="/sobre" className="header__drawerLink block py-3 text-white hover:underline">Sobre</Link></li>
          </ul>
        </nav>

        <nav className="header__drawerExternalNavigation px-4 py-4 border-t border-white/20">
          <ul className="header__drawerExternalList flex flex-col gap-1">
            <li className="header__drawerExternalItem"><a href="https://www.gov.br/pt-br/orgaos-do-governo" className="header__drawerExternalLink block py-2 text-white/70 hover:text-white hover:underline text-sm" target="_blank">Órgãos do Governo</a></li>
            <li className="header__drawerExternalItem"><a href="https://www.gov.br/acessoainformacao/pt-br" className="header__drawerExternalLink block py-2 text-white/70 hover:text-white hover:underline text-sm" target="_blank">Acesso à Informação</a></li>
            <li className="header__drawerExternalItem"><a href="https://www4.planalto.gov.br/legislacao" className="header__drawerExternalLink block py-2 text-white/70 hover:text-white hover:underline text-sm" target="_blank">Legislação</a></li>
            <li className="header__drawerExternalItem"><a href="" className="header__drawerExternalLink block py-2 text-white/70 hover:text-white hover:underline text-sm" target="_blank">Acessibilidade</a></li>
          </ul>
        </nav>
      </aside>

      <header className="header w-full bg-dark-cyan text-white px-(--mobile-padding) sm:px-(--desktop-padding)">

        {/* Barra superior: logo gov.br + links (desktop) / hamburger (mobile) */}
        <div className="header__topBar mx-auto max-w-(--width-size) py-3 flex items-center justify-between">
          <div className="header__logo header__logo--govbr">
            <img src={logoGovBr} alt="" className="header__logoImg" />
          </div>

          <nav className="header__navigation hidden sm:block">
            <ul className="header__list flex gap-4">
              <li className="header__item"><a href="https://www.gov.br/pt-br/orgaos-do-governo" className="header__link text-white hover:underline text-[0.75rem]" target="_blank">Órgãos do Governo</a></li>
              <li className="header__item"><a href="https://www.gov.br/acessoainformacao/pt-br" className="header__link text-white hover:underline text-[0.75rem]" target="_blank">Acesso à Informação</a></li>
              <li className="header__item"><a href="https://www4.planalto.gov.br/legislacao" className="header__link text-white hover:underline text-[0.75rem]" target="_blank">Legislação</a></li>
              <li className="header__item"><a href="" className="header__link text-white hover:underline text-[0.75rem]" target="_blank">Acessibilidade</a></li>
            </ul>
          </nav>

          <button
            className="header__menuButton sm:hidden text-white p-1 cursor-pointer"
            onClick={() => setDrawerOpen(true)}
            aria-label="Abrir menu"
          >
            <svg className="header__menuIcon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>

        {/* Logo FioCruz */}
        <div className="header__logoWrapper mx-auto max-w-(--width-size) py-6 flex justify-start">
          <div className="header__logo header__logo--fiocruz">
            <img src={logoFioCruz} alt="" className="header__logoImg" />
          </div>
        </div>

        {/* Navegação principal (desktop) */}
        <nav className="header__navigation header__navigation--main hidden sm:block mx-auto max-w-(--width-size) w-full py-4">
          <ul className="header__list flex flex-wrap gap-6">
            <li className="header__item"><Link to="/" className="header__link text-white hover:underline shrink-0">Painel de dados</Link></li>
            <li className="header__item"><Link to="/painel-de-indicadores" className="header__link text-white hover:underline shrink-0">Painel de indicadores</Link></li>
            <li className="header__item"><Link to="/biblioteca" className="header__link text-white hover:underline shrink-0">Biblioteca de documentos</Link></li>
            <li className="header__item"><Link to="/publicacoes" className="header__link text-white hover:underline shrink-0">Produções bibliográficas</Link></li>
            <li className="header__item"><Link to="/sobre" className="header__link text-white hover:underline shrink-0">Sobre</Link></li>
          </ul>
        </nav>

      </header>
    </>
  )
}

export default Header
