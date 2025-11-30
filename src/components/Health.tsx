'use client';

import { useState } from 'react';
import styles from './Health.module.css';
import { Health as HealthType } from '@/types';

interface HealthProps {
    health: HealthType;
    onUpdate: (health: HealthType) => void;
}

export default function Health({ health, onUpdate }: HealthProps) {
    const [currentHealth, setCurrentHealth] = useState<HealthType>(health);
    const [damageInput, setDamageInput] = useState('');

    const bloodied = Math.floor(currentHealth.maxHp / 2);
    const isBloodied = currentHealth.hp <= bloodied;

    const handleDamage = () => {
        const dmg = parseInt(damageInput) || 0;
        const newHp = Math.max(0, currentHealth.hp - dmg);
        updateHealth({ ...currentHealth, hp: newHp });
        setDamageInput('');
    };

    const handleHeal = () => {
        const heal = parseInt(damageInput) || 0;
        const newHp = Math.min(currentHealth.maxHp, currentHealth.hp + heal);
        updateHealth({ ...currentHealth, hp: newHp });
        setDamageInput('');
    };

    const useSurge = () => {
        if (currentHealth.surges > 0) {
            const surgeValue = Math.floor(currentHealth.maxHp / 4);
            const newHp = Math.min(currentHealth.maxHp, currentHealth.hp + surgeValue);
            updateHealth({ ...currentHealth, hp: newHp, surges: currentHealth.surges - 1 });
        }
    };

    const updateHealth = (newHealth: HealthType) => {
        setCurrentHealth(newHealth);
        onUpdate(newHealth);
    };

    return (
        <div className={`card ${isBloodied ? styles.bloodied : ''}`}>
            <div className={styles.header}>
                <h2>Health</h2>
                <div className={styles.badges}>
                    <span className={styles.badge}>Bloodied: {bloodied}</span>
                    <span className={styles.badge}>Surge Value: {Math.floor(currentHealth.maxHp / 4)}</span>
                </div>
            </div>

            <div className={styles.mainStats}>
                <div className={styles.statBlock}>
                    <label>Current HP</label>
                    <div className={styles.hugeValue}>{currentHealth.hp}</div>
                    <div className={styles.subValue}>/ {currentHealth.maxHp}</div>
                </div>
                <div className={styles.statBlock}>
                    <label>Surges</label>
                    <div className={styles.hugeValue}>{currentHealth.surges}</div>
                    <div className={styles.subValue}>/ {currentHealth.maxSurges}</div>
                </div>
            </div>

            <div className={styles.controls}>
                <div className={styles.damageControl}>
                    <input
                        type="number"
                        className="input"
                        placeholder="Amount"
                        value={damageInput}
                        onChange={(e) => setDamageInput(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={handleDamage}>Damage</button>
                    <button className="btn btn-secondary" onClick={handleHeal}>Heal</button>
                </div>
                <button className="btn btn-secondary" onClick={useSurge} disabled={currentHealth.surges <= 0}>
                    Spend Surge
                </button>
            </div>
        </div>
    );
}
