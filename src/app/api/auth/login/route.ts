import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import db from '@/db';
import { users } from '@/db/schema';
import { verifyPassword, createSession } from '@/utils/auth';
import { User } from '@/types';

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
        }

        const [user] = db.select().from(users).where(eq(users.username, username)).all();

        if (!user || !(await verifyPassword(password, user.password!))) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        await createSession(user.id);

        return NextResponse.json({ success: true, userId: user.id });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
