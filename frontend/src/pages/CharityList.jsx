import { useEffect, useState } from "react";
import { getAllCharitiesPublic } from "../api/charities";
import CharityRow from "../components/CharityRow";
import Banner from "../components/Banner";

export default function CharityList() {
  const [charities, setCharities] = useState([]);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    getAllCharitiesPublic()
      .then(setCharities)
      .catch((err) => setError(err.message));
  }, []);

  const visible =
    filter === "all" ? charities : charities.filter((c) => c.status === filter);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display text-3xl mb-2">Charity campaigns</h1>
      <p className="text-[var(--ink-soft)] mb-6">
        Every product on the site is tied to one of these.
      </p>
      <div className="flex gap-2 mb-6">
        {["all", "live", "pending", "approved", "closed"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 text-sm border ${
              filter === s
                ? "border-[var(--moss)] text-[var(--moss)]"
                : "border-[var(--line)] text-[var(--ink-soft)]"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      <Banner>{error}</Banner>
      {visible.length === 0 && !error && (
        <p className="text-[var(--ink-soft)] py-8">No charities to show here yet.</p>
      )}
      <div>
        {visible.map((c) => (
          <CharityRow key={c._id} charity={c} />
        ))}
      </div>
    </div>
  );
}
