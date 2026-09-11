import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCharityForAdmin, createCharity } from "../../api/charities";
import Field, { inputClass } from "../../components/Field";
import Banner from "../../components/Banner";
import Button from "../../components/Button";
import StatusPill from "../../components/StatusPill";

const emptyForm = {
  name: "",
  description: "",
  charity_email: "",
  start_date: "",
  end_date: "",
  platform_fee: 10,
  donation_fee: 70,
  profit: 20,
};

export default function AdminCharities() {
  const [charities, setCharities] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function refresh() {
    getCharityForAdmin().then(setCharities).catch((err) => setError(err.message));
  }

  useEffect(refresh, []);

  const totalFee =
    Number(form.platform_fee || 0) + Number(form.donation_fee || 0) + Number(form.profit || 0);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    if (!file) {
      setError("Choose a banner image.");
      return;
    }
    if (totalFee !== 100) {
      setError("Platform fee + donation fee + profit must add up to exactly 100.");
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append("banner", file);
      await createCharity(fd);
      setForm(emptyForm);
      setFile(null);
      refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-display text-2xl mb-4">New charity campaign</h2>
        <form onSubmit={handleCreate} className="max-w-lg space-y-4">
          <Banner>{error}</Banner>
          <Field label="Name" hint="Letters and spaces only">
            <input
              className={inputClass}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </Field>
          <Field label="Description" hint="30–100 characters">
            <textarea
              className={inputClass}
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </Field>
          <Field label="Charity contact email">
            <input
              type="email"
              className={inputClass}
              value={form.charity_email}
              onChange={(e) => setForm({ ...form, charity_email: e.target.value })}
              required
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Start date" hint="Must be in the future">
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
          <p
            className={`text-xs ${
              totalFee === 100 ? "text-[var(--moss)]" : "text-[var(--clay)]"
            }`}
          >
            Total: {totalFee}% (must equal 100%)
          </p>
          <Field label="Banner image" hint="JPG/PNG, up to 1MB">
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={(e) => setFile(e.target.files[0])}
              className="text-sm"
            />
          </Field>
          <Button type="submit" disabled={saving}>
            {saving ? "Creating…" : "Create charity"}
          </Button>
        </form>
      </div>

      <div>
        <h2 className="font-display text-2xl mb-4">Your charities</h2>
        {charities.length === 0 && (
          <p className="text-[var(--ink-soft)]">No charities yet.</p>
        )}
        <div>
          {charities.map((c) => (
            <Link
              key={c._id}
              to={`/admin/charities/${c._id}`}
              className="flex items-center gap-4 border-b border-[var(--line)] py-3 hover:bg-[var(--paper-raised)] px-2 -mx-2"
            >
              <img
                src={c.banner}
                alt={c.name}
                className="h-12 w-16 object-cover border border-[var(--line)]"
              />
              <span className="flex-1">{c.name}</span>
              <StatusPill status={c.status} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
