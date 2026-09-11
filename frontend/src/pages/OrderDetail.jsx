import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderById } from "../api/orders";
import StatusPill from "../components/StatusPill";
import Banner from "../components/Banner";

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getOrderById(id)
      .then(setOrder)
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12">
        <Banner>{error}</Banner>
      </div>
    );
  }
  if (!order) return <div className="mx-auto max-w-2xl px-6 py-12">Loading…</div>;

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <Link to="/orders" className="text-sm text-[var(--moss)]">
        ← My orders
      </Link>
      <div className="mt-4 flex items-start justify-between">
        <h1 className="font-display text-3xl">Order receipt</h1>
        <StatusPill status={order.status} />
      </div>
      <p className="text-sm text-[var(--ink-soft)] tabular mt-1">
        Placed {new Date(order.createdAt).toLocaleString()}
      </p>

      <div className="mt-8 border border-[var(--line)] bg-[var(--paper-raised)]">
        <div className="flex items-center gap-4 p-4 border-b border-[var(--line)]">
          <img
            src={order.product_id?.image}
            alt=""
            className="h-16 w-16 object-cover border border-[var(--line)]"
          />
          <div className="flex-1">
            <p className="font-medium">{order.product_id?.title}</p>
            <p className="text-sm text-[var(--ink-soft)]">
              supports {order.charity_id?.name}
            </p>
          </div>
        </div>
        <dl className="p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-[var(--ink-soft)]">Quantity</dt>
            <dd className="tabular">{order.quantity}</dd>
          </div>
          <div className="flex justify-between font-medium">
            <dt>Total paid</dt>
            <dd className="tabular">₹{order.amount}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
