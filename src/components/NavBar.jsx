import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const authData = localStorage.getItem("btz_auth");
  const loggedIn = authData ? !!JSON.parse(authData).token : false;

  return (
    <header className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-slate-200 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-tight text-[#0d0950] hover:opacity-80 transition"
        >
          BookTimez
        </Link>

        {/* Hamburger Menu */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition"
        >
          <div className="relative w-6 h-6 flex flex-col justify-center gap-1">
            <span
              className={`block h-0.5 w-6 bg-slate-900 transition-all duration-300 ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-slate-900 transition-all duration-300 ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-slate-900 transition-all duration-300 ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </div>
        </button>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center text-sm font-medium space-x-1">
          <NavLink to="/">Home</NavLink>
          <NavLink to="#features">Features</NavLink>
          <NavLink to="#pricing">Pricing</NavLink>
          <NavLink to="/about">About</NavLink>

          <div className="ml-6 flex items-center gap-3">
            {loggedIn ? (
              <Link
                to="/dashboard/bookings"
                className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition font-medium shadow-sm"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition font-medium shadow-sm"
              >
                Get Started
              </Link>
            )}
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: menuOpen ? "auto" : 0 }}
        transition={{ duration: 0.3 }}
        className="md:hidden overflow-hidden bg-white border-t border-slate-200"
      >
        <nav className="flex flex-col px-6 py-4 space-y-3">
          <MobileNavLink to="/" setMenuOpen={setMenuOpen}>
            Home
          </MobileNavLink>
          <MobileNavLink to="/features" setMenuOpen={setMenuOpen}>
            Features
          </MobileNavLink>
          <MobileNavLink to="/pricing" setMenuOpen={setMenuOpen}>
            Pricing
          </MobileNavLink>
          <MobileNavLink to="/about" setMenuOpen={setMenuOpen}>
            About
          </MobileNavLink>

          <div className="pt-3 border-t border-slate-200 space-y-2">
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2.5 text-slate-700 hover:bg-slate-100 rounded-lg transition text-sm font-medium"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition text-sm font-medium"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </motion.div>
    </header>
  );
}

function NavLink({ to, children }) {
  return (
    <Link
      to={to}
      className="relative group px-3 py-2 text-slate-700 hover:text-[#0d0950] transition"
    >
      {children}
      <span className="absolute left-3 right-3 bottom-1 h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </Link>
  );
}

function MobileNavLink({ to, setMenuOpen, children }) {
  return (
    <Link
      to={to}
      onClick={() => setMenuOpen(false)}
      className="text-slate-700 hover:text-[#0d0950] transition text-sm font-medium py-1"
    >
      {children}
    </Link>
  );
}
