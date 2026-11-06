import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="max-w-md text-center">
        <p className="text-sm font-bold tracking-[0.2em] text-indigo-600">404</p>
        <h1 className="mt-3 text-3xl font-black text-slate-900">Halaman tidak ditemukan</h1>
        <p className="mt-3 text-slate-500">Data mungkin tidak tersedia atau bukan milik akunmu.</p>
        <Link href="/dashboard" className="mt-7 inline-flex rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white hover:bg-indigo-700">
          Kembali ke dashboard
        </Link>
      </div>
    </main>
  );
}
