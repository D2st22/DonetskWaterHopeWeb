import { Droplets, Save } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Field, LocaleControls, StatusMessage } from "../../components/ui.jsx";
import { useApp } from "../../context/AppContext.jsx";

export function RegisterPage() {
  const { busy, register, text, token, user } = useApp();
  const navigate = useNavigate();

  if (token && user) {
    return <Navigate to={user.role === "Admin" ? "/admin" : "/app"} replace />;
  }

  async function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await register({
        firstName: String(form.get("firstName") || "").trim(),
        lastName: String(form.get("lastName") || "").trim(),
        email: String(form.get("email") || "").trim(),
        phoneNumber: String(form.get("phoneNumber") || "").trim() || null,
        password: String(form.get("password") || "")
      });
      navigate("/login");
    } catch {
      // Context displays the error.
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-8">
      <section className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-water-600 text-white">
            <Droplets size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-950">{text.signUp}</h1>
            <p className="text-sm text-slate-500">{text.publicRegisterNote}</p>
          </div>
        </div>

        <StatusMessage />

        <form className="grid gap-4" onSubmit={submit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={text.firstName}><input className="input" name="firstName" dir="auto" required /></Field>
            <Field label={text.lastName}><input className="input" name="lastName" dir="auto" required /></Field>
          </div>
          <Field label={text.email}><input className="input" name="email" type="email" dir="auto" required /></Field>
          <Field label={text.phone}><input className="input" name="phoneNumber" dir="auto" /></Field>
          <Field label={text.password}><input className="input" name="password" type="password" minLength={6} required /></Field>
          <LocaleControls />
          <button className="btn btn-primary" disabled={busy} type="submit">
            <Save size={17} />
            {text.register}
          </button>
        </form>

        <div className="mt-5 border-t border-slate-100 pt-5 text-sm">
          <span className="text-slate-500">{text.alreadyHaveAccount}</span>{" "}
          <Link className="font-semibold text-water-700 hover:text-water-900" to="/login">{text.backToLogin}</Link>
        </div>
      </section>
    </main>
  );
}
