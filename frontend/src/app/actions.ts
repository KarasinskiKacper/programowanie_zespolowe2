"use server";

import { cookies } from "next/headers";

export async function createCookie(name: string, value: string) {
  const cookieStore = await cookies();

  // TODO add secure?
  cookieStore.set(name, value, { maxAge: 60 * 60 * 24 });
}

export async function getCookie(name: string) {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(name);
  return cookie?.value;
}

export async function deleteCookie(name: string) {
  const cookieStore = await cookies();
  cookieStore.delete(name);
}
