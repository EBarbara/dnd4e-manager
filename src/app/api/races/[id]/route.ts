import { NextResponse } from 'next/server';
import db from '@/db';
import { races } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const raceId = parseInt(id);
        const race = await db.select().from(races).where(eq(races.id, raceId)).get();

        if (!race) {
            return NextResponse.json({ error: 'Race not found' }, { status: 404 });
        }

        return NextResponse.json({ race });
    } catch (error) {
        console.error('Failed to fetch race:', error);
        return NextResponse.json({ error: 'Failed to fetch race' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const raceId = parseInt(id);
        const body = await request.json();

        const updatedRace = await db.update(races).set({
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
            traits: JSON.stringify(body.traits),
        }).where(eq(races.id, raceId)).returning();

        if (!updatedRace.length) {
            return NextResponse.json({ error: 'Race not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, race: updatedRace[0] });
    } catch (error) {
        console.error('Failed to update race:', error);
        return NextResponse.json({ error: 'Failed to update race' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const raceId = parseInt(id);
        await db.delete(races).where(eq(races.id, raceId));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete race:', error);
        return NextResponse.json({ error: 'Failed to delete race' }, { status: 500 });
    }
}
