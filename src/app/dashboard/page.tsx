'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { Character } from '@/types';
import { authClient } from '@/lib/auth-client';

export default function Dashboard() {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newChar, setNewChar] = useState({ name: '', race: '', charClass: '', level: 1 });
    const router = useRouter();

    useEffect(() => {
        fetchCharacters();
    }, []);

    const fetchCharacters = async () => {
        try {
            const res = await fetch('/api/characters');
            if (res.status === 401) {
                router.push('/');
                return;
            }
            const data = await res.json();
            setCharacters(data.characters || []);
        } catch (error) {
            console.error('Failed to fetch characters', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/characters', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newChar),
            });
            const data = await res.json();
            if (data.success) {
                setShowModal(false);
                setNewChar({ name: '', race: '', charClass: '', level: 1 });
                await fetchCharacters();
            }
        } catch (error) {
            console.error('Failed to create character', error);
        }
    };

    const handleLogout = async () => {
        await authClient.signOut();
        router.push('/');
    };

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div className="container">
            <header className={styles.header}>
                <h1>My Characters</h1>
                <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
            </header>

            <div className={styles.grid}>
                {characters.map((char) => (
                    <div key={char.id} className={`card ${styles.charCard}`} onClick={() => router.push(`/character/${char.id}`)}>
                        <h3>{char.name}</h3>
                        <p className={styles.charDetails}>Level {char.level} {char.race} {char.class}</p>
                    </div>
                ))}

                <button className={`card ${styles.addCard}`} onClick={() => router.push('/character/create')}>
                    <span className={styles.plus}>+</span>
                    <span>New Character</span>
                </button>
            </div>

            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={`card ${styles.modal}`}>
                        <h2>Create Character</h2>
                        <form onSubmit={handleCreate} className={styles.form}>
                            <div className={styles.field}>
                                <label>Name</label>
                                <input
                                    className="input"
                                    value={newChar.name}
                                    onChange={(e) => setNewChar({ ...newChar, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <label>Race</label>
                                    <input
                                        className="input"
                                        value={newChar.race}
                                        onChange={(e) => setNewChar({ ...newChar, race: e.target.value })}
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label>Class</label>
                                    <input
                                        className="input"
                                        value={newChar.charClass}
                                        onChange={(e) => setNewChar({ ...newChar, charClass: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className={styles.actions}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
