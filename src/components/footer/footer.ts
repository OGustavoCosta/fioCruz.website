import footerHTML from './footer.html?raw'

export function renderFooter(container: HTMLElement): void {
  container.innerHTML = footerHTML
}