import { Save } from "lucide-react";
import { Field, PageHeader } from "../../components/ui.jsx";
import { useApp } from "../../context/AppContext.jsx";

export function ProfilePage() {
  const { user, text, updateProfile, busy } = useApp();

  async function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await updateProfile({
      firstName: String(form.get("firstName") || "").trim(),
      lastName: String(form.get("lastName") || "").trim(),
      email: String(form.get("email") || "").trim(),
      phoneNumber: String(form.get("phoneNumber") || "").trim() || null
    });
  }

  return (
    <div>
      <PageHeader title={text.profile} description={text.userHelpText} />
      <form className="card grid max-w-3xl gap-4" onSubmit={submit}>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label={text.firstName}><input className="input" name="firstName" defaultValue={user.firstName} dir="auto" /></Field>
          <Field label={text.lastName}><input className="input" name="lastName" defaultValue={user.lastName} dir="auto" /></Field>
          <Field label={text.email}><input className="input" name="email" defaultValue={user.email} dir="auto" /></Field>
          <Field label={text.phone}><input className="input" name="phoneNumber" defaultValue={user.phoneNumber || ""} dir="auto" /></Field>
        </div>
        <button className="btn btn-primary w-fit" disabled={busy} type="submit"><Save size={16} />{text.save}</button>
      </form>
    </div>
  );
}
