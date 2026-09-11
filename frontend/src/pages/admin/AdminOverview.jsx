import { Link } from "react-router-dom";

export default function AdminOverview() {
  return (
    <div className="space-y-4">
      <p className="text-[var(--ink-soft)]">
        Manage the charity campaigns, categories, and products you own.
      </p>
      <div className="grid sm:grid-cols-3 gap-4">
        <Link
          to="/admin/charities"
          className="border border-[var(--line)] p-4 hover:border-[var(--moss)] bg-[var(--paper-raised)]"
        >
          <p className="font-display text-lg">Charities</p>
          <p className="text-sm text-[var(--ink-soft)] mt-1">
            Create a campaign, edit fee splits, see its orders.
          </p>
        </Link>
        <Link
          to="/admin/categories"
          className="border border-[var(--line)] p-4 hover:border-[var(--moss)] bg-[var(--paper-raised)]"
        >
          <p className="font-display text-lg">Categories</p>
          <p className="text-sm text-[var(--ink-soft)] mt-1">
            Create and rename product categories.
          </p>
        </Link>
        <Link
          to="/admin/products/new"
          className="border border-[var(--line)] p-4 hover:border-[var(--moss)] bg-[var(--paper-raised)]"
        >
          <p className="font-display text-lg">New product</p>
          <p className="text-sm text-[var(--ink-soft)] mt-1">
            List a product under one of your charities.
          </p>
        </Link>
      </div>
    </div>
  );
}
