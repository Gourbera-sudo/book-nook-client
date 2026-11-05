import { headers } from "next/headers";
import { SignJWT } from "jose";

import { auth } from "@/lib/auth";

const JWT_ISSUER = "book-nook";
const JWT_AUDIENCE = "book-nook-api";
const TOKEN_TTL_SECONDS = 5 * 60;

function getSecret() {
  const secret = process.env.JWT_SECRET || process.env.BETTER_AUTH_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return new TextEncoder().encode(secret);
}

// Mints a short-lived JWT for the signed-in better-auth session. The Express
// API verifies this token instead of reading better-auth's session cookie.
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.email) {
    return Response.json(
      { error: "You must be signed in to do that" },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  const user = session.user;
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + TOKEN_TTL_SECONDS;

  const token = await new SignJWT({
    email: user.email,
    name: user.name ?? "",
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(String(user.id))
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setIssuedAt(issuedAt)
    .setExpirationTime(expiresAt)
    .sign(getSecret());

  return Response.json(
    { token, expiresAt: expiresAt * 1000 },
    { headers: { "Cache-Control": "no-store" } },
  );
}
