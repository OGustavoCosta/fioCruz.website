import Navigo from 'navigo'
import { initDataDashboardPage } from '../pages/dataDashboard/dataDashboardPage'
import indicatorsDashboardHTML from '../pages/indicatorsDashboard/indicatorsDashboardPage.html?raw'
import libraryHTML from '../pages/library/libraryPage.html?raw'
import publicationsHTML from '../pages/publications/publicationsPage.html?raw'
import aboutHTML from '../pages/about/aboutPage.html?raw'

export const router = new Navigo('/')

export function initRouter(): void {
  const outlet = document.getElementById('outlet')!

  router
    .on('/', () => { initDataDashboardPage(outlet) })
    .on('/painel-de-indicadores', () => { outlet.innerHTML = indicatorsDashboardHTML })
    .on('/biblioteca', () => { outlet.innerHTML = libraryHTML })
    .on('/publicacoes', () => { outlet.innerHTML = publicationsHTML })
    .on('/sobre', () => { outlet.innerHTML = aboutHTML })
    .notFound(() => {
      outlet.innerHTML = `
        <section class="px-(--mobile-padding) sm:px-(--desktop-padding) py-16">
          <div class="max-w-(--width-size) mx-auto text-center">
            <h1 class="text-4xl font-semibold text-neutral-600 mb-4">404</h1>
            <p class="text-neutral-400 mb-6">Página não encontrada.</p>
            <a href="/" data-navigo class="text-dark-cyan underline hover:text-cyan">Voltar ao início</a>
          </div>
        </section>
      `
      router.updatePageLinks()
    })
    .resolve()

  router.updatePageLinks()
}