import { Link } from 'react-router'

const logoSUS = 'images/footer/logo-sus.png'
const logoShowcase = 'images/footer/logo-showcase.png'

function Footer(){
  return(
    <footer className="footer w-full bg-[#024A4D] text-white pt-8">
      <div className='footer__content px-(--mobile-padding) sm:px-(--desktop-padding) w-full'>
        <div className="footer__navigationWrapper max-w-(--width-size) m-auto w-full py-2 flex flex-col gap-2">
          <h2 className="footer__title font-semibold">Links Rápidos</h2>
          <nav className="footer__navigation footer__navigation--main">
            <ul className="footer__list flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm flex-wrap">
              <li className="footer__item"><Link to="/" className="footer__link text-neutral-100 hover:underline shrink">Painel de dados</Link></li>
              <li className="footer__item"><Link to="/painel-de-indicadores" className="footer__link text-neutral-100 hover:underline shrink">Painel de indicadores</Link></li>
              <li className="footer__item"><Link to="/biblioteca" className="footer__link text-neutral-100 hover:underline shrink">Biblioteca de documentos</Link></li>
              <li className="footer__item"><Link to="/publicacoes" className="footer__link text-neutral-100 hover:underline shrink">Produções bibliográficas</Link></li>
              <li className="footer__item"><Link to="/sobre" className="footer__link text-neutral-100 hover:underline shrink">Sobre</Link></li>
            </ul>
          </nav>
        </div>
        <div className="footer__logos max-w-(--width-size) m-auto w-full flex flex-col justify-start lg:flex-row lg:items-center sm:justify-between gap-4 py-8">
          <div className="footer__logo footer__logo--sus">
            <img src={logoSUS} alt="" className="footer__logoImg" />
          </div>
          <div className="footer__logo footer__logo--showcase">
            <img src={logoShowcase} alt="" className="footer__logoImg" />
          </div>
        </div>
      </div>
      <div className="footer__copyright w-full py-4 border-t border-neutral-100 px-(--mobile-padding) sm:px-(--desktop-padding) flex flex-col gap-2">
        <p className="footer__text text-neutral-100 text-[0.75rem] max-w-(--width-size) m-auto text-center">Este portal é regido pela <a href="https://fiocruz.br/sites/fiocruz.br/files/documentos/portaria_-_politica_de_acesso_aberto_ao_conhecimento_na_fiocruz.pdf" className="footer__link underline hover:bg-neutral-150">Política de Acesso Aberto ao Conhecimento</a>, que busca garantir à sociedade o acesso gratuito, público e aberto ao conteúdo integral de toda obra intelectual produzida pela Fiocruz.</p>
        <p className="footer__text text-neutral-100 text-[0.625rem] max-w-(--width-size) m-auto text-center">O conteúdo deste portal pode ser utilizado para todos os fins não comerciais, respeitados e reservados os direitos morais dos autores.</p>
      </div>
    </footer>
  )
}

export default Footer
