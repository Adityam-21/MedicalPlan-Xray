import { Outlet } from 'react-router-dom'

import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'

function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout
