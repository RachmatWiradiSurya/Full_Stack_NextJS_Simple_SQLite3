"use server";

import db from "@/app/lib/db";
import { getSession } from "@/app/lib/session";
import { redirect } from "next/navigation";

async function requireUserId() {
  const session = await getSession();

  if (!session?.userId) {
    redirect("/login");
  }

  return session.userId;
}

function readTaskFields(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!title || title.length > 120) {
    throw new Error("Judul wajib diisi dan maksimal 120 karakter.");
  }

  if (description.length > 2000) {
    throw new Error("Deskripsi maksimal 2000 karakter.");
  }

  return { title, description };
}

export async function createTask(formData: FormData) {
  const userId = await requireUserId();
  const { title, description } = readTaskFields(formData);

  db.prepare(`
    INSERT INTO tasks (user_id, title, description)
    VALUES (?, ?, ?)
  `).run(userId, title, description || null);

  redirect("/dashboard");
}

export async function updateTask(formData: FormData) {
  const userId = await requireUserId();
  const id = Number(formData.get("id"));
  const { title, description } = readTaskFields(formData);

  if (!Number.isSafeInteger(id) || id < 1) {
    throw new Error("ID data tidak valid.");
  }

  const result = db.prepare(`
    UPDATE tasks
    SET title = ?, description = ?
    WHERE id = ? AND user_id = ?
  `).run(title, description || null, id, userId);

  if (result.changes === 0) {
    redirect("/dashboard?error=Data%20tidak%20ditemukan");
  }

  redirect("/dashboard?success=Data%20berhasil%20diperbarui");
}

export async function deleteTask(formData: FormData) {
  const userId = await requireUserId();
  const id = Number(formData.get("id"));

  if (!Number.isSafeInteger(id) || id < 1) {
    throw new Error("ID data tidak valid.");
  }

  db.prepare(`
    DELETE FROM tasks
    WHERE id = ? AND user_id = ?
  `).run(id, userId);

  redirect("/dashboard?success=Data%20berhasil%20dihapus");
}
