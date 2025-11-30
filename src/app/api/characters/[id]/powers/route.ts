import { NextRequest, NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';
import db from '@/db';
import { powers } from '@/db/schema';
import { getSession } from '@/utils/auth';
import { Power } from '@/types';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    try {
        const powersList = db.select().from(powers).where(eq(powers.characterId, Number(id))).all();
        return NextResponse.json({ powers: powersList });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const { name, type, actionType, range, attack, hit, miss, effect } = await request.json();

    try {
        const result = db.insert(powers).values({
            characterId: Number(id),
            name,
            type,
            actionType,
            range,
            attack,
            hit,
            miss,
            effect
        }).returning({ id: powers.id }).all();

        return NextResponse.json({ success: true, id: result[0].id });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const url = new URL(request.url);
    const powerId = url.searchParams.get('powerId');

    if (!powerId) return NextResponse.json({ error: 'Power ID required' }, { status: 400 });

    try {
        db.delete(powers)
            .where(and(eq(powers.id, Number(powerId)), eq(powers.characterId, Number(id))))
            .run();
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
