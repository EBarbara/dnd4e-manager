'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Race } from '@/types';
import styles from './CharacterCreationWizard.module.css';

type CharacterData = {
    name: string;
    race: string;
    class: string;
    level: number;
};

const STEPS = [
    'Choose Race',
    'Choose Class',
    'Determine Ability Scores',
    'Choose Skills',
    'Select Feats',
    'Choose Powers',
    'Choose Equipment',
    'Fill in the Numbers',
    'Roleplaying Character Details'
];

export default function CharacterCreationWizard() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [characterData, setCharacterData] = useState<CharacterData>({
        name: '',
        race: '',
        class: '',
        level: 1,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [races, setRaces] = useState<Race[]>([]);
    const [loadingRaces, setLoadingRaces] = useState(false);
    const [selectedRace, setSelectedRace] = useState<Race | null>(null);

    useEffect(() => {
        if (currentStep === 1) {
            fetchRaces();
        }
    }, [currentStep]);

    const fetchRaces = async () => {
        setLoadingRaces(true);
        try {
            const res = await fetch('/api/races');
            const data = await res.json();
            setRaces(data.races || []);
        } catch (error) {
            console.error('Failed to fetch races', error);
        } finally {
            setLoadingRaces(false);
        }
    };

    const handleNext = () => {
        if (currentStep === 1 && !characterData.race) {
            alert('Please select a race');
            return;
        }
        if (currentStep < STEPS.length) {
            setCurrentStep(currentStep + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        } else {
            router.push('/dashboard');
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/characters', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: characterData.name || 'Unnamed Character',
                    race: characterData.race,
                    charClass: characterData.class,
                    level: characterData.level,
                }),
            });

            const data = await res.json();
            if (data.success) {
                router.push('/dashboard');
            } else {
                console.error('Failed to create character:', data.error);
            }
        } catch (error) {
            console.error('Error creating character:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateData = (field: keyof CharacterData, value: any) => {
        setCharacterData(prev => ({ ...prev, [field]: value }));
    };

    const handleRaceSelect = (race: Race) => {
        setSelectedRace(race);
        updateData('race', race.name);
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: // Choose Race
                return (
                    <div className={styles.stepContent}>
                        <h3 className={styles.stepTitle}>Step 1: Choose Race</h3>
                        <div className={styles.field}>
                            <label>Character Name</label>
                            <input
                                className={styles.input}
                                value={characterData.name}
                                onChange={(e) => updateData('name', e.target.value)}
                                placeholder="Enter character name"
                            />
                        </div>

                        <div className={styles.raceSelection}>
                            {loadingRaces ? (
                                <div>Loading races...</div>
                            ) : (
                                <div className={styles.raceGrid}>
                                    {races.map(race => (
                                        <div
                                            key={race.id}
                                            className={`${styles.raceCard} ${characterData.race === race.name ? styles.selected : ''}`}
                                            onClick={() => handleRaceSelect(race)}
                                        >
                                            <h4>{race.name}</h4>
                                            <p className={styles.raceShortDesc}>{race.descriptionShort}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {selectedRace && (
                            <div className={styles.raceDetails}>
                                <h4>{selectedRace.name} Details</h4>
                                <p><strong>Description:</strong> {selectedRace.descriptionLong}</p>
                                <div className={styles.raceStats}>
                                    <div>
                                        <strong>Height:</strong> {selectedRace.averageHeightMin}" - {selectedRace.averageHeightMax}"
                                        ({Math.round(selectedRace.averageHeightMin * 2.5)}cm - {Math.round(selectedRace.averageHeightMax * 2.5)}cm)
                                    </div>
                                    <div>
                                        <strong>Weight:</strong> {selectedRace.averageWeightMin}lb - {selectedRace.averageWeightMax}lb
                                        ({Math.round(selectedRace.averageWeightMin * 0.5)}kg - {Math.round(selectedRace.averageWeightMax * 0.5)}kg)
                                    </div>
                                    <div><strong>Size:</strong> {selectedRace.size}</div>
                                    <div><strong>Speed:</strong> {selectedRace.speed} squares</div>
                                    <div><strong>Vision:</strong> {selectedRace.vision}</div>
                                    <div><strong>Ability Scores:</strong> {selectedRace.abilityScores}</div>
                                </div>
                                <div className={styles.raceTraits}>
                                    <h5>Racial Traits</h5>
                                    <ul>
                                        {(typeof selectedRace.traits === 'string' ? JSON.parse(selectedRace.traits) : selectedRace.traits).map((trait: any, idx: number) => (
                                            <li key={idx}>
                                                <strong>{trait.name}:</strong> {trait.description}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 2: // Choose Class
                return (
                    <div className={styles.stepContent}>
                        <h3 className={styles.stepTitle}>Step 2: Choose Class</h3>
                        <div className={styles.field}>
                            <label>Class</label>
                            <input
                                className={styles.input}
                                value={characterData.class}
                                onChange={(e) => updateData('class', e.target.value)}
                                placeholder="e.g. Paladin, Wizard, Rogue"
                            />
                        </div>
                    </div>
                );
            default:
                return (
                    <div className={styles.stepContent}>
                        <h3 className={styles.stepTitle}>Step {currentStep}: {STEPS[currentStep - 1]}</h3>
                        <div className={styles.placeholderText}>
                            To be implemented
                        </div>
                    </div>
                );
        }
    };

    const progressPercentage = ((currentStep - 1) / (STEPS.length - 1)) * 100;

    return (
        <div className={styles.wizardContainer}>
            <div className={styles.header}>
                <h2>Character Creation</h2>
                <div className={styles.stepIndicator}>
                    Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1]}
                </div>
                <div className={styles.progressBarContainer}>
                    <div
                        className={styles.progressBar}
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
            </div>

            {renderStepContent()}

            <div className={styles.actions}>
                <button
                    className={`${styles.btn} ${styles.btnSecondary}`}
                    onClick={handleBack}
                    disabled={isSubmitting}
                >
                    {currentStep === 1 ? 'Cancel' : 'Back'}
                </button>
                <button
                    className={`${styles.btn} ${styles.btnPrimary}`}
                    onClick={handleNext}
                    disabled={isSubmitting}
                >
                    {currentStep === STEPS.length ? (isSubmitting ? 'Creating...' : 'Finish') : 'Next'}
                </button>
            </div>
        </div>
    );
}
