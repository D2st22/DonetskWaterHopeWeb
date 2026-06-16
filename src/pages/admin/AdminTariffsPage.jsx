import { Plus, Trash2 } from "lucide-react";
import { DataTable, EmptyState, Field, PageHeader, Td } from "../../components/ui.jsx";
import { useApp } from "../../context/AppContext.jsx";
import { sortByText } from "../../utils/format.js";

export function AdminTariffsPage() {
  const { data, text, collator, formatMoney, createTariff, deleteRecord, busy } = useApp();
  const tariffs = sortByText(data.tariffs || [], "name", collator);

  async function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await createTariff({
        name: String(form.get("name") || "").trim(),
        pricePerUnit: Number(form.get("pricePerUnit"))
      });
      event.currentTarget.reset();
    } catch {}
  }

  return (
    <div>
      <PageHeader title={text.tariffs} description={text.adminHelpText} />
      <div className="grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
        <form className="card grid gap-3" onSubmit={submit}>
          <h2 className="text-lg font-bold">{text.create}</h2>
          <Field label={text.name}><input className="input" name="name" dir="auto" required /></Field>
          <Field label={text.price}><input className="input" name="pricePerUnit" type="number" min="0.01" step="0.01" required /></Field>
          <button className="btn btn-primary" disabled={busy} type="submit"><Plus size={16} />{text.create}</button>
        </form>

        {tariffs.length ? (
          <DataTable headers={[text.name, text.price, ""]}>
            {tariffs.map((tariff) => (
              <tr key={tariff.tariffId}>
                <Td>{tariff.name}</Td>
                <Td>{formatMoney(tariff.pricePerUnit)}</Td>
                <Td><button className="btn btn-danger" type="button" onClick={() => deleteRecord(`/api/tariffs/${tariff.tariffId}`)}><Trash2 size={16} />{text.delete}</button></Td>
              </tr>
            ))}
          </DataTable>
        ) : <EmptyState title={text.noData} />}
      </div>
    </div>
  );
}
