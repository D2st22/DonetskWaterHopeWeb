import { Plus, Save, Trash2 } from "lucide-react";
import { RoleSelect } from "../../components/selects.jsx";
import { DataTable, EmptyState, Field, PageHeader, Pill, Td } from "../../components/ui.jsx";
import { useApp } from "../../context/AppContext.jsx";
import { fullName, sortByText } from "../../utils/format.js";

export function AdminUsersPage() {
  const { data, selected, setSelected, text, collator, createUser, updateUser, deleteRecord, busy } = useApp();
  const users = sortByText(data.users || [], "lastName", collator);
  const picked = users.find((item) => String(item.userId) === String(selected.userId)) || users[0];

  async function create(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await createUser({
        firstName: String(form.get("firstName") || "").trim(),
        lastName: String(form.get("lastName") || "").trim(),
        email: String(form.get("email") || "").trim(),
        phoneNumber: String(form.get("phoneNumber") || "").trim() || null,
        password: String(form.get("password") || ""),
        role: String(form.get("role") || "User")
      });
      event.currentTarget.reset();
    } catch {}
  }

  async function update(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await updateUser(event.currentTarget.dataset.userId, {
      firstName: String(form.get("firstName") || "").trim(),
      lastName: String(form.get("lastName") || "").trim(),
      email: String(form.get("email") || "").trim(),
      phoneNumber: String(form.get("phoneNumber") || "").trim() || null,
      role: String(form.get("role") || "User")
    });
  }

  return (
    <div>
      <PageHeader title={text.users} description={text.adminHelpText} />
      <div className="grid gap-5 xl:grid-cols-[380px_minmax(0,1fr)]">
        <div className="grid gap-5">
          <form className="card grid gap-3" onSubmit={create}>
            <h2 className="text-lg font-bold">{text.create}</h2>
            <Field label={text.firstName}><input className="input" name="firstName" dir="auto" required /></Field>
            <Field label={text.lastName}><input className="input" name="lastName" dir="auto" required /></Field>
            <Field label={text.email}><input className="input" name="email" type="email" dir="auto" required /></Field>
            <Field label={text.phone}><input className="input" name="phoneNumber" dir="auto" /></Field>
            <Field label={text.password}><input className="input" name="password" type="password" minLength={6} required /></Field>
            <Field label={text.role}><RoleSelect /></Field>
            <button className="btn btn-primary" disabled={busy} type="submit"><Plus size={16} />{text.create}</button>
          </form>

          {picked && (
            <form className="card grid gap-3" data-user-id={picked.userId} onSubmit={update}>
              <h2 className="text-lg font-bold">{picked.accountNumber}</h2>
              <Field label={text.firstName}><input className="input" name="firstName" defaultValue={picked.firstName} dir="auto" /></Field>
              <Field label={text.lastName}><input className="input" name="lastName" defaultValue={picked.lastName} dir="auto" /></Field>
              <Field label={text.email}><input className="input" name="email" defaultValue={picked.email} dir="auto" /></Field>
              <Field label={text.phone}><input className="input" name="phoneNumber" defaultValue={picked.phoneNumber || ""} dir="auto" /></Field>
              <Field label={text.role}><RoleSelect value={picked.role} /></Field>
              <div className="flex flex-wrap gap-2">
                <button className="btn btn-primary" disabled={busy} type="submit"><Save size={16} />{text.save}</button>
                <button className="btn btn-danger" type="button" onClick={() => deleteRecord(`/api/users/${picked.userId}`)}><Trash2 size={16} />{text.delete}</button>
              </div>
            </form>
          )}
        </div>

        {users.length ? (
          <DataTable headers={[text.accountNumber, text.name, text.email, text.phone, text.role, ""]}>
            {users.map((user) => (
              <tr key={user.userId}>
                <Td>{user.accountNumber}</Td>
                <Td>{fullName(user)}</Td>
                <Td>{user.email}</Td>
                <Td>{user.phoneNumber || ""}</Td>
                <Td><Pill value={user.role} /></Td>
                <Td><button className="btn btn-soft" type="button" onClick={() => setSelected((old) => ({ ...old, userId: user.userId }))}>{text.choose}</button></Td>
              </tr>
            ))}
          </DataTable>
        ) : <EmptyState title={text.noData} />}
      </div>
    </div>
  );
}
