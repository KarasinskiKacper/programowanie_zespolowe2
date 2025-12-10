"use server";

import { cookies } from "next/headers";

/**
 * Creates a new cookie with the given name and value.
 * The cookie will expire in 15 minutes.
 * @param {string} name - The name of the cookie.
 * @param {string} value - The value of the cookie.
 * @returns {Promise<void>} - A promise resolving when the cookie has been created.
 */
export async function createCookie(name: string, value: string) {
  const cookieStore = await cookies();

  cookieStore.set(name, value, { maxAge: 60 * 15 });
}

/**
 * Retrieves a cookie by its name.
 * @param {string} name - The name of the cookie to retrieve.
 * @returns {Promise<string | undefined>} - A promise resolving to the value of the cookie if it exists, undefined otherwise.
 */
export async function getCookie(name: string) {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(name);
  return cookie?.value;
}

/**
 * Deletes a cookie by its name.
 * @param {string} name - The name of the cookie to delete.
 * @returns {Promise<void>} - A promise resolving when the cookie has been deleted.
 */
export async function deleteCookie(name: string) {
  const cookieStore = await cookies();
  cookieStore.delete(name);
}
