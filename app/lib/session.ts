import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

function getSecret() {
  const value = process.env.SESSION_SECRET;

  if (!value || value.length < 32) {
    throw new Error(
      "SESSION_SECRET belum diatur atau kurang dari 32 karakter. Periksa .env.local."
    );
  }

  return new TextEncoder().encode(value);
}

export async function createSession(userId: number) {
  const token = await new SignJWT({ userId: String(userId) })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());

  const cookieStore = await cookies();

  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: ["HS256"],
    });

    const userId = Number(payload.userId);

    if (!Number.isSafeInteger(userId) || userId < 1) {
      return null;
    }

    return { userId };
  } catch {
    return null;
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
