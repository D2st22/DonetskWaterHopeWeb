import { Plus, Save } from "lucide-react";
import { DeviceStatusSelect, DeviceTypeSelect, TariffSelect, UserSelect } from "../../components/selects.jsx";
import { DataTable, EmptyState, Field, PageHeader, Pill, Td } from "../../components/ui.jsx";
import { useApp } from "../../context/AppContext.jsx";
import { sortByText } from "../../utils/format.js";

export function AdminDevicesPage() {
  const { data, selected, setSelected, text, collator, formatMoney, createDevice, updateDevice, busy } = useApp();
  const devices = sortByText(data.adminDevices || [], "name", collator);
  const users = sortByText((data.users || []).filter((item) => item.role !== "Admin"), "lastName", collator);
  const tariffs = sortByText(data.tariffs || [], "name", collator);
  const picked = devices.find((item) => String(item.deviceId) === String(selected.deviceId)) || devices[0];
  const pickedTariff = tariffs.find((item) => item.name === picked?.tariffName);

  async function create(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await createDevice({
        serialNumber: String(form.get("serialNumber") || "").trim(),
        name: String(form.get("name") || "").trim(),
        type: String(form.get("type") || "ColdWater"),
        tariffId: Number(form.get("tariffId")),
        userId: Number(form.get("userId")),
        comment: String(form.get("comment") || "").trim() || null
      });
      event.currentTarget.reset();
    } catch {}
  }

  async function update(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await updateDevice(event.currentTarget.dataset.deviceId, {
      serialNumber: String(form.get("serialNumber") || "").trim(),
      name: String(form.get("name") || "").trim(),
      type: String(form.get("type") || "ColdWater"),
      status: String(form.get("status") || "Active"),
      tariffId: Number(form.get("tariffId")),
      comment: String(form.get("comment") || "").trim() || null
    });
  }

  return (
    <div>
      <PageHeader title={text.devices} description={text.adminHelpText} />
      <div className="grid gap-5 xl:grid-cols-[380px_minmax(0,1fr)]">
        <div className="grid gap-5">
          <form className="card grid gap-3" onSubmit={create}>
            <h2 className="text-lg font-bold">{text.create}</h2>
            <Field label={text.serial}><input className="input" name="serialNumber" dir="auto" required /></Field>
            <Field label={text.name}><input className="input" name="name" dir="auto" required /></Field>
            <Field label={text.type}><DeviceTypeSelect /></Field>
            <Field label={text.owner}><UserSelect users={users} text={text} /></Field>
            <Field label={text.tariff}><TariffSelect tariffs={tariffs} text={text} formatMoney={formatMoney} /></Field>
            <Field label={text.comment}><textarea className="textarea" name="comment" dir="auto" /></Field>
            <button className="btn btn-primary" disabled={busy} type="submit"><Plus size={16} />{text.create}</button>
          </form>

          {picked && (
            <form className="card grid gap-3" data-device-id={picked.deviceId} onSubmit={update}>
              <h2 className="text-lg font-bold">{picked.serialNumber}</h2>
              <Field label={text.serial}><input className="input" name="serialNumber" defaultValue={picked.serialNumber} dir="auto" /></Field>
              <Field label={text.name}><input className="input" name="name" defaultValue={picked.name} dir="auto" /></Field>
              <Field label={text.type}><DeviceTypeSelect value={picked.type} /></Field>
              <Field label={text.status}><DeviceStatusSelect value={picked.status} /></Field>
              <Field label={text.tariff}><TariffSelect tariffs={tariffs} value={pickedTariff?.tariffId || ""} text={text} formatMoney={formatMoney} /></Field>
              <Field label={text.comment}><textarea className="textarea" name="comment" defaultValue={picked.comment || ""} dir="auto" /></Field>
              <button className="btn btn-primary" disabled={busy} type="submit"><Save size={16} />{text.save}</button>
            </form>
          )}
        </div>

        {devices.length ? (
          <DataTable headers={[text.name, text.serial, text.type, text.status, text.owner, text.tariff, ""]}>
            {devices.map((device) => (
              <tr key={device.deviceId}>
                <Td>{device.name}</Td>
                <Td>{device.serialNumber}</Td>
                <Td>{device.type}</Td>
                <Td><Pill value={device.status} /></Td>
                <Td>{device.accountNumber}</Td>
                <Td>{device.tariffName}</Td>
                <Td><button className="btn btn-soft" type="button" onClick={() => setSelected((old) => ({ ...old, deviceId: device.deviceId }))}>{text.choose}</button></Td>
              </tr>
            ))}
          </DataTable>
        ) : <EmptyState title={text.noData} />}
      </div>
    </div>
  );
}
