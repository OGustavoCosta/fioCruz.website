document.addEventListener('DOMContentLoaded', () => {
  const html = document.documentElement

  // ----------------------------------------
  // Alto Contraste
  // ----------------------------------------

  const btnContraste = document.getElementById('btn-alto-contraste')
  const CONTRAST_KEY = 'alto-contraste'
  const prefersContrast = window.matchMedia('(prefers-contrast: more)')

  // save=false → aplicado automaticamente (SO), não grava preferência explícita
  const ativarContraste = (save = true) => {
    html.classList.add('high-contrast')
    btnContraste.classList.add('is-active')
    btnContraste.setAttribute('aria-pressed', 'true')
    if (save) localStorage.setItem(CONTRAST_KEY, '1')
  }

  const desativarContraste = (save = true) => {
    html.classList.remove('high-contrast')
    btnContraste.classList.remove('is-active')
    btnContraste.setAttribute('aria-pressed', 'false')
    // '0' = usuário desativou explicitamente (diferente de null = nunca configurou)
    if (save) localStorage.setItem(CONTRAST_KEY, '0')
  }

  // Inicialização: preferência salva → respeita; sem preferência → usa SO
  const savedContrast = localStorage.getItem(CONTRAST_KEY)
  if (savedContrast === '1') {
    ativarContraste(false)
  } else if (savedContrast === null && prefersContrast.matches) {
    ativarContraste(false)
  }

  // Clique do botão → preferência explícita do usuário
  btnContraste.addEventListener('click', () => {
    html.classList.contains('high-contrast') ? desativarContraste() : ativarContraste()
  })

  // Mudança na preferência do SO → aplica só se não houver preferência explícita salva
  prefersContrast.addEventListener('change', (e) => {
    if (localStorage.getItem(CONTRAST_KEY) !== null) return
    e.matches ? ativarContraste(false) : desativarContraste(false)
  })

  // ----------------------------------------
  // Ajuste de tamanho de fonte (A- / A / A+)
  // ----------------------------------------

  const FONT_KEY = 'tamanho-fonte'

  const fontSizes = {
    grande:  '112.5%',
    normal:  '100%',
    pequeno: '87.5%',
  }

  const fontBtns = {
    grande:  document.getElementById('btn-fonte-grande'),
    normal:  document.getElementById('btn-fonte-normal'),
    pequeno: document.getElementById('btn-fonte-pequeno'),
  }

  function applyFontSize(size) {
    html.style.fontSize = fontSizes[size]
    localStorage.setItem(FONT_KEY, size)

    Object.entries(fontBtns).forEach(([key, btn]) => {
      if (!btn) return
      const active = key === size
      btn.classList.toggle('is-active', active)
      btn.setAttribute('aria-pressed', String(active))
    })
  }

  // Restaura preferência salva
  applyFontSize(localStorage.getItem(FONT_KEY) || 'normal')

  Object.entries(fontBtns).forEach(([size, btn]) => {
    btn?.addEventListener('click', () => applyFontSize(size))
  })

  // ----------------------------------------
  // Esconder botões de acessibilidade ao chegar no footer
  // ----------------------------------------

  const footer = document.querySelector('footer')
  const a11yWidgets = [
    document.querySelector('.fontSize__group'),
    document.getElementById('btn-alto-contraste'),
  ]

  if (footer && a11yWidgets.some(Boolean)) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        a11yWidgets.forEach(el => el?.classList.toggle('a11y-hidden', entry.isIntersecting))
      },
      { threshold: 0 }
    )
    observer.observe(footer)
  }
})
