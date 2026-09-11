import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllCharitiesPublic } from "../api/charities";
import { getAllCategories } from "../api/categories";
import { getAllProducts } from "../api/products";
import CharityRow from "../components/CharityRow";
import ProductRow from "../components/ProductRow";

export default function Home() {
  const [charities, setCharities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getAllCharitiesPublic(), getAllCategories(), getAllProducts()])
      .then(([c, cat, p]) => {
        setCharities(c.filter((x) => x.status === "live").slice(0, 4));
        setCategories(cat.slice(0, 8));
        setProducts(p.filter((x) => x.status === "active").slice(0, 6));
      })
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-6">
      <section className="py-16 border-b border-[var(--line)]">
        <h1 className="font-display text-5xl leading-tight max-w-2xl">
          Buy something. Fund something.
        </h1>
        <p className="mt-4 max-w-lg text-[var(--ink-soft)]">
          Every product here is tied to a live charity campaign. A fixed share
          of what you pay goes straight to the cause — shown up front, on
          every listing, before you buy.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            to="/products"
            className="px-4 py-2 text-sm font-medium bg-[var(--moss)] text-white hover:bg-[var(--moss-dark)]"
          >
            Browse products
          </Link>
          <Link
            to="/charities"
            className="px-4 py-2 text-sm font-medium border border-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--paper)]"
          >
            See active campaigns
          </Link>
        </div>
      </section>

      {error && <p className="text-[var(--clay)] py-6">{error}</p>}

      {charities.length > 0 && (
        <section className="py-10 border-b border-[var(--line)]">
          <div className="flex items-baseline justify-between mb-2">
            <h2 className="font-display text-2xl">Active campaigns</h2>
            <Link to="/charities" className="text-sm text-[var(--moss)]">
              View all →
            </Link>
          </div>
          <div>
            {charities.map((c) => (
              <CharityRow key={c._id} charity={c} />
            ))}
          </div>
        </section>
      )}

      {categories.length > 0 && (
        <section className="py-10 border-b border-[var(--line)]">
          <h2 className="font-display text-2xl mb-4">Browse by category</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <Link
                key={c._id}
                to={`/categories/${c._id}`}
                className="px-3 py-1.5 text-sm border border-[var(--line)] hover:border-[var(--moss)] hover:text-[var(--moss)] bg-[var(--paper-raised)]"
              >
                {c.title}
              </Link>
            ))}
          </div>
        </section>
      )}

      {products.length > 0 && (
        <section className="py-10">
          <div className="flex items-baseline justify-between mb-2">
            <h2 className="font-display text-2xl">Recently listed</h2>
            <Link to="/products" className="text-sm text-[var(--moss)]">
              View all →
            </Link>
          </div>
          <div>
            {products.map((p) => (
              <ProductRow key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
