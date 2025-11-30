import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import db from '@/db';
import { users } from '@/db/schema';
import { getSession } from '@/utils/auth';
import { User } from '@/types';

export async function GET() {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ user: null });
    }

    const [user] = db.select({ id: users.id, username: users.username }).from(users).where(eq(users.id, session.userId as number)).all();

    return NextResponse.json({ user: user || null });
}
