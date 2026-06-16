import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest, API_DEFAULT } from "../services/api.js";
import { localeByLang, translations } from "../i18n/translations.js";
import { downloadJson, formatDate, formatMoney, importSummary } from "../utils/format.js";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [baseUrl, setBaseUrl] = useLocalStorage("dwh.baseUrl", API_DEFAULT);
  const [lang, setLang] = useLocalStorage("dwh.lang", "uk");
  const [dir, setDir] = useLocalStorage("dwh.dir", "ltr");
  const [token, setToken] = useLocalStorage("dwh.token", "");
  const [user, setUser] = useJsonStorage("dwh.user", null);
  const [data, setData] = useState({});
  const [selected, setSelected] = useState({});
  const [imported, setImported] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const text = translations[lang] || translations.uk;
  const locale = localeByLang[lang] || "uk-UA";
  const collator = useMemo(() => new Intl.Collator(locale, { sensitivity: "base", numeric: true }), [locale]);
  const isAdmin = user?.role === "Admin";

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir === "auto" ? "ltr" : dir;
  }, [locale, dir]);

  useEffect(() => {
    if (!token || !user) return;
    refreshData({ authToken: token, authUser: user, apiBaseUrl: baseUrl }).catch((error) => setMessage(`!${error.message}`));
  }, [token, user?.userId, user?.role, baseUrl]);

  function request(path, options = {}) {
    return apiRequest({
      baseUrl,
      token,
      path,
      fallbackError: text.networkError,
      ...options
    });
  }

  async function optionalApiRequest({ baseUrl, token, path }) {
    try {
      return await apiRequest({ baseUrl, token, path, fallbackError: text.networkError });
    } catch {
      return [];
    }
  }

  async function run(task, successMessage = "") {
    try {
      setBusy(true);
      setMessage("");
      const result = await task();
      if (successMessage) setMessage(successMessage);
      return result;
    } catch (error) {
      setMessage(`!${error.message || text.apiError}`);
      throw error;
    } finally {
      setBusy(false);
    }
  }

  async function login({ nextBaseUrl, accountNumber, password }) {
    return run(async () => {
      const cleanedBaseUrl = nextBaseUrl.trim().replace(/\/$/, "");
      const response = await apiRequest({
        baseUrl: cleanedBaseUrl,
        token: "",
        path: "/api/auth/login",
        method: "POST",
        body: { accountNumber, password },
        fallbackError: text.networkError
      });
      const initialData = response.user.role === "Admin"
        ? await loadAdminData({ authToken: response.token, apiBaseUrl: cleanedBaseUrl })
        : await loadUserData({ authToken: response.token, apiBaseUrl: cleanedBaseUrl });
      setBaseUrl(cleanedBaseUrl);
      setToken(response.token);
      setUser(response.user);
      setData((current) => ({ ...current, ...initialData }));
      setMessage(text.signedIn);
      return response.user;
    });
  }

  async function register(payload) {
    return run(async () => {
      await apiRequest({
        baseUrl,
        token: "",
        path: "/api/auth/register",
        method: "POST",
        body: payload,
        fallbackError: text.networkError
      });
    }, text.created);
  }

  function logout() {
    setToken("");
    setUser(null);
    setData({});
    setSelected({});
    setMessage("");
  }

  async function refreshData({ authToken = token, authUser = user, apiBaseUrl = baseUrl } = {}) {
    if (!authToken || !authUser) return;
    if (authUser.role === "Admin") await loadAdminData({ authToken, apiBaseUrl });
    else await loadUserData({ authToken, apiBaseUrl });
  }

  async function loadUserData({ authToken = token, apiBaseUrl = baseUrl } = {}) {
    const [devices, consumption, alerts, tickets, iotStatuses] = await Promise.all([
      apiRequest({ baseUrl: apiBaseUrl, token: authToken, path: "/api/devices/my", fallbackError: text.networkError }),
      apiRequest({ baseUrl: apiBaseUrl, token: authToken, path: "/api/consumption/my", fallbackError: text.networkError }),
      apiRequest({ baseUrl: apiBaseUrl, token: authToken, path: "/api/alerts/my", fallbackError: text.networkError }),
      apiRequest({ baseUrl: apiBaseUrl, token: authToken, path: "/api/tickets/my", fallbackError: text.networkError }),
      optionalApiRequest({ baseUrl: apiBaseUrl, token: authToken, path: "/api/iot/my" })
    ]);
    setData((current) => ({ ...current, devices, consumption, alerts, tickets, iotStatuses }));
    return { devices, consumption, alerts, tickets, iotStatuses };
  }

  async function loadAdminData({ authToken = token, apiBaseUrl = baseUrl } = {}) {
    const [users, adminDevices, tariffs, adminTickets, adminAlerts, logs, iotStatuses] = await Promise.all([
      apiRequest({ baseUrl: apiBaseUrl, token: authToken, path: "/api/users", fallbackError: text.networkError }),
      apiRequest({ baseUrl: apiBaseUrl, token: authToken, path: "/api/devices/", fallbackError: text.networkError }),
      apiRequest({ baseUrl: apiBaseUrl, token: authToken, path: "/api/tariffs/", fallbackError: text.networkError }),
      apiRequest({ baseUrl: apiBaseUrl, token: authToken, path: "/api/tickets/all", fallbackError: text.networkError }),
      apiRequest({ baseUrl: apiBaseUrl, token: authToken, path: "/api/alerts/all", fallbackError: text.networkError }),
      apiRequest({ baseUrl: apiBaseUrl, token: authToken, path: "/api/admin/logs/", fallbackError: text.networkError }),
      optionalApiRequest({ baseUrl: apiBaseUrl, token: authToken, path: "/api/iot/all" })
    ]);
    setData((current) => ({ ...current, users, adminDevices, tariffs, adminTickets, adminAlerts, logs, iotStatuses }));
    return { users, adminDevices, tariffs, adminTickets, adminAlerts, logs, iotStatuses };
  }

  async function createTicket(payload) {
    return run(async () => {
      await request("/api/tickets/", { method: "POST", body: payload });
      await loadUserData();
    }, text.created);
  }

  async function updateProfile(payload) {
    return run(async () => {
      const updated = await request(`/api/users/${user.userId}`, { method: "PATCH", body: payload });
      setUser(updated);
    }, text.saved);
  }

  async function createUser(payload) {
    return run(async () => {
      const created = await request("/api/auth/register", { method: "POST", body: payload });
      if (payload.role && payload.role !== "User") {
        await request(`/api/users/${created.userId}`, { method: "PATCH", body: { role: payload.role } });
      }
      await loadAdminData();
    }, text.created);
  }

  async function updateUser(userId, payload) {
    return run(async () => {
      await request(`/api/users/${userId}`, { method: "PATCH", body: payload });
      await loadAdminData();
    }, text.saved);
  }

  async function createDevice(payload) {
    return run(async () => {
      await request("/api/devices/", { method: "POST", body: payload });
      await loadAdminData();
    }, text.created);
  }

  async function updateDevice(deviceId, payload) {
    return run(async () => {
      await request(`/api/devices/${deviceId}`, { method: "PATCH", body: payload });
      await loadAdminData();
    }, text.saved);
  }

  async function createTariff(payload) {
    return run(async () => {
      await request("/api/tariffs/", { method: "POST", body: payload });
      await loadAdminData();
    }, text.created);
  }

  async function updateTicket(ticketId, payload) {
    return run(async () => {
      await request(`/api/tickets/${ticketId}`, { method: "PATCH", body: payload });
      await loadAdminData();
    }, text.saved);
  }

  async function deleteRecord(path) {
    return run(async () => {
      await request(path, { method: "DELETE" });
      await refreshData();
    }, text.deleted);
  }

  async function createBackup() {
    return run(async () => {
      const freshData = isAdmin ? await fetchAdminBackupData() : await fetchUserBackupData();
      downloadJson(`donetsk-water-hope-backup-${new Date().toISOString().slice(0, 10)}.json`, {
        version: 1,
        exportedAt: new Date().toISOString(),
        role: user.role,
        appSettings: { baseUrl, lang, locale, dir },
        data: freshData
      });
    }, text.backupCreated);
  }

  async function fetchUserBackupData() {
    const [devices, consumption, alerts, tickets] = await Promise.all([
      request("/api/devices/my"),
      request("/api/consumption/my"),
      request("/api/alerts/my"),
      request("/api/tickets/my")
    ]);
    return { devices, consumption, alerts, tickets };
  }

  async function fetchAdminBackupData() {
    const [users, devices, tariffs, tickets, alerts, logs] = await Promise.all([
      request("/api/users"),
      request("/api/devices/"),
      request("/api/tariffs/"),
      request("/api/tickets/all"),
      request("/api/alerts/all"),
      request("/api/admin/logs/")
    ]);
    return { users, devices, tariffs, tickets, alerts, logs };
  }

  function restoreSettings() {
    const settings = imported?.appSettings;
    if (!settings) {
      setMessage(`!${text.noData}`);
      return;
    }
    setBaseUrl(settings.baseUrl || baseUrl);
    setLang(settings.lang || lang);
    setDir(settings.dir || dir);
    setMessage(text.settingsRestored);
  }

  async function importTariffs() {
    const tariffs = imported?.data?.tariffs || imported?.tariffs || [];
    if (!Array.isArray(tariffs) || tariffs.length === 0) {
      setMessage(`!${text.noData}`);
      return;
    }
    return run(async () => {
      const existing = await request("/api/tariffs/");
      const existingNames = new Set(existing.map((item) => String(item.name).toLowerCase()));
      for (const tariff of tariffs) {
        if (!existingNames.has(String(tariff.name).toLowerCase())) {
          await request("/api/tariffs/", {
            method: "POST",
            body: {
              name: tariff.name,
              pricePerUnit: Number(tariff.pricePerUnit || tariff.price || 0)
            }
          });
        }
      }
      await loadAdminData();
    }, text.tariffsImported);
  }

  const value = {
    baseUrl,
    setBaseUrl,
    lang,
    setLang,
    dir,
    setDir,
    locale,
    collator,
    text,
    token,
    user,
    isAdmin,
    data,
    selected,
    setSelected,
    imported,
    setImported,
    busy,
    message,
    setMessage,
    formatDate: (value) => formatDate(value, locale),
    formatMoney: (value) => formatMoney(value, locale),
    importSummary,
    login,
    register,
    logout,
    refreshData,
    createTicket,
    updateProfile,
    createUser,
    updateUser,
    createDevice,
    updateDevice,
    createTariff,
    updateTicket,
    deleteRecord,
    createBackup,
    restoreSettings,
    importTariffs
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside AppProvider");
  return context;
}

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => localStorage.getItem(key) || initialValue);
  useEffect(() => {
    localStorage.setItem(key, value);
  }, [key, value]);
  return [value, setValue];
}

function useJsonStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(key)) || initialValue;
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    if (value === null || value === undefined) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}
