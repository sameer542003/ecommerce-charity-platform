import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Field, { inputClass } from "../components/Field";
import Banner from "../components/Banner";
import Button from "../components/Button";

const initial = { name: "", email: "", mobile: "", password: "" };

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="font-display text-3xl mb-1">Create an account</h1>
      <p className="text-[var(--ink-soft)] mb-8">
        Join Common Cause and start shopping with impact.
      </p>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Banner>{error}</Banner>
        <Banner tone="success">
          {success ? "Account created — redirecting to log in…" : ""}
        </Banner>
        <Field label="Full name">
          <input
            className={inputClass}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </Field>
        <Field label="Email">
          <input
            type="email"
            className={inputClass}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </Field>
        <Field label="Mobile number" hint="10 digits, optionally with a country code">
          <input
            className={inputClass}
            value={form.mobile}
            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
            required
          />
        </Field>
        <Field
          label="Password"
          hint="6–12 characters, with at least 1 uppercase letter, 1 number and 1 symbol"
        >
          <input
            type="password"
            className={inputClass}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </Field>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Creating account…" : "Create account"}
        </Button>
      </form>
      <p className="mt-6 text-sm text-[var(--ink-soft)]">
        Already have an account?{" "}
        <Link to="/login" className="text-[var(--moss)] font-medium">
          Log in
        </Link>
      </p>
    </div>
  );
}
