import { useEffect, useState } from "react";
import { getAddress, createAddress, updateAddress } from "../api/address";
import Field, { inputClass } from "../components/Field";
import Banner from "../components/Banner";
import Button from "../components/Button";

const empty = { location: "", city: "", pincode: "", state: "", country: "India" };

export default function Addresses() {
  const [address, setAddress] = useState(null);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    getAddress()
      .then((a) => {
        setAddress(a);
        setForm({
          location: a.location,
          city: a.city,
          pincode: a.pincode,
          state: a.state,
          country: a.country,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const payload = { ...form, pincode: Number(form.pincode) };
      if (address) {
        const res = await updateAddress(address._id, payload);
        setAddress(res.data);
        setSuccess("Address updated.");
      } else {
        const res = await createAddress(payload);
        setAddress(res.data);
        setSuccess("Address saved.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="mx-auto max-w-md px-6 py-16">Loading…</div>;

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="font-display text-3xl mb-1">Delivery address</h1>
      <p className="text-[var(--ink-soft)] mb-8">
        One address per account — needed before you can place an order.
      </p>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Banner>{error}</Banner>
        <Banner tone="success">{success}</Banner>
        <Field label="Address line">
          <input
            className={inputClass}
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            required
          />
        </Field>
        <Field label="City">
          <input
            className={inputClass}
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            required
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="State">
            <input
              className={inputClass}
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              required
            />
          </Field>
          <Field label="Pincode">
            <input
              className={inputClass}
              value={form.pincode}
              onChange={(e) => setForm({ ...form, pincode: e.target.value })}
              required
            />
          </Field>
        </div>
        <Field label="Country">
          <input
            className={inputClass}
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
          />
        </Field>
        <Button type="submit" disabled={saving} className="w-full">
          {saving ? "Saving…" : address ? "Update address" : "Save address"}
        </Button>
      </form>
    </div>
  );
}
