import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error("JWT_SECRET is not defined");
}

const secretKey = new TextEncoder().encode(secret);

export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
};

export async function createToken(user: AuthUser) {
  return await new SignJWT(user)
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(
      token,
      secretKey
    );

    return payload as unknown as AuthUser;
  } catch {
    return null;
  }
}

export async function getAuthUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return null;
    return await verifyToken(token);
  } catch {
    return null;
  }
}