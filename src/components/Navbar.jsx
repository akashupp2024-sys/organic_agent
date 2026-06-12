import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { useCartContext } from '../context/CartContext';

const links = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuthContext();
  const { cartItems } = useCartContext();
  const cartCount = cartItems.reduce((total, item) => total + item.qty, 0);
  const closeMenu = () => setIsOpen(false);
  const handleLogout = () => {
    logout();
    closeMenu();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-green-900/40 bg-[#0b1f16]/95 shadow-lg backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8 text-white">
        <NavLink to="/" className="flex items-center gap-3 text-white">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-brand text-white shadow-sm">
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C12 2 16 6 12 12C8 18 4 20 4 20C4 20 2 14 6 10C8 8 12 2 12 2Z" fill="currentColor" />
              <path d="M12 2C12 2 8 6 12 12C16 18 20 20 20 20C20 20 22 14 18 10C16 8 12 2 12 2Z" fill="currentColor" opacity="0.75" />
            </svg>
          </span>
          <div>
            <p className="text-lg font-semibold">Organic Prakriti Store</p>
            <p className="text-xs uppercase tracking-[0.25em] text-green-300">Natural goods</p>
          </div>
        </NavLink>

        <div className="hidden items-center gap-6 md:flex">
          <nav className="flex items-center gap-4 text-sm font-medium text-slate-600">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  isActive
                    ? 'rounded-full bg-orange-500 px-4 py-2 text-white transition'
                    : 'rounded-full px-4 py-2 transition hover:bg-green-900/40 hover:text-green-300'
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <NavLink to="/cart" className="relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-green-950 text-white transition hover:bg-green-900">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6H4V4H6V6Z" fill="currentColor" />
              <path d="M20 7H9V5H20V7Z" fill="currentColor" />
              <path d="M7 9H21L20 18H8L7 9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" fill="currentColor" />
              <path d="M18 22C18.5523 22 19 21.5523 19 21C19 20.4477 18.5523 20 18 20C17.4477 20 17 20.4477 17 21C17 21.5523 17.4477 22 18 22Z" fill="currentColor" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1.5 text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </NavLink>

          {isAuthenticated ? (
            <>
              {user?.role === 'admin' && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    isActive
                      ? 'rounded-full bg-brand px-4 py-2 text-sm font-medium text-white transition'
                      : 'rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900'
                  }
                >
                  Admin
                </NavLink>
              )}
              <NavLink
                to="/my-orders"
                className={({ isActive }) =>
                  isActive
                    ? 'rounded-full bg-brand px-4 py-2 text-sm font-medium text-white transition'
                    : 'rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900'
                }
              >
                My Orders
              </NavLink>
              <button
                type="button"
                onClick={handleLogout}
                className= "rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 shadow-md"
              >
                Logout{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive
                  ? 'rounded-full bg-brand px-4 py-2 text-sm font-medium text-white transition'
                  : 'rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200'
              }
            >
              Login
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <button type="button" className="relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 7H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M6 12H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M6 17H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <button type="button" className="relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200" onClick={() => setIsOpen((open) => !open)} aria-label="Toggle menu">
            <span className="sr-only">Toggle menu</span>
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-slate-200 bg-white/95 px-4 pb-4 pt-2 shadow-sm md:hidden">
          <nav className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? 'rounded-2xl bg-brand px-4 py-3 text-white'
                    : 'rounded-2xl px-4 py-3 transition hover:bg-slate-100 hover:text-slate-900'
                }
              >
                {link.label}
              </NavLink>
            ))}
            <NavLink
              to="/cart"
              onClick={closeMenu}
              className="rounded-2xl px-4 py-3 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Cart ({cartCount})
            </NavLink>
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <NavLink
                    to="/admin"
                    onClick={closeMenu}
                    className="rounded-2xl px-4 py-3 transition hover:bg-slate-100 hover:text-slate-900"
                  >
                    Admin
                  </NavLink>
                )}
                <NavLink
                  to="/my-orders"
                  onClick={closeMenu}
                  className="rounded-2xl px-4 py-3 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  My Orders
                </NavLink>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-2xl px-4 py-3 text-left transition hover:bg-slate-100 hover:text-slate-900"
                >
                  Logout
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                onClick={closeMenu}
                className="rounded-2xl px-4 py-3 transition hover:bg-slate-100 hover:text-slate-900"
              >
                Login
              </NavLink>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;
