document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('btn-alto-contraste')
  const html = document.documentElement

  const STORAGE_KEY = 'alto-contraste'

  const ativar = () => {
    html.classList.add('high-contrast')
    btn.classList.add('is-active')
    btn.setAttribute('aria-pressed', 'true')
    localStorage.setItem(STORAGE_KEY, '1')
  }

  const desativar = () => {
    html.classList.remove('high-contrast')
    btn.classList.remove('is-active')
    btn.setAttribute('aria-pressed', 'false')
    localStorage.removeItem(STORAGE_KEY)
  }

  // Restaura preferência salva
  if (localStorage.getItem(STORAGE_KEY)) {
    ativar()
  }

  btn.addEventListener('click', () => {
    if (html.classList.contains('high-contrast')) {
      desativar()
    } else {
      ativar()
    }
  })
})
