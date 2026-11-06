# MyWorkspace — Next.js Multi-User CRUD

A learning project with Next.js App Router, TypeScript, Tailwind CSS, SQLite, bcrypt password hashing, and signed cookie sessions.

## Features

- Register, login, and logout
- Passwords stored as bcrypt hashes
- HTTP-only signed session cookie
- Create, read, update, and delete personal tasks
- Every task query is scoped to the authenticated user's ID
- Responsive Tailwind dashboard, login, register, and edit pages
- SQLite database is created automatically in `data/database.sqlite`

## Requirements

- Node.js 20.9 or newer (Node.js LTS recommended)
- npm
- Windows, macOS, or Linux

## Setup on Windows (PowerShell)

1. Extract the ZIP file.
2. Open the extracted folder in VS Code.
3. Open Terminal > New Terminal.
4. Install dependencies:

   ```bash
   npm install
   ```

5. Create `.env.local` by copying `.env.example`:

   ```powershell
   Copy-Item .env.example .env.local
   ```

6. Generate a secret:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

7. Copy the generated value into `.env.local` after `SESSION_SECRET=`. Do not share this value.
8. Start the development server:

   ```bash
   npm run dev
   ```

9. Open http://localhost:3000. The home page redirects to `/login`.

## Useful URLs

- `/` — redirects to login
- `/register` — create an account
- `/login` — sign in
- `/dashboard` — private dashboard
- `/dashboard/edit/1` — edit a task (the ID must belong to the signed-in user)

## Database

SQLite is created automatically on first server access:

```text
data/database.sqlite
```

Tables:

- `users`: account details and bcrypt password hash
- `tasks`: task records with a `user_id` foreign key

Do not commit `.env.local` or the SQLite database to a public repository.

## Multi-user data isolation

All task reads, updates, and deletes include the authenticated `user_id` in the SQL condition. The edit page also selects by both task ID and user ID. Do not remove these conditions.

## Notes and troubleshooting

### `better-sqlite3` installation fails on Windows

Use a current Node.js LTS release and try:

```bash
npm install
```

If npm reports that it must compile a native module, install the Visual Studio Build Tools with the **Desktop development with C++** workload, then reopen the terminal and run `npm install` again. Also ensure Python is available if node-gyp requests it.

### `SESSION_SECRET` error

Make sure `.env.local` exists in the project root and `SESSION_SECRET` contains a random value. Restart `npm run dev` after changing environment variables.

### Port 3000 is already in use

Stop the other Next.js process, or run:

```bash
npm run dev -- -p 3001
```

Then open http://localhost:3001.

## Security scope

This is a learning starter, not a production-ready deployment. Before public deployment, add rate limiting, robust server-side validation, CSRF/origin protections appropriate to the deployment, security logging, backups, and a production session-management strategy. Use persistent storage for SQLite and do not deploy the database on an ephemeral filesystem.
