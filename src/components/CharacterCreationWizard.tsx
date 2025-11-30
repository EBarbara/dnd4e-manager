'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './CharacterCreationWizard.module.css';

type CharacterData = {
    name: string;
    race: string;
    class: string;
    level: number;
    // Add other fields as they are implemented
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

    const handleNext = () => {
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
            // For now, we only send the basic data we have.
            // In the future, this will include all the data collected in the wizard.
            const res = await fetch('/api/characters', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: characterData.name || 'Unnamed Character', // Default name if not set
                    race: characterData.race,
                    charClass: characterData.class, // Note: API expects charClass
                    level: characterData.level,
                }),
            });

            const data = await res.json();
            if (data.success) {
                router.push('/dashboard');
            } else {
                console.error('Failed to create character:', data.error);
                // Handle error (show toast, etc.)
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
                        <div className={styles.field}>
                            <label>Race</label>
                            <input
                                className={styles.input}
                                value={characterData.race}
                                onChange={(e) => updateData('race', e.target.value)}
                                placeholder="e.g. Dragonborn, Elf, Tiefling"
                            />
                        </div>
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
