import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCharityByIdAdmin, updateCharity } from "../../api/charities";
import { getProductsByCharityForAdmin, updateProductStatus } from "../../api/products";
import { getOrdersByCharity } from "../../api/orders";
import Field, { inputClass } from "../../components/Field";
import Banner from "../../components/Banner";
import Button from "../../components/Button";
import StatusPill from "../../components/StatusPill";

const PRODUCT_STATUSES = ["pending", "active", "sold", "inactive"];

function toDateInput(d) {
  return d ? new Date(d).toISOString().slice(0, 10) : "";
}

export default function AdminCharityDetail() {
  const { id } = useParams();
  const [charity, setCharity] = useState(null);
  const [form, setForm] = useState(null);
  const [file, setFile] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  function refresh() {
    getCharityByIdAdmin(id)
      .then((c) => {
        setCharity(c);
        setForm({
          name: c.name,
          description: c.description,
          charity_email: c.charity_email,
          start_date: toDateInput(c.start_date),
          end_date: toDateInput(c.end_date),
          platform_fee: c.platform_fee,
          donation_fee: c.donation_fee,
          profit: c.profit,
        });
      })
      .catch((err) => setError(err.message));
    getProductsByCharityForAdmin(id).then(setProducts).catch(() => {});
    getOrdersByCharity(id).then(setOrders).catch(() => {});
  }

  useEffect(refresh, [id]);

  async function handleUpdate(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append("banner", file);
      await updateCharity(id, fd);
      setSuccess("Charity updated.");
      refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(productId, status) {
    try {
      await updateProductStatus(productId, status);
      setProducts((prev) => prev.map((p) => (p._id === productId ? { ...p, status } : p)));
    } catch (err) {
      setError(err.message);
    }
  }

  if (!charity || !form) {
    return <Banner>{error}</Banner>;
  }

  const totalFee =
    Number(form.platform_fee || 0) + Number(form.donation_fee || 0) + Number(form.profit || 0);

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-3">
        <h2 className="font-display text-2xl">{charity.name}</h2>
        <StatusPill status={charity.status} />
      </div>

      <form onSubmit={handleUpdate} className="max-w-lg space-y-4">
        <h3 className="font-medium">Edit campaign</h3>
        <Banner>{error}</Banner>
        <Banner tone="success">{success}</Banner>
        <Field label="Name">
          <input
            className={inputClass}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </Field>
        <Field label="Description">
          <textarea
            className={inputClass}
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
        </Field>
        <Field label="Contact email">
          <input
            type="email"
            className={inputClass}
            value={form.charity_email}
            onChange={(e) => setForm({ ...form, charity_email: e.target.value })}
            required
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Start date">
            <input
              type="date"
              className={inputClass}
              value={form.start_date}
              onChange={(e) => setForm({ ...form, start_date: e.target.value })}
              required
            />
          </Field>
          <Field label="End date">
            <input
              type="date"
              className={inputClass}
              value={form.end_date}
              onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              required
            />
          </Field>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Donation %">
            <input
              type="number"
              className={inputClass}
              value={form.donation_fee}
              onChange={(e) => setForm({ ...form, donation_fee: e.target.value })}
            />
          </Field>
          <Field label="Platform %">
            <input
              type="number"
              className={inputClass}
              value={form.platform_fee}
              onChange={(e) => setForm({ ...form, platform_fee: e.target.value })}
            />
          </Field>
          <Field label="Profit %">
            <input
              type="number"
              className={inputClass}
              value={form.profit}
              onChange={(e) => setForm({ ...form, profit: e.target.value })}
            />
          </Field>
        </div>
        <p className={`text-xs ${totalFee === 100 ? "text-[var(--moss)]" : "text-[var(--clay)]"}`}>
          Total: {totalFee}% (must equal 100%)
        </p>
        <Field label="Replace banner image" hint="Leave empty to keep the current one">
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={(e) => setFile(e.target.files[0])}
            className="text-sm"
          />
        </Field>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </form>

      <div>
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Products under this charity</h3>
          <Link to="/admin/products/new" state={{ charity_id: id }} className="text-sm text-[var(--moss)]">
            + New product
          </Link>
        </div>
        {products.length === 0 ? (
          <p className="text-[var(--ink-soft)] mt-2">No products yet.</p>
        ) : (
          <div className="mt-2">
            {products.map((p) => (
              <div key={p._id} className="flex items-center gap-3 border-b border-[var(--line)] py-2">
                <span className="flex-1">{p.title}</span>
                <select
                  value={p.status}
                  onChange={(e) => handleStatusChange(p._id, e.target.value)}
                  className="border border-[var(--line)] bg-[var(--paper-raised)] text-sm px-2 py-1"
                >
                  {PRODUCT_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="font-medium">Orders for this charity</h3>
        {orders.length === 0 ? (
          <p className="text-[var(--ink-soft)] mt-2">No orders yet.</p>
        ) : (
          <div className="mt-2">
            {orders.map((o) => (
              <div key={o._id} className="flex items-center gap-3 border-b border-[var(--line)] py-2 text-sm">
                <span className="flex-1">
                  {o.product_id?.title} × {o.quantity} — {o.user_id?.name}
                </span>
                <span className="tabular">₹{o.amount}</span>
                <StatusPill status={o.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
