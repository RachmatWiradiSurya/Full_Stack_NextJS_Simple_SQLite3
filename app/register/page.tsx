import Link from "next/link";
import { register } from "@/app/actions/auth";
import AuthShell from "@/app/components/AuthShell";

export const metadata = { title: "Register — MyWorkspace" };

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <AuthShell mode="register">
      <div className="mb-8">
        <p className="text-xs font-bold tracking-[0.2em] text-indigo-600">
          CREATE ACCOUNT
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
          Buat akun baru
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Mulai bangun workspace yang lebih terorganisir.
        </p>
      </div>

      {error && (
        <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form action={register} className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-700">
            Nama lengkap
          </label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            placeholder="Nama kamu"
            minLength={2}
            maxLength={80}
            required
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="nama@email.com"
            required
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="Minimal 8 karakter"
            minLength={8}
            maxLength={128}
            required
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          />
          <p className="mt-2 text-xs text-slate-400">Gunakan minimal 8 karakter.</p>
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-indigo-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700"
        >
          Buat Akun <span aria-hidden="true">→</span>
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-slate-500">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-bold text-indigo-600 hover:text-indigo-800">
          Login
        </Link>
      </p>
    </AuthShell>
  );
}
