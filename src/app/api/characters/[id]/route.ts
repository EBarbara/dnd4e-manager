import { NextRequest, NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';
import db from '@/db';
import { characters } from '@/db/schema';
import { getSession } from '@/utils/auth';
import { Character } from '@/types';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    try {
        const [character] = db.select()
            .from(characters)
            .where(and(eq(characters.id, Number(id)), eq(characters.userId, session.userId as number)))
            .all();

        if (!character) {
            return NextResponse.json({ error: 'Character not found' }, { status: 404 });
        }

        // Parse JSON fields
        // Drizzle returns the raw text from the DB for text columns
        const charData = { ...character } as any;
        if (typeof charData.abilityScores === 'string') charData.abilityScores = JSON.parse(charData.abilityScores);
        if (typeof charData.defenses === 'string') charData.defenses = JSON.parse(charData.defenses);
        if (typeof charData.health === 'string') charData.health = JSON.parse(charData.health);

        return NextResponse.json({ character: charData });
    } catch (error) {
        console.error('Error fetching character:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const updates = await request.json();

    try {
        // Build update object
        const updateData: any = {};
        if (updates.name) updateData.name = updates.name;
        if (updates.race) updateData.race = updates.race;
        if (updates.class) updateData.class = updates.class;
        if (updates.level) updateData.level = updates.level;
        if (updates.abilityScores) updateData.abilityScores = JSON.stringify(updates.abilityScores);
        if (updates.defenses) updateData.defenses = JSON.stringify(updates.defenses);
        if (updates.health) updateData.health = JSON.stringify(updates.health);

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ success: true });
        }

        const info = db.update(characters)
            .set(updateData)
            .where(and(eq(characters.id, Number(id)), eq(characters.userId, session.userId as number)))
            .run();

        if (info.changes === 0) {
            return NextResponse.json({ error: 'Character not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating character:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    try {
        const info = db.delete(characters)
            .where(and(eq(characters.id, Number(id)), eq(characters.userId, session.userId as number)))
            .run();

        if (info.changes === 0) {
            return NextResponse.json({ error: 'Character not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting character:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
