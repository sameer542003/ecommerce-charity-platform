import { useEffect, useState } from "react";
import {
  getCategoriesForAdmin,
  createCategory,
  updateCategoryTitle,
} from "../../api/categories";
import Field, { inputClass } from "../../components/Field";
import Banner from "../../components/Banner";
import Button from "../../components/Button";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  function refresh() {
    getCategoriesForAdmin().then(setCategories).catch((err) => setError(err.message));
  }

  useEffect(refresh, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    if (!file) {
      setError("Choose an image for the category.");
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("image", file);
      await createCategory(fd);
      setTitle("");
      setFile(null);
      refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleRename(id) {
    setError("");
    try {
      await updateCategoryTitle(id, editTitle);
      setEditingId(null);
      refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-display text-2xl mb-4">New category</h2>
        <form onSubmit={handleCreate} className="max-w-sm space-y-4">
          <Banner>{error}</Banner>
          <Field label="Title">
            <input
              className={inputClass}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Field>
          <Field label="Image" hint="JPG/PNG, up to 1MB">
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={(e) => setFile(e.target.files[0])}
              className="text-sm"
            />
          </Field>
          <Button type="submit" disabled={saving}>
            {saving ? "Creating…" : "Create category"}
          </Button>
        </form>
      </div>

      <div>
        <h2 className="font-display text-2xl mb-4">Your categories</h2>
        {categories.length === 0 && (
          <p className="text-[var(--ink-soft)]">No categories yet.</p>
        )}
        <div>
          {categories.map((c) => (
            <div
              key={c._id}
              className="flex items-center gap-4 border-b border-[var(--line)] py-3"
            >
              <img
                src={c.image}
                alt={c.title}
                className="h-12 w-12 object-cover border border-[var(--line)]"
              />
              {editingId === c._id ? (
                <>
                  <input
                    className={inputClass}
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <Button onClick={() => handleRename(c._id)}>Save</Button>
                  <Button variant="ghost" onClick={() => setEditingId(null)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <span className="flex-1">{c.title}</span>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingId(c._id);
                      setEditTitle(c.title);
                    }}
                  >
                    Rename
                  </Button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
