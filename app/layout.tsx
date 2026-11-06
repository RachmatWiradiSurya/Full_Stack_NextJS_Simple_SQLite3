import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MyWorkspace — Personal Dashboard",
  description: "A private multi-user workspace built with Next.js and SQLite.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
