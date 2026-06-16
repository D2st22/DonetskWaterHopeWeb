import { Trash2 } from "lucide-react";
import { DataTable, EmptyState, PageHeader, Pill, Td } from "../../components/ui.jsx";
import { useApp } from "../../context/AppContext.jsx";

export function AdminAlertsPage() {
  const { data, text, formatDate, deleteRecord } = useApp();
  const alerts = [...(data.adminAlerts || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div>
      <PageHeader title={text.alerts} description={text.adminHelpText} />
      {alerts.length ? (
        <DataTable headers={[text.type, text.owner, text.serial, text.message, text.date, ""]}>
          {alerts.map((alert) => (
            <tr key={alert.alertId}>
              <Td><Pill value={alert.type} /></Td>
              <Td>{alert.userAccountNumber}</Td>
              <Td>{alert.deviceSerialNumber}</Td>
              <Td>{alert.messageText}</Td>
              <Td>{formatDate(alert.createdAt)}</Td>
              <Td><button className="btn btn-danger" type="button" onClick={() => deleteRecord(`/api/alerts/${alert.alertId}`)}><Trash2 size={16} />{text.delete}</button></Td>
            </tr>
          ))}
        </DataTable>
      ) : <EmptyState title={text.noData} />}
    </div>
  );
}
