import { Outlet } from 'react-router'
import Header from '../../components/header/header'
import Footer from '../../components/footer/footer'

function MainLayout() {
  return (
    <div className="mainLayout grid grid-rows-[auto_1fr_auto] w-full min-h-dvh">
      <Header />
      <main className="mainLayout__main w-full bg-neutral-150">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout
