import './assets/style/main.css'
import { renderLayout } from './layouts/theme'
import { initRouter } from './router/router'

const app = document.getElementById('app')!

renderLayout(app)
initRouter()
