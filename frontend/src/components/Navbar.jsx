import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `text-sm hover:text-[var(--moss)] transition-colors ${
          isActive ? "text-[var(--moss)] font-medium" : "text-[var(--ink-soft)]"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="border-b border-[var(--line)] bg-[var(--paper-raised)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link to="/" className="font-display text-xl font-semibold tracking-tight">
          Common Cause
        </Link>
        <nav className="flex items-center gap-6">
          <NavItem to="/charities">Charities</NavItem>
          <NavItem to="/products">Shop</NavItem>
          {user && <NavItem to="/orders">My Orders</NavItem>}
          {user && <NavItem to="/address">Address</NavItem>}
          {isAdmin && <NavItem to="/admin">Admin</NavItem>}
        </nav>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="hidden text-sm text-[var(--ink-soft)] sm:inline">
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm border border-[var(--ink)] px-3 py-1.5 hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-[var(--ink-soft)] hover:text-[var(--moss)]"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="text-sm border border-[var(--ink)] px-3 py-1.5 hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
