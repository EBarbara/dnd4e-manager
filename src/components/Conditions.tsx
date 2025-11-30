'use client';

import { useState, useEffect, FormEvent } from 'react';
import styles from './Conditions.module.css';
import { Condition } from '@/types';

interface ConditionsProps {
    characterId: number | string;
}

export default function Conditions({ characterId }: ConditionsProps) {
    const [conditions, setConditions] = useState<Condition[]>([]);
    const [newCondition, setNewCondition] = useState<Partial<Condition>>({ name: '', duration: '', effectDescription: '' });

    useEffect(() => {
        fetchConditions();
    }, [characterId]);

    const fetchConditions = async () => {
        const res = await fetch(`/api/characters/${characterId}/conditions`);
        const data = await res.json();
        setConditions(data.conditions || []);
    };

    const handleAdd = async (e: FormEvent) => {
        e.preventDefault();
        await fetch(`/api/characters/${characterId}/conditions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newCondition),
        });
        setNewCondition({ name: '', duration: '', effectDescription: '' });
        await fetchConditions();
    };

    const handleDelete = async (id: number) => {
        await fetch(`/api/characters/${characterId}/conditions?conditionId=${id}`, { method: 'DELETE' });
        await fetchConditions();
    };

    return (
        <div className="card">
            <div className={styles.header}>
                <h2>Conditions</h2>
            </div>

            <div className={styles.list}>
                {conditions.map(c => (
                    <div key={c.id} className={styles.conditionCard}>
                        <div className={styles.conditionHeader}>
                            <h4>{c.name}</h4>
                            <button className={styles.deleteBtn} onClick={() => handleDelete(c.id)}>×</button>
                        </div>
                        {c.duration && <p className={styles.detail}><strong>Duration:</strong> {c.duration}</p>}
                        {c.effectDescription && <p className={styles.detail}>{c.effectDescription}</p>}
                    </div>
                ))}
                {conditions.length === 0 && <p className={styles.empty}>No active conditions</p>}
            </div>

            <form onSubmit={handleAdd} className={styles.form}>
                <input
                    className="input"
                    placeholder="Condition Name (e.g. Dazed)"
                    value={newCondition.name}
                    onChange={e => setNewCondition({ ...newCondition, name: e.target.value })}
                    required
                />
                <input
                    className="input"
                    placeholder="Duration (e.g. End of next turn)"
                    value={newCondition.duration}
                    onChange={e => setNewCondition({ ...newCondition, duration: e.target.value })}
                />
                <input
                    className="input"
                    placeholder="Effect"
                    value={newCondition.effectDescription}
                    onChange={e => setNewCondition({ ...newCondition, effectDescription: e.target.value })}
                />
                <button type="submit" className="btn btn-primary">Add Condition</button>
            </form>
        </div>
    );
}
