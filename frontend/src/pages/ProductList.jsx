import { useEffect, useState } from "react";
import { getAllProducts } from "../api/products";
import ProductRow from "../components/ProductRow";
import Banner from "../components/Banner";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    getAllProducts()
      .then((p) => setProducts(p.filter((x) => x.status === "active")))
      .catch((err) => setError(err.message));
  }, []);

  const visible = products.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex items-baseline justify-between gap-4 mb-6">
        <h1 className="font-display text-3xl">Shop</h1>
        <input
          placeholder="Search products…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border border-[var(--line)] bg-[var(--paper-raised)] px-3 py-2 text-sm w-56 focus:border-[var(--moss)] outline-none"
        />
      </div>
      <Banner>{error}</Banner>
      {visible.length === 0 && !error && (
        <p className="text-[var(--ink-soft)] py-8">No products match.</p>
      )}
      <div>
        {visible.map((p) => (
          <ProductRow key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
}
