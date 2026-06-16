export function RoleSelect({ name = "role", value = "User" }) {
  return (
    <select className="input" name={name} defaultValue={value}>
      <option value="User">User</option>
      <option value="Admin">Admin</option>
    </select>
  );
}

export function DeviceTypeSelect({ name = "type", value = "ColdWater" }) {
  return (
    <select className="input" name={name} defaultValue={value}>
      <option value="ColdWater">ColdWater</option>
      <option value="HotWater">HotWater</option>
    </select>
  );
}

export function DeviceStatusSelect({ name = "status", value = "Active" }) {
  return (
    <select className="input" name={name} defaultValue={value}>
      {["Active", "Inactive", "Maintenance", "Blocked"].map((status) => (
        <option key={status} value={status}>{status}</option>
      ))}
    </select>
  );
}

export function TicketStatusSelect({ name = "status", value = "Open" }) {
  return (
    <select className="input" name={name} defaultValue={value}>
      {["Open", "InProgress", "Resolved", "Closed"].map((status) => (
        <option key={status} value={status}>{status}</option>
      ))}
    </select>
  );
}

export function UserSelect({ users, name = "userId", text }) {
  return (
    <select className="input" name={name} required>
      <option value="">{text.choose}</option>
      {users.map((user) => (
        <option key={user.userId} value={user.userId}>
          {user.accountNumber} · {`${user.firstName} ${user.lastName}`.trim()}
        </option>
      ))}
    </select>
  );
}

export function TariffSelect({ tariffs, name = "tariffId", value = "", text, formatMoney }) {
  return (
    <select className="input" name={name} defaultValue={value} required>
      <option value="">{text.choose}</option>
      {tariffs.map((tariff) => (
        <option key={tariff.tariffId} value={tariff.tariffId}>
          {tariff.name} · {formatMoney(tariff.pricePerUnit)}
        </option>
      ))}
    </select>
  );
}
