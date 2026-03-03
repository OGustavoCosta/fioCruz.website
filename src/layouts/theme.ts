import { renderHeader } from '../components/header/header'
import { renderFooter } from '../components/footer/footer'
import themeHTML from './theme.html?raw'

export function renderLayout(container: HTMLElement): void {
  container.innerHTML = themeHTML

  renderHeader(document.getElementById('header-container')!)
  renderFooter(document.getElementById('footer-container')!)
}