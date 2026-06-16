import { Save, Trash2 } from "lucide-react";
import { TicketStatusSelect } from "../../components/selects.jsx";
import { DataTable, EmptyState, Field, PageHeader, Pill, Td } from "../../components/ui.jsx";
import { useApp } from "../../context/AppContext.jsx";

export function AdminTicketsPage() {
  const { data, selected, setSelected, text, formatDate, updateTicket, deleteRecord, busy } = useApp();
  const tickets = [...(data.adminTickets || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const picked = tickets.find((item) => String(item.ticketId) === String(selected.ticketId)) || tickets[0];

  async function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await updateTicket(event.currentTarget.dataset.ticketId, {
      status: String(form.get("status") || "Open"),
      comment: String(form.get("comment") || "").trim() || null
    });
  }

  return (
    <div>
      <PageHeader title={text.tickets} description={text.adminHelpText} />
      <div className="grid gap-5 xl:grid-cols-[380px_minmax(0,1fr)]">
        <section className="card">
          {picked ? (
            <form className="grid gap-3" data-ticket-id={picked.ticketId} onSubmit={submit}>
              <h2 className="text-lg font-bold">{picked.subject}</h2>
              <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">{picked.messageText}</p>
              <Field label={text.status}><TicketStatusSelect value={picked.status} /></Field>
              <Field label={text.adminComment}><textarea className="textarea" name="comment" defaultValue={picked.adminComment || ""} dir="auto" /></Field>
              <div className="flex flex-wrap gap-2">
                <button className="btn btn-primary" disabled={busy} type="submit"><Save size={16} />{text.save}</button>
                <button className="btn btn-danger" type="button" onClick={() => deleteRecord(`/api/tickets/${picked.ticketId}`)}><Trash2 size={16} />{text.delete}</button>
              </div>
            </form>
          ) : <EmptyState title={text.noData} />}
        </section>

        {tickets.length ? (
          <DataTable headers={[text.subject, text.status, text.owner, text.serial, text.date, ""]}>
            {tickets.map((ticket) => (
              <tr key={ticket.ticketId}>
                <Td><strong>{ticket.subject}</strong><p className="text-xs text-slate-500">{ticket.messageText}</p></Td>
                <Td><Pill value={ticket.status} /></Td>
                <Td>{ticket.userAccountNumber}</Td>
                <Td>{ticket.deviceSerialNumber || ""}</Td>
                <Td>{formatDate(ticket.createdAt)}</Td>
                <Td><button className="btn btn-soft" type="button" onClick={() => setSelected((old) => ({ ...old, ticketId: ticket.ticketId }))}>{text.choose}</button></Td>
              </tr>
            ))}
          </DataTable>
        ) : <EmptyState title={text.noData} />}
      </div>
    </div>
  );
}
