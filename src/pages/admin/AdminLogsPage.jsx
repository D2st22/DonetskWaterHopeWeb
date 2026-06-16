import { DataTable, EmptyState, PageHeader, Td } from "../../components/ui.jsx";
import { useApp } from "../../context/AppContext.jsx";

export function AdminLogsPage() {
  const { data, text, formatDate } = useApp();
  const logs = [...(data.logs || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const keys = logs[0] ? Object.keys(logs[0]) : [];

  return (
    <div>
      <PageHeader title={text.logs} description={text.adminHelpText} />
      {logs.length ? (
        <DataTable headers={keys}>
          {logs.map((log, index) => (
            <tr key={log.systemLogId || log.id || index}>
              {keys.map((key) => (
                <Td key={key}>
                  {key.toLowerCase().includes("date") || key.toLowerCase().includes("created")
                    ? formatDate(log[key])
                    : String(log[key] ?? "")}
                </Td>
              ))}
            </tr>
          ))}
        </DataTable>
      ) : <EmptyState title={text.noData} />}
    </div>
  );
}
