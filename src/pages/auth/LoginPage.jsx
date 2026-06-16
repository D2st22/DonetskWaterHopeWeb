import {
  AlertTriangle,
  Droplets,
  Gauge,
  Headphones,
  LockKeyhole,
  LogIn,
  Plus,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Field, LocaleControls, StatusMessage } from "../../components/ui.jsx";
import { useApp } from "../../context/AppContext.jsx";

const DEMO_ACCOUNTS = {
  user: { accountNumber: "WH-0MWXOUI0", password: "123456789" },
  admin: { accountNumber: "WH-ADMIN01", password: "123456789" },
};

const copy = {
  uk: {
    title: "Особистий кабінет водоспоживання",
    description:
      "Переглядайте лічильники, історію споживання, попередження та звернення до підтримки в одному місці.",
    account: "Особовий рахунок",
    accountHint: "Введіть номер у форматі WH-XXXXXXXX.",
    accountPlaceholder: "WH-00000000",
    password: "Пароль",
    passwordPlaceholder: "Введіть пароль",
    signIn: "Увійти",
    signingIn: "Вхід...",
    missing: "Введіть особовий рахунок і пароль.",
    emailUsed:
      "Для входу потрібен особовий рахунок у форматі WH-XXXXXXXX, а не email.",
    failed: "Не вдалося увійти. Перевірте особовий рахунок або пароль.",
    noAccount: "Немає акаунта?",
    createAccount: "Створити акаунт",
    afterLogin: "Після входу",
    afterTitle: "Ваші дані будуть зібрані в одному кабінеті",
    afterText:
      "Після входу тут з’являться ваші лічильники, показники споживання, попередження та звернення.",
    meters: "Лічильники",
    metersText: "Стан пристроїв, серійні номери та останні показники.",
    consumption: "Споживання",
    consumptionText: "Історія використання води та сума до сплати.",
    warnings: "Попередження",
    warningsText: "Витоки, критичні події та повідомлення системи.",
    support: "Підтримка",
    supportText: "Створення й перегляд звернень до служби підтримки.",
  },
  en: {
    title: "Water Consumption Portal",
    description:
      "View meters, consumption history, alerts and support requests in one place.",
    account: "Account number",
    accountHint:
      "Enter a number in the WH-XXXXXXXX format. Email is not used for sign in.",
    accountPlaceholder: "For example, WH-0MWXOUI0",
    password: "Password",
    passwordPlaceholder: "Enter password",
    signIn: "Sign in",
    signingIn: "Signing in...",
    missing: "Enter your account number and password.",
    emailUsed: "Use an account number in the WH-XXXXXXXX format, not email.",
    failed: "Could not sign in. Check your account number or password.",
    noAccount: "No account yet?",
    createAccount: "Create account",
    afterLogin: "After sign in",
    afterTitle: "Your water data will be available in one portal",
    afterText:
      "After sign in, your meters, consumption readings, alerts and requests will appear here.",
    meters: "Meters",
    metersText: "Device status, serial numbers and latest readings.",
    consumption: "Consumption",
    consumptionText: "Water usage history and amount due.",
    warnings: "Alerts",
    warningsText: "Leaks, critical events and system notifications.",
    support: "Support",
    supportText: "Create and review support requests.",
  },
};

export function LoginPage() {
  const { baseUrl, busy, lang, login, setMessage, token, user } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [accountNumber, setAccountNumber] = useState("");
  const [password, setPassword] = useState("");
  const t = copy[lang] || copy.uk;

  if (token && user) {
    return <Navigate to={user.role === "Admin" ? "/admin" : "/app"} replace />;
  }

  async function submit(event) {
    event.preventDefault();
    await signIn({
      accountNumber: accountNumber.trim(),
      password,
    });
  }

  async function signIn(credentials) {
    if (!credentials.accountNumber || !credentials.password) {
      setMessage(`!${t.missing}`);
      return;
    }

    if (credentials.accountNumber.includes("@")) {
      setMessage(`!${t.emailUsed}`);
      return;
    }

    try {
      const nextUser = await login({
        nextBaseUrl: baseUrl,
        accountNumber: credentials.accountNumber,
        password: credentials.password,
      });
      const target =
        location.state?.from?.pathname ||
        (nextUser.role === "Admin" ? "/admin" : "/app");
      navigate(target, { replace: true });
    } catch {
      setMessage(`!${t.failed}`);
    }
  }

  return (
    <main className="relative min-h-screen bg-[#f4f7f8] text-slate-950">
      <div className="absolute right-4 top-4 z-10 w-44 rounded-lg border border-slate-200 bg-white/95 p-2 shadow-sm">
        <LocaleControls />
      </div>
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-6 px-4 py-20 md:px-6 lg:grid-cols-[420px_minmax(0,1fr)] lg:py-6">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft md:p-7">
          <div className="mb-7">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-water-700 text-white">
              <Droplets size={26} />
            </div>
            <p className="text-sm font-semibold uppercase tracking-wide text-water-700">
              DonetskWaterHope
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
              {t.title}
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {t.description}
            </p>
          </div>

          <StatusMessage />

          <form className="grid gap-4" onSubmit={submit}>
            <Field label={t.account} hint={t.accountHint}>
              <input
                className="input"
                name="accountNumber"
                placeholder={t.accountPlaceholder}
                autoComplete="username"
                dir="auto"
                required
                value={accountNumber}
                onChange={(event) => setAccountNumber(event.target.value)}
              />
            </Field>

            <Field
              label={
                <span className="inline-flex items-center gap-2">
                  <LockKeyhole size={15} />
                  {t.password}
                </span>
              }
            >
              <input
                className="input"
                name="password"
                type="password"
                placeholder={t.passwordPlaceholder}
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </Field>

            <button
              className="btn btn-primary mt-1 min-h-12 w-full text-base"
              disabled={busy}
              type="submit"
            >
              <LogIn size={18} />
              {busy ? t.signingIn : t.signIn}
            </button>
          </form>

          <footer className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5 text-sm">
            <span className="text-slate-500">{t.noAccount}</span>
            <Link className="btn btn-soft" to="/register">
              <Plus size={16} />
              {t.createAccount}
            </Link>
          </footer>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-7 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-water-700">
              {t.afterLogin}
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              {t.afterTitle}
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-600">
              {t.afterText}
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <FeatureTile
              icon={Gauge}
              title={t.meters}
              description={t.metersText}
            />
            <FeatureTile
              icon={Droplets}
              title={t.consumption}
              description={t.consumptionText}
            />
            <FeatureTile
              icon={AlertTriangle}
              title={t.warnings}
              description={t.warningsText}
            />
            <FeatureTile
              icon={Headphones}
              title={t.support}
              description={t.supportText}
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function FeatureTile({ icon: Icon, title, description }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-white text-water-700">
        <Icon size={21} />
      </div>
      <h3 className="font-bold text-slate-950">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}
