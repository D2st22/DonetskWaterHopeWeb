import { DataTable, EmptyState, MetricCard, PageHeader, Td } from "../../components/ui.jsx";
import { useApp } from "../../context/AppContext.jsx";

export function ReadingsPage() {
  const { data, text, formatDate, formatMoney } = useApp();
  const records = [...(data.consumption || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const totalDelta = records.reduce((sum, item) => sum + Number(item.delta || 0), 0);
  const totalPay = records.reduce((sum, item) => sum + Number(item.mustToPay || 0), 0);

  return (
    <div>
      <PageHeader title={text.readings} description={text.userHelpText} />
      <div className="mb-5 grid gap-4 md:grid-cols-2">
        <MetricCard label={text.totalDelta} value={totalDelta} />
        <MetricCard label={text.totalToPay} value={formatMoney(totalPay)} />
      </div>
      {records.length ? (
        <DataTable headers={[text.serial, text.value, text.delta, text.amount, text.tariff, text.date]}>
          {records.map((record) => (
            <tr key={record.recordId}>
              <Td>{record.deviceSerialNumber}</Td>
              <Td>{record.value}</Td>
              <Td>{record.delta}</Td>
              <Td>{formatMoney(record.mustToPay)}</Td>
              <Td>{record.tariffName}</Td>
              <Td>{formatDate(record.createdAt)}</Td>
            </tr>
          ))}
        </DataTable>
      ) : <EmptyState title={text.noData} />}
    </div>
  );
}
