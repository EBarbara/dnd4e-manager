import { NextRequest, NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';
import db from '@/db';
import { conditions } from '@/db/schema';
import { auth } from '@/lib/auth';
import { Condition } from '@/types';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    try {
        const conditionsList = db.select().from(conditions).where(eq(conditions.characterId, Number(id))).all();
        return NextResponse.json({ conditions: conditionsList });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const { name, duration, effectDescription } = await request.json();

    try {
        const result = db.insert(conditions).values({
            characterId: Number(id),
            name,
            duration,
            effectDescription
        }).returning({ id: conditions.id }).all();

        return NextResponse.json({ success: true, id: result[0].id });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const url = new URL(request.url);
    const conditionId = url.searchParams.get('conditionId');

    if (!conditionId) return NextResponse.json({ error: 'Condition ID required' }, { status: 400 });

    try {
        db.delete(conditions)
            .where(and(eq(conditions.id, Number(conditionId)), eq(conditions.characterId, Number(id))))
            .run();
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
