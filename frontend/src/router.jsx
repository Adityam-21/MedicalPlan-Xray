import { createBrowserRouter } from 'react-router-dom'
import Layout from './components/layout/Layout.jsx'
import Home from './pages/Home.jsx'
import Predict from './pages/Predict.jsx'
import About from './pages/About.jsx'
import NotFound from './pages/NotFound.jsx'

// Single source of truth for all application routes. Pages are
// registered here only — no route paths should be hardcoded elsewhere
// except as string literals passed to <Link>/<NavLink>.
const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/predict', element: <Predict /> },
      { path: '/about', element: <About /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

export default router
