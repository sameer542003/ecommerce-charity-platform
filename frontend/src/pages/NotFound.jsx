import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="font-display text-4xl mb-2">Page not found</h1>
      <p className="text-[var(--ink-soft)] mb-6">
        That page doesn't exist, or you may have followed a broken link.
      </p>
      <Link to="/" className="text-[var(--moss)] font-medium">
        Back to home
      </Link>
    </div>
  );
}
