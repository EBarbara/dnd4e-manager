'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import Stats from '@/components/Stats';
import Health from '@/components/Health';
import Powers from '@/components/Powers';
import Conditions from '@/components/Conditions';
import { Character } from '@/types';

export default function CharacterSheet({ params }: { params: Promise<{ id: string }> }) {
    const [character, setCharacter] = useState<Character | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Unwrap params using use() hook for Next.js 15+ compatibility
    const { id } = use(params);

    useEffect(() => {
        fetchCharacter();
    }, [id]);

    const fetchCharacter = async () => {
        try {
            const res = await fetch(`/api/characters/${id}`);
            if (res.status === 401) {
                router.push('/');
                return;
            }
            if (!res.ok) {
                router.push('/dashboard');
                return;
            }
            const data = await res.json();
            setCharacter(data.character);
        } catch (error) {
            console.error('Failed to fetch character', error);
        } finally {
            setLoading(false);
        }
    };

    const updateCharacter = async (updates: Partial<Character>) => {
        try {
            const res = await fetch(`/api/characters/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            if (res.ok) {
                setCharacter((prev) => prev ? ({ ...prev, ...updates }) : null);
            }
        } catch (error) {
            console.error('Failed to update character', error);
        }
    };

    if (loading) return <div className="container">Loading...</div>;
    if (!character) return <div className="container">Character not found</div>;

    return (
        <div className={styles.sheetContainer}>
            <header className={styles.header}>
                <button onClick={() => router.push('/dashboard')} className="btn btn-secondary">
                    &larr; Back
                </button>
                <div className={styles.identity}>
                    <h1>{character.name}</h1>
                    <p>Level {character.level} {character.race} {character.class}</p>
                </div>
                <div className={styles.rest}>
                    <button className="btn btn-secondary" onClick={() => window.location.reload()}>Short Rest</button>
                    <button className="btn btn-primary" onClick={() => window.location.reload()}>Extended Rest</button>
                </div>
            </header>

            <div className={styles.grid}>
                <div className={styles.leftCol}>
                    <Stats
                        abilityScores={typeof character.abilityScores === 'string' ? JSON.parse(character.abilityScores) : character.abilityScores}
                        defenses={typeof character.defenses === 'string' ? JSON.parse(character.defenses) : character.defenses}
                        level={character.level}
                        onUpdate={(updates) => updateCharacter(updates)}
                    />
                </div>

                <div className={styles.centerCol}>
                    <Health
                        health={typeof character.health === 'string' ? JSON.parse(character.health) : character.health}
                        onUpdate={(health) => updateCharacter({ health })}
                    />
                    <Powers
                        characterId={id}
                    />
                </div>

                <div className={styles.rightCol}>
                    <Conditions
                        characterId={id}
                    />
                </div>
            </div>
        </div>
    );
}
