import { Plus } from "lucide-react";
import { DataTable, EmptyState, Field, PageHeader, Pill, Td } from "../../components/ui.jsx";
import { useApp } from "../../context/AppContext.jsx";

export function TicketsPage() {
  const { data, text, formatDate, createTicket, busy } = useApp();
  const tickets = [...(data.tickets || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const devices = data.devices || [];

  async function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const deviceId = form.get("deviceId");
    try {
      await createTicket({
        subject: String(form.get("subject") || "").trim(),
        messageText: String(form.get("messageText") || "").trim(),
        deviceId: deviceId ? Number(deviceId) : null
      });
      event.currentTarget.reset();
    } catch {
      // Context shows error.
    }
  }

  return (
    <div>
      <PageHeader title={text.tickets} description={text.userHelpText} />
      <div className="grid gap-5 xl:grid-cols-[380px_minmax(0,1fr)]">
        <form className="card grid gap-3" onSubmit={submit}>
          <h2 className="text-lg font-bold">{text.newTicket}</h2>
          <Field label={text.subject}><input className="input" name="subject" dir="auto" required /></Field>
          <Field label={text.message}><textarea className="textarea" name="messageText" dir="auto" required /></Field>
          <Field label={text.devices}>
            <select className="input" name="deviceId">
              <option value="">{text.noDevice}</option>
              {devices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>{device.name} ({device.serialNumber})</option>
              ))}
            </select>
          </Field>
          <button className="btn btn-primary" disabled={busy} type="submit"><Plus size={16} />{text.create}</button>
        </form>

        {tickets.length ? (
          <DataTable headers={[text.subject, text.status, text.serial, text.adminComment, text.date]}>
            {tickets.map((ticket) => (
              <tr key={ticket.ticketId}>
                <Td><strong>{ticket.subject}</strong><p className="text-xs text-slate-500">{ticket.messageText}</p></Td>
                <Td><Pill value={ticket.status} /></Td>
                <Td>{ticket.deviceSerialNumber || ""}</Td>
                <Td>{ticket.adminComment || ""}</Td>
                <Td>{formatDate(ticket.createdAt)}</Td>
              </tr>
            ))}
          </DataTable>
        ) : <EmptyState title={text.noData} />}
      </div>
    </div>
  );
}
