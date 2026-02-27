/* Root */
import { createRoot } from 'react-dom/client'

/* Rotas */
import { RouterProvider } from 'react-router'
import router from './routes/routes'

/* CSS */
import "./assets/style/main.css"

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router}/>
)
