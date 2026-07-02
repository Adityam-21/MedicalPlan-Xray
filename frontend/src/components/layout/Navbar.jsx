import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import PageContainer from './PageContainer.jsx'
import Button from '../common/Button.jsx'
import { cn } from '../../utils/cn.js'

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/predict', label: 'Predict' },
  { to: '/about', label: 'About' },
]

const navLinkClass = ({ isActive }) =>
  cn(
    'text-sm font-medium transition-colors',
    isActive ? 'text-primary-700' : 'text-gray-600 hover:text-gray-900',
  )

const mobileNavLinkClass = ({ isActive }) =>
  cn(
    'block rounded-lg px-3 py-2.5 text-base font-medium transition-colors',
    isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50',
  )

/**
 * Sticky, responsive site navigation. Contains no page-specific content —
 * nav links and the CTA target are the only app-specific bits, everything
 * else (structure, mobile menu behavior) is fully reusable.
 */
function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur-md">
      <PageContainer size="xl">
        <nav className="flex h-16 items-center justify-between">
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="font-display text-lg font-semibold text-gray-900"
          >
            MedicalPlan<span className="text-primary-600">-Xray</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} className={navLinkClass}>
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden md:block">
            <Button as={Link} to="/predict" size="sm">
              Get a recommendation
            </Button>
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 md:hidden"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
              )}
            </svg>
          </button>
        </nav>
      </PageContainer>

      {/* Mobile nav panel */}
      {isMenuOpen && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <PageContainer size="xl" className="space-y-1 py-3">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setIsMenuOpen(false)}
                className={mobileNavLinkClass}
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/predict"
              onClick={() => setIsMenuOpen(false)}
              className="mt-2 block rounded-lg bg-primary-600 px-3 py-2.5 text-center text-base font-medium text-white hover:bg-primary-700"
            >
              Get a recommendation
            </Link>
          </PageContainer>
        </div>
      )}
    </header>
  )
}

export default Navbar