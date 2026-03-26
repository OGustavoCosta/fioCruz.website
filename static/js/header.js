document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('header__overlay')
  const drawer = document.getElementById('header__drawer')
  const menuButton = document.getElementById('header__menuButton')
  const closeButton = document.getElementById('header__drawerClose')
  const stickyBar = document.getElementById('header__stickyBar')
  const stickyMenuButton = document.getElementById('header__stickyMenuButton')

  let lastFocusedElement = null
  let closingFromHistory = false

  const isMobileOrTablet = () => !window.matchMedia('(min-width: 640px)').matches
  const isDrawerOpen = () => drawer.classList.contains('translate-x-0')

  const getFocusable = () => [
    ...drawer.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
  ]

  const setExpanded = (value) => {
    ;[menuButton, stickyMenuButton].forEach(btn => btn?.setAttribute('aria-expanded', String(value)))
  }

  const openDrawer = (trigger) => {
    lastFocusedElement = trigger ?? menuButton
    drawer.classList.remove('-translate-x-full')
    drawer.classList.add('translate-x-0')
    overlay.classList.remove('opacity-0', 'pointer-events-none')
    overlay.classList.add('opacity-100', 'pointer-events-auto')
    document.body.style.overflow = 'hidden'
    setExpanded(true)
    getFocusable()[0]?.focus()
    // Empurra estado na history para interceptar o botão voltar
    if (isMobileOrTablet()) {
      history.pushState({ drawerOpen: true }, '')
    }
  }

  // skipHistory = true quando chamado pelo popstate (evita loop)
  const closeDrawer = (skipHistory = false) => {
    drawer.classList.remove('translate-x-0')
    drawer.classList.add('-translate-x-full')
    overlay.classList.remove('opacity-100', 'pointer-events-auto')
    overlay.classList.add('opacity-0', 'pointer-events-none')
    document.body.style.overflow = ''
    setExpanded(false)
    lastFocusedElement?.focus()
    // Remove o estado que foi empurrado ao abrir
    if (!skipHistory && history.state?.drawerOpen) {
      closingFromHistory = true
      history.back()
    }
  }

  // Intercepta o botão voltar do navegador
  window.addEventListener('popstate', () => {
    if (closingFromHistory) {
      closingFromHistory = false
      return
    }
    if (isDrawerOpen()) {
      closeDrawer(true)
    }
  })

  // Trap de foco: Tab e Shift+Tab circulam dentro do drawer
  drawer.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer()
      return
    }
    if (e.key !== 'Tab') return

    const focusable = getFocusable()
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault()
        last.focus()
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  })

  menuButton.addEventListener('click', () => openDrawer(menuButton))
  closeButton.addEventListener('click', closeDrawer)
  overlay.addEventListener('click', closeDrawer)
  stickyMenuButton.addEventListener('click', () => openDrawer(stickyMenuButton))

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
