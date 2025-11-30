import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import db from '@/db';
import { users } from '@/db/schema';
import { hashPassword, createSession } from '@/utils/auth';

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
        }

        const hashedPassword = await hashPassword(password);

        try {
            const result = db.insert(users).values({ username, password: hashedPassword }).returning({ id: users.id }).all();
            const userId = result[0].id;

            await createSession(userId);

            return NextResponse.json({ success: true, userId });
        } catch (error: any) {
            // Drizzle/better-sqlite3 throws specific errors. 
            // We check for unique constraint violation.
            if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
                return NextResponse.json({ error: 'Username already exists' }, { status: 409 });
            }
            throw error;
        }
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
