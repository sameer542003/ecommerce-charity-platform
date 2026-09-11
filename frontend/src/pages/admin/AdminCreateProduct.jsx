import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCharityForAdmin } from "../../api/charities";
import { getCategoriesForAdmin } from "../../api/categories";
import { createProduct } from "../../api/products";
import Field, { inputClass } from "../../components/Field";
import Banner from "../../components/Banner";
import Button from "../../components/Button";

const emptyForm = {
  title: "",
  short_description: "",
  long_description: "",
  charity_id: "",
  category_id: "",
  quantity: 25,
  price: "",
  discount: 0,
};

export default function AdminCreateProduct() {
  const location = useLocation();
  const navigate = useNavigate();
  const [charities, setCharities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    ...emptyForm,
    charity_id: location.state?.charity_id || "",
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getCharityForAdmin().then(setCharities).catch(() => {});
    getCategoriesForAdmin().then(setCategories).catch(() => {});
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!file) {
      setError("Choose a product image.");
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append("image", file);
      const res = await createProduct(fd);
      navigate(`/products/${res.data._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h2 className="font-display text-2xl mb-4">New product</h2>
      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        <Banner>{error}</Banner>
        <Field label="Title" hint="Alphabets and spaces only">
          <input
            className={inputClass}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </Field>
        <Field label="Short description" hint="10–100 characters">
          <input
            className={inputClass}
            value={form.short_description}
            onChange={(e) => setForm({ ...form, short_description: e.target.value })}
            required
          />
        </Field>
        <Field label="Long description" hint="20–1000 characters">
          <textarea
            rows={4}
            className={inputClass}
            value={form.long_description}
            onChange={(e) => setForm({ ...form, long_description: e.target.value })}
            required
          />
        </Field>
        <Field label="Charity">
          <select
            className={inputClass}
            value={form.charity_id}
            onChange={(e) => setForm({ ...form, charity_id: e.target.value })}
            required
          >
            <option value="" disabled>
              Select a charity you run
            </option>
            {charities.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Category">
          <select
            className={inputClass}
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            required
          >
            <option value="" disabled>
              Select a category you created
            </option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
        </Field>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Quantity" hint="25–50">
            <input
              type="number"
              min="25"
              max="50"
              className={inputClass}
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              required
            />
          </Field>
          <Field label="Price (₹)">
            <input
              type="number"
              className={inputClass}
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
          </Field>
          <Field label="Discount %">
            <input
              type="number"
              className={inputClass}
              value={form.discount}
              onChange={(e) => setForm({ ...form, discount: e.target.value })}
            />
          </Field>
        </div>
        <Field label="Product image" hint="JPG/PNG, up to 1MB">
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={(e) => setFile(e.target.files[0])}
            className="text-sm"
          />
        </Field>
        <Button type="submit" disabled={saving}>
          {saving ? "Creating…" : "Create product"}
        </Button>
      </form>
    </div>
  );
}
