'use client';

import { useState } from 'react';
import styles from './Stats.module.css';
import { AbilityScores, Defenses, Character } from '@/types';

const ABILITIES: (keyof AbilityScores)[] = ['str', 'con', 'dex', 'int', 'wis', 'cha'];
const DEFENSES: (keyof Defenses)[] = ['ac', 'fort', 'ref', 'will'];

interface StatsProps {
    abilityScores: AbilityScores;
    defenses: Defenses;
    level: number;
    onUpdate: (data: Partial<Character>) => void;
}

export default function Stats({ abilityScores, defenses, level, onUpdate }: StatsProps) {
    const [editing, setEditing] = useState(false);
    const [scores, setScores] = useState<AbilityScores>(abilityScores);
    const [defs, setDefs] = useState<Defenses>(defenses);

    const getMod = (score: number) => Math.floor((score - 10) / 2);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const getHalfLevel = () => Math.floor(level / 2);

    const handleSave = () => {
        onUpdate({ abilityScores: scores, defenses: defs });
        setEditing(false);
    };

    return (
        <div className="card">
            <div className={styles.header}>
                <h2>Stats</h2>
                <button className="btn btn-secondary" onClick={() => editing ? handleSave() : setEditing(true)}>
                    {editing ? 'Save' : 'Edit'}
                </button>
            </div>

            <div className={styles.section}>
                <h3>Ability Scores</h3>
                <div className={styles.statsGrid}>
                    {ABILITIES.map((abil) => (
                        <div key={abil} className={styles.statRow}>
                            <span className={styles.label}>{abil.toUpperCase()}</span>
                            {editing ? (
                                <input
                                    type="number"
                                    className="input"
                                    value={scores[abil]}
                                    onChange={(e) => setScores({ ...scores, [abil]: parseInt(e.target.value) || 10 })}
                                />
                            ) : (
                                <span className={styles.value}>{scores[abil]}</span>
                            )}
                            <span className={styles.mod}>
                                {getMod(scores[abil]) >= 0 ? '+' : ''}{getMod(scores[abil])}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <h3>Defenses</h3>
                <div className={styles.statsGrid}>
                    {DEFENSES.map((def) => (
                        <div key={def} className={styles.statRow}>
                            <span className={styles.label}>{def.toUpperCase()}</span>
                            {editing ? (
                                <input
                                    type="number"
                                    className="input"
                                    value={defs[def]}
                                    onChange={(e) => setDefs({ ...defs, [def]: parseInt(e.target.value) || 10 })}
                                />
                            ) : (
                                <span className={styles.value}>{defs[def]}</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
