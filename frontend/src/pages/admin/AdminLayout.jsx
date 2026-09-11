import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Item({ to, children, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `block px-3 py-2 text-sm border-l-2 ${
          isActive
            ? "border-[var(--moss)] text-[var(--moss)] bg-[var(--paper-raised)]"
            : "border-transparent text-[var(--ink-soft)] hover:text-[var(--ink)]"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

export default function AdminLayout() {
  const { user, isSuperAdmin } = useAuth();

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="font-display text-3xl mb-1">Admin</h1>
      <p className="text-[var(--ink-soft)] mb-8">
        Signed in as {user?.name} ({user?.role})
      </p>
      <div className="grid md:grid-cols-[180px_1fr] gap-8">
        <nav className="border-l border-[var(--line)] -ml-px space-y-1">
          <Item to="/admin" end>
            Overview
          </Item>
          <Item to="/admin/charities">Charities</Item>
          <Item to="/admin/categories">Categories</Item>
          <Item to="/admin/products/new">New product</Item>
        </nav>
        <div>
          <Outlet />
        </div>
      </div>
      {isSuperAdmin && (
        <p className="mt-10 text-xs text-[var(--ink-soft)]">
          You're a super-admin: you see every charity and category, not just your own.
        </p>
      )}
    </div>
  );
}
