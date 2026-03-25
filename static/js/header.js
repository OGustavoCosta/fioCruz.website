document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('header__overlay')
  const drawer = document.getElementById('header__drawer')
  const menuButton = document.getElementById('header__menuButton')
  const closeButton = document.getElementById('header__drawerClose')
  const stickyBar = document.getElementById('header__stickyBar')
  const stickyMenuButton = document.getElementById('header__stickyMenuButton')

  const openDrawer = () => {
    drawer.classList.remove('-translate-x-full')
    drawer.classList.add('translate-x-0')
    overlay.classList.remove('opacity-0', 'pointer-events-none')
    overlay.classList.add('opacity-100', 'pointer-events-auto')
    document.body.style.overflow = 'hidden'
  }

  const closeDrawer = () => {
    drawer.classList.remove('translate-x-0')
    drawer.classList.add('-translate-x-full')
    overlay.classList.remove('opacity-100', 'pointer-events-auto')
    overlay.classList.add('opacity-0', 'pointer-events-none')
    document.body.style.overflow = ''
  }

  menuButton.addEventListener('click', openDrawer)
  closeButton.addEventListener('click', closeDrawer)
  overlay.addEventListener('click', closeDrawer)
  stickyMenuButton.addEventListener('click', openDrawer)

  // Sticky bar: aparece só ao rolar para cima, quando o header está >200px da viewport
  const header = document.querySelector('header.header')
  if (header && stickyBar) {
    let headerFora = false
    let lastScrollY = window.scrollY

    const observer = new IntersectionObserver(([entry]) => {
      headerFora = !entry.isIntersecting
      if (!headerFora) stickyBar.classList.remove('is-visible')
    }, { rootMargin: '200px 0px 0px 0px' })

    observer.observe(header)

    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY
      const scrollingUp = currentScrollY < lastScrollY

      if (scrollingUp && headerFora) {
        stickyBar.classList.add('is-visible')
      } else {
        stickyBar.classList.remove('is-visible')
      }

      lastScrollY = currentScrollY
    }, { passive: true })
  }
})
