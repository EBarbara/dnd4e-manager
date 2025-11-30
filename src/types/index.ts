export type User = {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export type AbilityScores = {
    str: number;
    con: number;
    dex: number;
    int: number;
    wis: number;
    cha: number;
}

export type Defenses = {
    ac: number;
    fort: number;
    ref: number;
    will: number;
}

export type Health = {
    hp: number;
    maxHp: number;
    surges: number;
    maxSurges: number;
    tempHp?: number;
}

export type Character = {
    id: number;
    userId: string;
    name: string;
    race: string;
    class: string;
    level: number;
    abilityScores: AbilityScores | string; // Stored as JSON string in DB
    defenses: Defenses | string; // Stored as JSON string in DB
    health: Health | string; // Stored as JSON string in DB
}

export type Power = {
    id: number;
    characterId: number;
    name: string;
    type: string; // At-Will, Encounter, Daily
    actionType: string; // Standard, Move, Minor
    range: string;
    attack: string;
    hit: string;
    miss: string;
    effect: string;
}

export type Condition = {
    id: number;
    characterId: number;
    name: string;
    duration: string;
    effectDescription: string;
}
