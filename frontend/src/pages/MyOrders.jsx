import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserOrders } from "../api/orders";
import StatusPill from "../components/StatusPill";
import Banner from "../components/Banner";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getUserOrders()
      .then(setOrders)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-display text-3xl mb-6">My orders</h1>
      <Banner>{error}</Banner>
      {orders.length === 0 && !error && (
        <p className="text-[var(--ink-soft)] py-8">
          No orders yet. <Link to="/products" className="text-[var(--moss)]">Start shopping →</Link>
        </p>
      )}
      <div>
        {orders.map((o) => (
          <Link
            key={o._id}
            to={`/orders/${o._id}`}
            className="flex items-center gap-4 border-b border-[var(--line)] py-4 hover:bg-[var(--paper-raised)] transition-colors px-2 -mx-2"
          >
            <img
              src={o.product_id?.image}
              alt=""
              className="h-14 w-14 object-cover border border-[var(--line)] shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="font-medium truncate">{o.product_id?.title}</p>
              <p className="text-xs text-[var(--ink-soft)]">
                supports {o.charity_id?.name} · placed{" "}
                {new Date(o.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right shrink-0 space-y-1">
              <p className="tabular font-medium">₹{o.amount}</p>
              <StatusPill status={o.status} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
