import { NextResponse } from 'next/server';
import db from '@/db';
import { races } from '@/db/schema';

export async function GET() {
    try {
        const allRaces = await db.select().from(races);
        return NextResponse.json({ races: allRaces });
    } catch (error) {
        console.error('Failed to fetch races:', error);
        return NextResponse.json({ error: 'Failed to fetch races' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        // Basic validation could go here

        const newRace = await db.insert(races).values({
            name: body.name,
            descriptionShort: body.descriptionShort,
            descriptionLong: body.descriptionLong,
            averageHeightMin: body.averageHeightMin,
            averageHeightMax: body.averageHeightMax,
            averageWeightMin: body.averageWeightMin,
            averageWeightMax: body.averageWeightMax,
            abilityScores: body.abilityScores,
            size: body.size,
            speed: body.speed,
            vision: body.vision,
            traits: JSON.stringify(body.traits), // Ensure traits are stored as JSON string
        }).returning();

        return NextResponse.json({ success: true, race: newRace[0] });
    } catch (error) {
        console.error('Failed to create race:', error);
        return NextResponse.json({ error: 'Failed to create race' }, { status: 500 });
    }
}
