import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Field, { inputClass } from "../components/Field";
import Banner from "../components/Banner";
import Button from "../components/Button";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ loginId: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.loginId, form.password);
      const dest = location.state?.from?.pathname || "/";
      navigate(dest, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="font-display text-3xl mb-1">Log in</h1>
      <p className="text-[var(--ink-soft)] mb-8">
        Welcome back to Common Cause.
      </p>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Banner>{error}</Banner>
        <Field label="Email or mobile number">
          <input
            className={inputClass}
            value={form.loginId}
            onChange={(e) => setForm({ ...form, loginId: e.target.value })}
            required
          />
        </Field>
        <Field label="Password">
          <input
            type="password"
            className={inputClass}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </Field>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Logging in…" : "Log in"}
        </Button>
      </form>
      <p className="mt-6 text-sm text-[var(--ink-soft)]">
        New here?{" "}
        <Link to="/register" className="text-[var(--moss)] font-medium">
          Create an account
        </Link>
      </p>
    </div>
  );
}
