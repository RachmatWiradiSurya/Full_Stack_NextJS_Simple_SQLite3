import Link from "next/link";

type Props = {
  children: React.ReactNode;
  mode: "login" | "register";
};

export default function AuthShell({ children, mode }: Props) {
  const isLogin = mode === "login";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-2xl md:grid-cols-2">
        <section className="relative hidden min-h-[650px] flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-700 to-slate-950 p-12 text-white md:flex">
          <div className="absolute -right-24 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-fuchsia-400/20 blur-3xl" />

          <div className="relative">
            <Link href="/login" className="text-2xl font-black tracking-tight">
              ✦ MyWorkspace
            </Link>
            <div className="mt-28 max-w-sm">
              <p className="text-xs font-bold tracking-[0.25em] text-indigo-200">
                YOUR PERSONAL SPACE
              </p>
              <h2 className="mt-5 text-5xl font-bold leading-[1.1] tracking-tight">
                {isLogin
                  ? "Manage your work. Own your progress."
                  : "Start your journey. Build something great."}
              </h2>
              <p className="mt-6 text-base leading-7 text-indigo-100">
                Kelola pekerjaan, catatan, dan ide dalam satu ruang pribadi
                yang sederhana dan terorganisir.
              </p>
            </div>
          </div>

          <p className="relative text-sm text-indigo-200">
            © 2026 MyWorkspace. Made for your next big idea.
          </p>
        </section>

        <section className="flex items-center px-7 py-12 sm:px-12 lg:px-16">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-9 md:hidden">
              <Link href="/login" className="text-2xl font-black text-indigo-600">
                ✦ MyWorkspace
              </Link>
            </div>
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
