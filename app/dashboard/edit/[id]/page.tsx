import db from "@/app/lib/db";
import { getSession } from "@/app/lib/session";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { updateTask } from "@/app/actions/tasks";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Task = {
  id: number;
  title: string;
  description: string | null;
};

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session?.userId) redirect("/login");

  const { id } = await params;
  const taskId = Number(id);
  const userId = session.userId;

  if (!Number.isSafeInteger(taskId) || taskId < 1) notFound();

  const task = db.prepare(`
    SELECT id, title, description
    FROM tasks
    WHERE id = ? AND user_id = ?
  `).get(taskId, userId) as Task | undefined;

  if (!task) notFound();

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
      <div className="w-full max-w-xl rounded-[2rem] bg-white p-7 shadow-2xl sm:p-10">
        <Link href="/dashboard" className="text-sm font-bold text-indigo-600 hover:text-indigo-800">
          ← Kembali ke dashboard
        </Link>

        <div className="mb-8 mt-9">
          <p className="text-xs font-bold tracking-[0.2em] text-indigo-600">EDIT WORKSPACE</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900">Edit data</h1>
          <p className="mt-2 text-sm text-slate-500">Perbarui informasi yang tersimpan di akunmu.</p>
        </div>

        <form action={updateTask} className="space-y-5">
          <input type="hidden" name="id" value={task.id} />

          <div>
            <label htmlFor="title" className="mb-2 block text-sm font-semibold text-slate-700">Judul</label>
            <input
              id="title"
              name="title"
              defaultValue={task.title}
              maxLength={120}
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label htmlFor="description" className="mb-2 block text-sm font-semibold text-slate-700">Deskripsi</label>
            <textarea
              id="description"
              name="description"
              defaultValue={task.description ?? ""}
              rows={5}
              maxLength={2000}
              className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <button type="submit" className="w-full rounded-xl bg-indigo-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700">
            Simpan perubahan
          </button>
        </form>
      </div>
    </main>
  );
}
