import { createBrowserRouter } from "react-router"

/* Layout */
import MainLayout from "../layouts/mainLayout/mainLayout"

/* Páginas */
import DataDashboardPage from "../pages/dataDashboard/dataDashboardPage"
import IndicatorsDashboardPage from "../pages/indicatorsDashboard/indicatorsDashboardPage"
import LibraryPage from "../pages/library/libraryPage"
import PublicationsPage from "../pages/publications/publicationsPage"
import AboutPage from "../pages/about/aboutPage"

const router = createBrowserRouter([
    {
        element: <MainLayout />,
        children: [
            { path: "/", element: <DataDashboardPage /> },
            { path: "/painel-de-indicadores", element: <IndicatorsDashboardPage /> },
            { path: "/sobre", element: <AboutPage /> },
            { path: "/biblioteca", element: <LibraryPage /> },
            { path: "/publicacoes", element: <PublicationsPage /> },
        ]
    },
])

export default router
