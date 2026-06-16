import { DataTable, EmptyState, PageHeader, Pill, Td } from "../../components/ui.jsx";
import { useApp } from "../../context/AppContext.jsx";

export function AlertsPage() {
  const { data, text, formatDate } = useApp();
  const alerts = [...(data.alerts || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div>
      <PageHeader title={text.alerts} description={text.userHelpText} />
      {alerts.length ? (
        <DataTable headers={[text.type, text.serial, text.message, text.date]}>
          {alerts.map((alert) => (
            <tr key={alert.alertId}>
              <Td><Pill value={alert.type} /></Td>
              <Td>{alert.deviceSerialNumber}</Td>
              <Td>{alert.messageText}</Td>
              <Td>{formatDate(alert.createdAt)}</Td>
            </tr>
          ))}
        </DataTable>
      ) : <EmptyState title={text.noData} />}
    </div>
  );
}
