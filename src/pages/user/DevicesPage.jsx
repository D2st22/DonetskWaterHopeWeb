import { DataTable, EmptyState, PageHeader, Pill, Td } from "../../components/ui.jsx";
import { useApp } from "../../context/AppContext.jsx";
import { sortByText } from "../../utils/format.js";

export function DevicesPage() {
  const { data, text, formatMoney, collator } = useApp();
  const devices = sortByText(data.devices || [], "name", collator);

  return (
    <div>
      <PageHeader title={text.devices} description={text.userHelpText} />
      {devices.length ? (
        <DataTable headers={[text.name, text.serial, text.type, text.status, text.tariff, text.price]}>
          {devices.map((device) => (
            <tr key={device.deviceId}>
              <Td><strong>{device.name}</strong>{device.comment && <p className="text-xs text-slate-500">{device.comment}</p>}</Td>
              <Td>{device.serialNumber}</Td>
              <Td>{device.type}</Td>
              <Td><Pill value={device.status} /></Td>
              <Td>{device.tariffName}</Td>
              <Td>{formatMoney(device.tariffPrice)}</Td>
            </tr>
          ))}
        </DataTable>
      ) : <EmptyState title={text.noData} />}
    </div>
  );
}
