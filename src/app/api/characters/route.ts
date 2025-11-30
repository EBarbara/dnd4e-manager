import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import db from '@/db';
import { characters } from '@/db/schema';
import { getSession } from '@/utils/auth';
import { Character } from '@/types';

export async function GET() {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const charList = db.select({
            id: characters.id,
            name: characters.name,
            race: characters.race,
            class: characters.class,
            level: characters.level
        })
            .from(characters)
            .where(eq(characters.userId, session.userId as number))
            .all();

        return NextResponse.json({ characters: charList });
    } catch (error) {
        console.error('Error fetching characters:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { name, race, charClass, level } = await request.json();

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const defaultStats = JSON.stringify({ str: 10, con: 10, dex: 10, int: 10, wis: 10, cha: 10 });
        const defaultDefenses = JSON.stringify({ ac: 10, fort: 10, ref: 10, will: 10 });
        const defaultHealth = JSON.stringify({ hp: 20, maxHp: 20, surges: 6, maxSurges: 6 });

        const result = db.insert(characters).values({
            userId: session.userId as number,
            name,
            race: race || 'Human',
            class: charClass || 'Fighter',
            level: level || 1,
            abilityScores: defaultStats,
            defenses: defaultDefenses,
            health: defaultHealth
        }).returning({ id: characters.id }).all();

        return NextResponse.json({ success: true, id: result[0].id });
    } catch (error) {
        console.error('Error creating character:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
