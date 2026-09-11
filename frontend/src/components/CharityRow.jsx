import { Link } from "react-router-dom";
import StatusPill from "./StatusPill";

export default function CharityRow({ charity }) {
  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(charity.end_date) - new Date()) / (1000 * 60 * 60 * 24))
  );

  return (
    <Link
      to={`/charities/${charity._id}`}
      className="flex items-center gap-4 border-b border-[var(--line)] py-4 hover:bg-[var(--paper-raised)] transition-colors px-2 -mx-2"
    >
      <img
        src={charity.banner}
        alt={charity.name}
        className="h-16 w-24 object-cover border border-[var(--line)] bg-[var(--paper-raised)] shrink-0"
      />
      <div className="min-w-0 flex-1">
        <p className="font-display text-lg truncate">{charity.name}</p>
        <p className="text-sm text-[var(--ink-soft)] truncate max-w-md">
          {charity.description}
        </p>
      </div>
      <div className="text-right shrink-0 space-y-1">
        <StatusPill status={charity.status} />
        {charity.status === "live" && (
          <p className="text-xs text-[var(--ink-soft)] tabular">
            {daysLeft} day{daysLeft === 1 ? "" : "s"} left
          </p>
        )}
      </div>
    </Link>
  );
}
