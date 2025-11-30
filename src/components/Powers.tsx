'use client';

import { useState, useEffect, FormEvent } from 'react';
import styles from './Powers.module.css';
import { Power } from '@/types';

const TYPES = ['At-Will', 'Encounter', 'Daily'];

interface PowersProps {
    characterId: number | string;
}

export default function Powers({ characterId }: PowersProps) {
    const [powers, setPowers] = useState<Power[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [newPower, setNewPower] = useState<Partial<Power>>({
        name: '', type: 'At-Will', actionType: 'Standard', range: '', attack: '', hit: '', miss: '', effect: ''
    });

    useEffect(() => {
        fetchPowers();
    }, [characterId]);

    const fetchPowers = async () => {
        const res = await fetch(`/api/characters/${characterId}/powers`);
        const data = await res.json();
        setPowers(data.powers || []);
    };

    const handleAdd = async (e: FormEvent) => {
        e.preventDefault();
        await fetch(`/api/characters/${characterId}/powers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPower),
        });
        setShowForm(false);
        setNewPower({ name: '', type: 'At-Will', actionType: 'Standard', range: '', attack: '', hit: '', miss: '', effect: '' });
        await fetchPowers();
    };

    const handleDelete = async (powerId: number) => {
        if (!confirm('Delete this power?')) return;
        await fetch(`/api/characters/${characterId}/powers?powerId=${powerId}`, { method: 'DELETE' });
        await fetchPowers();
    };

    return (
        <div className="card">
            <div className={styles.header}>
                <h2>Powers</h2>
                <button className="btn btn-secondary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : 'Add Power'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleAdd} className={styles.form}>
                    <input className="input" placeholder="Name" value={newPower.name} onChange={e => setNewPower({ ...newPower, name: e.target.value })} required />
                    <div className={styles.row}>
                        <select className="input" value={newPower.type} onChange={e => setNewPower({ ...newPower, type: e.target.value })}>
                            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <select className="input" value={newPower.actionType} onChange={e => setNewPower({ ...newPower, actionType: e.target.value })}>
                            <option value="Standard">Standard</option>
                            <option value="Move">Move</option>
                            <option value="Minor">Minor</option>
                            <option value="Free">Free</option>
                        </select>
                    </div>
                    <input className="input" placeholder="Range" value={newPower.range} onChange={e => setNewPower({ ...newPower, range: e.target.value })} />
                    <input className="input" placeholder="Attack" value={newPower.attack} onChange={e => setNewPower({ ...newPower, attack: e.target.value })} />
                    <textarea className="input" placeholder="Hit" value={newPower.hit} onChange={e => setNewPower({ ...newPower, hit: e.target.value })} />
                    <textarea className="input" placeholder="Effect" value={newPower.effect} onChange={e => setNewPower({ ...newPower, effect: e.target.value })} />
                    <button type="submit" className="btn btn-primary">Save Power</button>
                </form>
            )}

            <div className={styles.list}>
                {TYPES.map(type => {
                    const typePowers = powers.filter(p => p.type === type);
                    if (typePowers.length === 0) return null;
                    return (
                        <div key={type} className={styles.group}>
                            <h3 className={`${styles.typeHeader} ${styles[type.toLowerCase().replace('-', '')]}`}>{type}</h3>
                            {typePowers.map(p => (
                                <div key={p.id} className={styles.powerCard}>
                                    <div className={styles.powerHeader}>
                                        <h4>{p.name}</h4>
                                        <span className={styles.actionType}>{p.actionType}</span>
                                    </div>
                                    <div className={styles.powerDetails}>
                                        {p.range && <p><strong>Range:</strong> {p.range}</p>}
                                        {p.attack && <p><strong>Attack:</strong> {p.attack}</p>}
                                        {p.hit && <p><strong>Hit:</strong> {p.hit}</p>}
                                        {p.miss && <p><strong>Miss:</strong> {p.miss}</p>}
                                        {p.effect && <p><strong>Effect:</strong> {p.effect}</p>}
                                    </div>
                                    <button className={styles.deleteBtn} onClick={() => handleDelete(p.id)}>×</button>
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
