"use server";

import db from "@/app/lib/db";
import { createSession, deleteSession } from "@/app/lib/session";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

function safeText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export async function register(formData: FormData) {
  const name = safeText(formData.get("name"));
  const email = safeText(formData.get("email")).toLowerCase();
  const password = typeof formData.get("password") === "string"
    ? String(formData.get("password"))
    : "";

  if (name.length < 2 || name.length > 80) {
    redirect("/register?error=Nama%20harus%202-80%20karakter");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    redirect("/register?error=Format%20email%20tidak%20valid");
  }

  if (password.length < 8 || password.length > 128) {
    redirect("/register?error=Password%20harus%208-128%20karakter");
  }

  const existing = db.prepare(
    "SELECT id FROM users WHERE email = ?"
  ).get(email);

  if (existing) {
    redirect("/register?error=Email%20sudah%20digunakan");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  try {
    const result = db.prepare(`
      INSERT INTO users (name, email, password)
      VALUES (?, ?, ?)
    `).run(name, email, passwordHash);

    await createSession(Number(result.lastInsertRowid));
  } catch {
    redirect("/register?error=Gagal%20membuat%20akun.%20Coba%20lagi");
  }

  redirect("/dashboard");
}

export async function login(formData: FormData) {
  const email = safeText(formData.get("email")).toLowerCase();
  const password = typeof formData.get("password") === "string"
    ? String(formData.get("password"))
    : "";

  if (!email || !password) {
    redirect("/login?error=Email%20dan%20password%20wajib%20diisi");
  }

  const user = db.prepare(`
    SELECT id, password FROM users WHERE email = ?
  `).get(email) as { id: number; password: string } | undefined;

  if (!user || !(await bcrypt.compare(password, user.password))) {
    redirect("/login?error=Email%20atau%20password%20salah");
  }

  await createSession(user.id);
  redirect("/dashboard");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
