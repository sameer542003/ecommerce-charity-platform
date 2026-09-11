import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductsByCategory } from "../api/products";
import ProductRow from "../components/ProductRow";
import Banner from "../components/Banner";

export default function CategoryProducts() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getProductsByCategory(id)
      .then(setProducts)
      .catch((err) => setError(err.message));
  }, [id]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <Link to="/products" className="text-sm text-[var(--moss)]">
        ← All products
      </Link>
      <h1 className="font-display text-3xl mt-2 mb-6">
        {products[0]?.category_id?.title || "Category"}
      </h1>
      <Banner>{error}</Banner>
      {products.length === 0 && !error && (
        <p className="text-[var(--ink-soft)] py-8">No products in this category yet.</p>
      )}
      <div>
        {products.map((p) => (
          <ProductRow key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
}
