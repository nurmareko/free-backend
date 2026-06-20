import { getUser } from "@/lib/auth";
import { ok, handleError } from "@/lib/http";

// GET /api/me -> { id, name, email, picture }
// Optional: the Android app already has these from Google Sign-In, but this is a
// handy fallback / sanity check that the token is being verified server-side.
export async function GET(req: Request) {
  try {
    const user = await getUser(req);
    return ok(user);
  } catch (e) {
    return handleError(e);
  }
}
