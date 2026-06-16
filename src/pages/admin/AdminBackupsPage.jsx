import { Download, Upload } from "lucide-react";
import { EmptyState, PageHeader } from "../../components/ui.jsx";
import { useApp } from "../../context/AppContext.jsx";

export function AdminBackupsPage() {
  const { text, imported, setImported, importSummary, createBackup, restoreSettings, importTariffs, busy } = useApp();

  async function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setImported(JSON.parse(await file.text()));
    } catch {
      setImported(null);
    }
  }

  return (
    <div>
      <PageHeader title={text.backups} description={text.backupNote} />
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="card">
          <h2 className="mb-2 text-lg font-bold">{text.backup}</h2>
          <p className="mb-4 text-sm text-slate-500">{text.backupNote}</p>
          <button className="btn btn-primary" disabled={busy} type="button" onClick={createBackup}>
            <Download size={16} />
            {text.createBackup}
          </button>
        </section>
        <section className="card">
          <h2 className="mb-2 text-lg font-bold">{text.import}</h2>
          <input className="input mb-4" type="file" accept=".json,application/json" onChange={handleFile} />
          <div className="flex flex-wrap gap-2">
            <button className="btn btn-soft" disabled={!imported} type="button" onClick={restoreSettings}><Upload size={16} />{text.restoreSettings}</button>
            <button className="btn btn-success" disabled={!imported || busy} type="button" onClick={importTariffs}><Upload size={16} />{text.importTariffs}</button>
          </div>
        </section>
      </div>
      <section className="card mt-5">
        <h2 className="mb-3 text-lg font-bold">{text.importPreview}</h2>
        {imported ? (
          <pre className="overflow-auto rounded-lg bg-slate-950 p-4 text-xs text-slate-50">{JSON.stringify(importSummary(imported), null, 2)}</pre>
        ) : <EmptyState title={text.noData} />}
      </section>
    </div>
  );
}
