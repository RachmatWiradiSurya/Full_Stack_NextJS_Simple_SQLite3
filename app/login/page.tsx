import Link from "next/link";
import { login } from "@/app/actions/auth";
import AuthShell from "@/app/components/AuthShell";

export const metadata = { title: "Login — MyWorkspace" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <AuthShell mode="login">
      <div className="mb-9">
        <p className="text-xs font-bold tracking-[0.2em] text-indigo-600">
          WELCOME BACK
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
          Selamat datang!
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Masuk untuk melanjutkan ke workspace pribadimu.
        </p>
      </div>

      {error && (
        <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form action={login} className="space-y-5">
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
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
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
            autoComplete="current-password"
            placeholder="Masukkan password"
            required
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-indigo-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-indigo-200 hover:-translate-y-0.5 hover:bg-indigo-700"
        >
          Login ke Dashboard <span aria-hidden="true">→</span>
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-500">
        Belum punya akun?{" "}
        <Link href="/register" className="font-bold text-indigo-600 hover:text-indigo-800">
          Daftar sekarang
        </Link>
      </p>
    </AuthShell>
  );
}
