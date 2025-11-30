'use client';

import { useState, useEffect } from 'react';
import { Race } from '@/types';
import styles from './page.module.css';

export default function RacesAdmin() {
    const [races, setRaces] = useState<Race[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingRace, setEditingRace] = useState<Partial<Omit<Race, 'traits'> & { traits: any[] }> | null>(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchRaces();
    }, []);

    const fetchRaces = async () => {
        try {
            const res = await fetch('/api/races');
            const data = await res.json();
            setRaces(data.races || []);
        } catch (error) {
            console.error('Failed to fetch races', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingRace) return;

        const method = editingRace.id ? 'PUT' : 'POST';
        const url = editingRace.id ? `/api/races/${editingRace.id}` : '/api/races';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingRace),
            });
            const data = await res.json();
            if (data.success || data.race) {
                setShowForm(false);
                setEditingRace(null);
                fetchRaces();
            }
        } catch (error) {
            console.error('Failed to save race', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this race?')) return;
        try {
            await fetch(`/api/races/${id}`, { method: 'DELETE' });
            fetchRaces();
        } catch (error) {
            console.error('Failed to delete race', error);
        }
    };

    const handleEdit = (race: Race) => {
        setEditingRace({
            ...race,
            traits: typeof race.traits === 'string' ? JSON.parse(race.traits) : race.traits
        });
        setShowForm(true);
    };

    const handleAddNew = () => {
        setEditingRace({
            name: '',
            descriptionShort: '',
            descriptionLong: '',
            averageHeightMin: 66,
            averageHeightMax: 74,
            averageWeightMin: 135,
            averageWeightMax: 220,
            abilityScores: '+2 to one ability score of your choice',
            size: 'Medium',
            speed: 6,
            vision: 'Normal',
            traits: [] as any
        });
        setShowForm(true);
    };

    const updateTrait = (index: number, field: string, value: string) => {
        if (!editingRace) return;
        const traits = Array.isArray(editingRace.traits) ? [...editingRace.traits] : [];
        traits[index] = { ...traits[index], [field]: value };
        setEditingRace({ ...editingRace, traits });
    };

    const addTrait = () => {
        if (!editingRace) return;
        const traits = Array.isArray(editingRace.traits) ? [...editingRace.traits] : [];
        traits.push({ name: '', description: '' });
        setEditingRace({ ...editingRace, traits });
    };

    const removeTrait = (index: number) => {
        if (!editingRace) return;
        const traits = Array.isArray(editingRace.traits) ? [...editingRace.traits] : [];
        traits.splice(index, 1);
        setEditingRace({ ...editingRace, traits });
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container" style={{ padding: '2rem' }}>
            <header className={styles.header}>
                <h1>Races Management</h1>
                <button onClick={handleAddNew} className="btn btn-primary">Add New Race</button>
            </header>

            {showForm && editingRace && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h2>{editingRace.id ? 'Edit Race' : 'New Race'}</h2>
                        <form onSubmit={handleSave} className={styles.form}>
                            <div className={styles.field}>
                                <label>Name</label>
                                <input
                                    value={editingRace.name}
                                    onChange={e => setEditingRace({ ...editingRace, name: e.target.value })}
                                    required
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.field}>
                                <label>Short Description</label>
                                <input
                                    value={editingRace.descriptionShort}
                                    onChange={e => setEditingRace({ ...editingRace, descriptionShort: e.target.value })}
                                    required
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.field}>
                                <label>Long Description</label>
                                <textarea
                                    value={editingRace.descriptionLong}
                                    onChange={e => setEditingRace({ ...editingRace, descriptionLong: e.target.value })}
                                    required
                                    className={styles.textarea}
                                />
                            </div>

                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <label>Height Min (in)</label>
                                    <input type="number" value={editingRace.averageHeightMin} onChange={e => setEditingRace({ ...editingRace, averageHeightMin: parseInt(e.target.value) })} className={styles.input} />
                                </div>
                                <div className={styles.field}>
                                    <label>Height Max (in)</label>
                                    <input type="number" value={editingRace.averageHeightMax} onChange={e => setEditingRace({ ...editingRace, averageHeightMax: parseInt(e.target.value) })} className={styles.input} />
                                </div>
                                <div className={styles.field}>
                                    <label>Weight Min (lbs)</label>
                                    <input type="number" value={editingRace.averageWeightMin} onChange={e => setEditingRace({ ...editingRace, averageWeightMin: parseInt(e.target.value) })} className={styles.input} />
                                </div>
                                <div className={styles.field}>
                                    <label>Weight Max (lbs)</label>
                                    <input type="number" value={editingRace.averageWeightMax} onChange={e => setEditingRace({ ...editingRace, averageWeightMax: parseInt(e.target.value) })} className={styles.input} />
                                </div>
                            </div>

                            <div className={styles.field}>
                                <label>Ability Scores</label>
                                <input value={editingRace.abilityScores} onChange={e => setEditingRace({ ...editingRace, abilityScores: e.target.value })} className={styles.input} />
                            </div>

                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <label>Size</label>
                                    <input value={editingRace.size} onChange={e => setEditingRace({ ...editingRace, size: e.target.value })} className={styles.input} />
                                </div>
                                <div className={styles.field}>
                                    <label>Speed</label>
                                    <input type="number" value={editingRace.speed} onChange={e => setEditingRace({ ...editingRace, speed: parseInt(e.target.value) })} className={styles.input} />
                                </div>
                                <div className={styles.field}>
                                    <label>Vision</label>
                                    <input value={editingRace.vision} onChange={e => setEditingRace({ ...editingRace, vision: e.target.value })} className={styles.input} />
                                </div>
                            </div>

                            <div className={styles.traitsSection}>
                                <h3>Racial Traits</h3>
                                {(Array.isArray(editingRace.traits) ? editingRace.traits : []).map((trait: any, index: number) => (
                                    <div key={index} className={styles.traitRow}>
                                        <input
                                            placeholder="Trait Name"
                                            value={trait.name}
                                            onChange={e => updateTrait(index, 'name', e.target.value)}
                                            className={styles.input}
                                        />
                                        <input
                                            placeholder="Description"
                                            value={trait.description}
                                            onChange={e => updateTrait(index, 'description', e.target.value)}
                                            className={styles.input}
                                        />
                                        <button type="button" onClick={() => removeTrait(index)} className="btn btn-secondary">Remove</button>
                                    </div>
                                ))}
                                <button type="button" onClick={addTrait} className="btn btn-secondary">Add Trait</button>
                            </div>

                            <div className={styles.actions}>
                                <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Cancel</button>
                                <button type="submit" className="btn btn-primary">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className={styles.grid}>
                {races.map(race => (
                    <div key={race.id} className={`card ${styles.card}`}>
                        <h3>{race.name}</h3>
                        <p>{race.descriptionShort}</p>
                        <div className={styles.cardActions}>
                            <button onClick={() => handleEdit(race)} className="btn btn-secondary">Edit</button>
                            <button onClick={() => handleDelete(race.id)} className="btn btn-secondary" style={{ color: 'red' }}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
