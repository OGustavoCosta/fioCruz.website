document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('header__overlay')
  const drawer = document.getElementById('header__drawer')
  const menuButton = document.getElementById('header__menuButton')
  const closeButton = document.getElementById('header__drawerClose')

  const openDrawer = () => {
    drawer.classList.remove('-translate-x-full')
    drawer.classList.add('translate-x-0')
    overlay.classList.remove('opacity-0', 'pointer-events-none')
    overlay.classList.add('opacity-100', 'pointer-events-auto')
  }

  const closeDrawer = () => {
    drawer.classList.remove('translate-x-0')
    drawer.classList.add('-translate-x-full')
    overlay.classList.remove('opacity-100', 'pointer-events-auto')
    overlay.classList.add('opacity-0', 'pointer-events-none')
  }

  menuButton.addEventListener('click', openDrawer)
  closeButton.addEventListener('click', closeDrawer)
  overlay.addEventListener('click', closeDrawer)
})
