import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    username: text('username').notNull().unique(),
    password: text('password').notNull(),
});

export const characters = sqliteTable('characters', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').references(() => users.id).notNull(),
    name: text('name').notNull(),
    race: text('race').notNull(),
    class: text('class').notNull(),
    level: integer('level').notNull(),
    abilityScores: text('ability_scores').notNull(), // JSON
    defenses: text('defenses').notNull(), // JSON
    health: text('health').notNull(), // JSON
});

export const powers = sqliteTable('powers', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    characterId: integer('character_id').references(() => characters.id, { onDelete: 'cascade' }).notNull(),
    name: text('name').notNull(),
    type: text('type').notNull(),
    actionType: text('action_type').notNull(),
    range: text('range'),
    attack: text('attack'),
    hit: text('hit'),
    miss: text('miss'),
    effect: text('effect'),
});

export const conditions = sqliteTable('conditions', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    characterId: integer('character_id').references(() => characters.id, { onDelete: 'cascade' }).notNull(),
    name: text('name').notNull(),
    duration: text('duration'),
    effectDescription: text('effect_description'),
});
