import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="mx-auto max-w-6xl px-6 py-16">Loading…</div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

export function RequireAdmin({ children }) {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="mx-auto max-w-6xl px-6 py-16">Loading…</div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!isAdmin)
    return (
      <div className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="font-display text-2xl">Admins only</h1>
        <p className="mt-2 text-[var(--ink-soft)]">
          Your account doesn't have access to this area.
        </p>
      </div>
    );
  return children;
}
