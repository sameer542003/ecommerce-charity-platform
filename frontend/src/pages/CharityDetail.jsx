import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCharityById } from "../api/charities";
import { getProductsByCharityPublic } from "../api/products";
import FeeSplitBar from "../components/FeeSplitBar";
import StatusPill from "../components/StatusPill";
import ProductRow from "../components/ProductRow";
import Banner from "../components/Banner";

export default function CharityDetail() {
  const { id } = useParams();
  const [charity, setCharity] = useState(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getCharityById(id), getProductsByCharityPublic(id)])
      .then(([c, p]) => {
        setCharity(c);
        setProducts(p);
      })
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-12">
        <Banner>{error}</Banner>
      </div>
    );
  }
  if (!charity) return <div className="mx-auto max-w-6xl px-6 py-12">Loading…</div>;

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <img
        src={charity.banner}
        alt={charity.name}
        className="w-full h-64 object-cover border border-[var(--line)] mb-6"
      />
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">{charity.name}</h1>
          <p className="text-sm text-[var(--ink-soft)] mt-1">
            Run by {charity.user_id?.name}
          </p>
        </div>
        <StatusPill status={charity.status} />
      </div>
      <p className="mt-4 max-w-2xl text-[var(--ink)]">{charity.description}</p>

      <div className="mt-6 max-w-sm border border-[var(--line)] p-4 bg-[var(--paper-raised)]">
        <p className="text-sm font-medium mb-2">Where your money goes</p>
        <FeeSplitBar
          donation_fee={charity.donation_fee}
          platform_fee={charity.platform_fee}
          profit={charity.profit}
        />
      </div>

      <div className="mt-4 text-sm text-[var(--ink-soft)] tabular">
        Runs {new Date(charity.start_date).toLocaleDateString()} –{" "}
        {new Date(charity.end_date).toLocaleDateString()}
      </div>

      <section className="mt-10 pt-8 border-t border-[var(--line)]">
        <h2 className="font-display text-2xl mb-2">Products supporting this cause</h2>
        {products.length === 0 ? (
          <p className="text-[var(--ink-soft)] py-6">No active products yet.</p>
        ) : (
          <div>
            {products.map((p) => (
              <ProductRow key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
