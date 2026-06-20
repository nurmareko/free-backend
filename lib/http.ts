import { NextResponse } from "next/server";
import { AuthError } from "./auth";

export function ok(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function fail(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

/** Maps thrown errors to consistent JSON responses. */
export function handleError(e: unknown) {
  if (e instanceof AuthError) return fail(e.message, 401);
  console.error(e);
  return fail("Server error", 500);
}
