import { OAuth2Client } from "google-auth-library";

// IMPORTANT: this MUST be the OAuth *Web* client ID — the same value you pass to
// Android's Credential Manager as `serverClientId`. Mismatch here = silent 401s.
const WEB_CLIENT_ID = process.env.GOOGLE_WEB_CLIENT_ID;

const client = new OAuth2Client();

export type AuthUser = {
  id: string; // Google "sub" — stable per-user id
  email: string;
  name: string;
  picture: string;
};

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

/**
 * Reads the Bearer token from the request, verifies it against Google,
 * and returns the authenticated user. Throws AuthError on any failure
 * (handled as HTTP 401 by handleError).
 */
export async function getUser(req: Request): Promise<AuthUser> {
  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : null;
  if (!token) throw new AuthError("Missing bearer token");
  if (!WEB_CLIENT_ID) throw new AuthError("Server missing GOOGLE_WEB_CLIENT_ID");

  let payload;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: WEB_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch {
    throw new AuthError("Invalid token");
  }

  if (!payload?.sub || !payload.email) throw new AuthError("Invalid token payload");

  return {
    id: payload.sub,
    email: payload.email,
    name: payload.name ?? payload.email,
    picture: payload.picture ?? "",
  };
}
