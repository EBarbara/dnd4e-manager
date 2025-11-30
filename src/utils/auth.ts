import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify, JWTPayload } from 'jose';
import { cookies } from 'next/headers';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key-change-me');
const ALG = 'HS256';

export async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
}

export async function createSession(userId: number | string): Promise<void> {
    const token = await new SignJWT({ userId })
        .setProtectedHeader({ alg: ALG })
        .setExpirationTime('24h')
        .sign(SECRET_KEY);

    (await cookies()).set('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24, // 24 hours
    });
}

export async function getSession(): Promise<JWTPayload | null> {
    const token = (await cookies()).get('session')?.value;
    if (!token) return null;

    try {
        const { payload } = await jwtVerify(token, SECRET_KEY, {
            algorithms: [ALG],
        });
        return payload;
    } catch (error) {
        return null;
    }
}

export async function destroySession(): Promise<void> {
    (await cookies()).delete('session');
}
