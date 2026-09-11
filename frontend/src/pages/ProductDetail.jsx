import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getProductById } from "../api/products";
import { createOrder } from "../api/orders";
import { useAuth } from "../context/AuthContext";
import StatusPill from "../components/StatusPill";
import Banner from "../components/Banner";
import Button from "../components/Button";

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);

  useEffect(() => {
    getProductById(id)
      .then(setProduct)
      .catch((err) => setError(err.message));
  }, [id]);

  async function handleBuy() {
    setError("");
    setPlacing(true);
    try {
      await createOrder({ product_id: id, quantity: Number(quantity) });
      setPlaced(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  }

  if (error && !product) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12">
        <Banner>{error}</Banner>
      </div>
    );
  }
  if (!product) return <div className="mx-auto max-w-4xl px-6 py-12">Loading…</div>;

  const finalPrice = (
    product.price - (product.price * (product.discount || 0)) / 100
  ).toFixed(2);

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="grid md:grid-cols-2 gap-10">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-80 object-cover border border-[var(--line)]"
        />
        <div>
          <div className="flex items-start justify-between gap-3">
            <h1 className="font-display text-3xl">{product.title}</h1>
            <StatusPill status={product.status} />
          </div>
          {product.charity_id?.name && (
            <Link
              to={`/charities/${product.charity_id._id}`}
              className="text-sm text-[var(--moss)] mt-1 inline-block"
            >
              Supports {product.charity_id.name}
            </Link>
          )}
          <p className="mt-4 text-[var(--ink)]">{product.long_description}</p>

          <div className="mt-6 flex items-baseline gap-3 tabular">
            {product.discount > 0 && (
              <span className="text-[var(--ink-soft)] line-through">
                ₹{product.price}
              </span>
            )}
            <span className="text-2xl font-medium">₹{finalPrice}</span>
            {product.discount > 0 && (
              <span className="text-sm text-[var(--moss)]">
                {product.discount}% off
              </span>
            )}
          </div>
          <p className="text-sm text-[var(--ink-soft)] mt-1 tabular">
            {product.quantity} left in stock
          </p>

          <Banner>{error}</Banner>
          <Banner tone="success">
            {placed ? "Order placed! We've emailed and texted you a confirmation." : ""}
          </Banner>

          {product.status !== "active" ? (
            <p className="mt-6 text-[var(--ink-soft)]">
              This product isn't currently available for purchase.
            </p>
          ) : !user ? (
            <div className="mt-6">
              <Link
                to="/login"
                state={{ from: { pathname: `/products/${id}` } }}
                className="px-4 py-2 text-sm font-medium bg-[var(--moss)] text-white hover:bg-[var(--moss-dark)] inline-block"
              >
                Log in to buy
              </Link>
            </div>
          ) : placed ? (
            <Button className="mt-6" onClick={() => navigate("/orders")}>
              View my orders
            </Button>
          ) : (
            <div className="mt-6 flex items-end gap-3">
              <label className="block">
                <span className="block text-sm font-medium mb-1.5">Quantity</span>
                <input
                  type="number"
                  min="1"
                  max={product.quantity}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-24 border border-[var(--line)] bg-[var(--paper-raised)] px-3 py-2 text-sm focus:border-[var(--moss)] outline-none"
                />
              </label>
              <Button onClick={handleBuy} disabled={placing}>
                {placing ? "Placing order…" : "Buy now"}
              </Button>
            </div>
          )}
          {user && !placed && (
            <p className="text-xs text-[var(--ink-soft)] mt-3">
              Needs a saved{" "}
              <Link to="/address" className="text-[var(--moss)]">
                delivery address
              </Link>
              .
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
