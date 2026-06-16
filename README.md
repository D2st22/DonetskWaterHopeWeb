# DonetskWaterHope Web

React + Tailwind front-end для системи DonetskWaterHope / MakiivskyRodnichokForever.

## Реалізовано

- Авторизація через backend API `/api/auth/login` і JWT.
- Маршрутизація через `react-router-dom`.
- Окремий інтерфейс для звичайного користувача.
- Окремий інтерфейс адміністратора відповідно до ролі `Admin`.
- Перегляд пристроїв, показників, сповіщень і звернень.
- Адміністрування користувачів, пристроїв, тарифів, звернень, сповіщень і системних логів.
- Резервна JSON-копія доступних даних.
- Імпорт налаштувань і тарифів з JSON.
- Українська та англійська локалізація.
- Регіональне форматування дат, часу та гривні.
- Локалізоване сортування через `Intl.Collator`.
- Підтримка напрямів інтерфейсу та введення тексту: LTR, RTL, auto.

## Запуск

```bash
npm install
npm run dev
```

Якщо PowerShell блокує `npm`, запускайте так:

```powershell
npm.cmd run dev -- --host 127.0.0.1 --port 5173
```

Для production-збірки:

```bash
npm run build
```

За замовчуванням застосунок підключається до:

```text
https://donetskwaterhope.onrender.com
```

Адресу API можна змінити на екрані входу.

## Основні маршрути

- `/login` - вхід.
- `/register` - реєстрація.
- `/app/dashboard` - панель користувача.
- `/app/devices` - лічильники користувача.
- `/app/readings` - історія показників.
- `/app/alerts` - сповіщення.
- `/app/tickets` - звернення до підтримки.
- `/app/profile` - профіль користувача.
- `/admin/dashboard` - панель адміністратора.
- `/admin/users` - користувачі.
- `/admin/devices` - лічильники.
- `/admin/tariffs` - тарифи.
- `/admin/tickets` - звернення.
- `/admin/alerts` - сповіщення.
- `/admin/backups` - резервні копії та імпорт.
- `/admin/logs` - системний журнал.
