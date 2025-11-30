import CharacterCreationWizard from '@/components/CharacterCreationWizard';

export default function CreateCharacterPage() {
    return (
        <div style={{ padding: '2rem', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
            <CharacterCreationWizard />
        </div>
    );
}
