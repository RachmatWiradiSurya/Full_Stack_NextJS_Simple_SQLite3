import db from "@/app/lib/db";
import { getSession } from "@/app/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createTask, deleteTask } from "@/app/actions/tasks";
import { logout } from "@/app/actions/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type User = { id: number; name: string; email: string };
type Task = {
  id: number;
  title: string;
  description: string | null;
  created_at: string;
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const session = await getSession();
  if (!session?.userId) redirect("/login");

  const userId = session.userId;

  const user = db.prepare(`
    SELECT id, name, email FROM users WHERE id = ?
  `).get(userId) as User | undefined;

  if (!user) redirect("/login");

  const tasks = db.prepare(`
    SELECT id, title, description, created_at
    FROM tasks
    WHERE user_id = ?
    ORDER BY id DESC
  `).all(userId) as Task[];

  const messages = await searchParams;

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <aside className="flex w-full flex-col border-b border-slate-200 bg-white p-5 lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r lg:p-6">
        <Link href="/dashboard" className="mb-8 text-2xl font-black tracking-tight text-indigo-600">
          ✦ MyWorkspace
        </Link>

        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
          Workspace
        </p>
        <Link href="/dashboard" className="flex items-center gap-3 rounded-xl bg-indigo-50 px-4 py-3 text-sm font-bold text-indigo-700">
          <span className="text-lg">▦</span> Dashboard
        </Link>

        <div className="mt-8 border-t border-slate-100 pt-6">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Account
          </p>
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-lg font-bold text-white shadow-md shadow-indigo-200">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-800">{user.name}</p>
              <p className="truncate text-xs text-slate-500">{user.email}</p>
            </div>
          </div>

          <form action={logout} className="mt-6">
            <button className="w-full rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600">
              <span aria-hidden="true">↪</span> Keluar
            </button>
          </form>
        </div>

        <div className="mt-8 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-4 text-white lg:mt-auto">
          <p className="text-sm font-bold">Ruang kerjamu.</p>
          <p className="mt-1 text-xs leading-5 text-indigo-100">
            Semua data tersimpan secara pribadi untuk akunmu.
          </p>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-5 sm:p-8 lg:p-10">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-indigo-600">
              WORKSPACE / OVERVIEW
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Dashboard
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Senang melihatmu kembali, {user.name}.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-500 shadow-sm">
            ✦ PERSONAL WORKSPACE
          </div>
        </header>

        {messages.success && (
          <div role="status" className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {messages.success}
          </div>
        )}
        {messages.error && (
          <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {messages.error}
          </div>
        )}

        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">Total data</p>
              <span className="rounded-xl bg-indigo-50 px-3 py-2 text-lg text-indigo-600">▦</span>
            </div>
            <p className="mt-4 text-4xl font-black tracking-tight text-slate-900">{tasks.length}</p>
            <p className="mt-1 text-xs text-slate-400">Data milik akunmu</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">Status akun</p>
              <span className="rounded-xl bg-emerald-50 px-3 py-2 text-lg text-emerald-600">✓</span>
            </div>
            <p className="mt-4 text-3xl font-black tracking-tight text-emerald-600">Aktif</p>
            <p className="mt-1 text-xs text-slate-400">Kamu sudah login</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:col-span-2 xl:col-span-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">Privasi data</p>
              <span className="rounded-xl bg-violet-50 px-3 py-2 text-lg text-violet-600">◇</span>
            </div>
            <p className="mt-4 text-3xl font-black tracking-tight text-indigo-600">Private</p>
            <p className="mt-1 text-xs text-slate-400">Data dipisahkan per pengguna</p>
          </div>
        </section>

        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <p className="text-xs font-bold tracking-[0.18em] text-indigo-600">QUICK ACTION</p>
            <h2 className="mt-2 text-xl font-bold text-slate-900">Tambah data baru</h2>
            <p className="mt-1 text-sm text-slate-500">Catat pekerjaan atau informasi yang ingin kamu simpan.</p>
          </div>

          <form action={createTask} className="space-y-4">
            <div>
              <label htmlFor="title" className="mb-2 block text-sm font-semibold text-slate-700">Judul</label>
              <input
                id="title"
                name="title"
                maxLength={120}
                placeholder="Contoh: Belajar Next.js"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label htmlFor="description" className="mb-2 block text-sm font-semibold text-slate-700">Deskripsi</label>
              <textarea
                id="description"
                name="description"
                rows={3}
                maxLength={2000}
                placeholder="Tambahkan detail jika diperlukan..."
                className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />
            </div>
            <button type="submit" className="rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white shadow-lg shadow-indigo-100 hover:-translate-y-0.5 hover:bg-indigo-700">
              + Tambah data
            </button>
          </form>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Data saya</h2>
              <p className="mt-1 text-sm text-slate-500">Daftar informasi yang tersimpan di akunmu.</p>
            </div>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
              {tasks.length} item
            </span>
          </div>

          {tasks.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-3xl text-indigo-600">▦</div>
              <h3 className="mt-5 font-bold text-slate-800">Belum ada data</h3>
              <p className="mt-2 text-sm text-slate-500">Tambahkan data pertamamu melalui form di atas.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Judul</th>
                    <th className="px-6 py-4">Deskripsi</th>
                    <th className="px-6 py-4">Dibuat</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tasks.map((task) => (
                    <tr key={task.id} className="hover:bg-slate-50/80">
                      <td className="px-6 py-5 text-sm font-bold text-slate-800">{task.title}</td>
                      <td className="max-w-xs px-6 py-5 text-sm text-slate-500">
                        <span className="line-clamp-2">{task.description || "—"}</span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-5 text-xs text-slate-500">{task.created_at}</td>
                      <td className="whitespace-nowrap px-6 py-5">
                        <div className="flex justify-end gap-2">
                          <Link href={`/dashboard/edit/${task.id}`} className="rounded-lg bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100">
                            Edit
                          </Link>
                          <form action={deleteTask}>
                            <input type="hidden" name="id" value={task.id} />
                            <button type="submit" className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100">
                              Hapus
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer className="mt-8 pb-3 text-center text-xs text-slate-400">
          © 2026 MyWorkspace · Built with Next.js, Tailwind CSS & SQLite
        </footer>
      </main>
    </div>
  );
}
