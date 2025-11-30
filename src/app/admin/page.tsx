import Link from 'next/link';

export default function AdminDashboard() {
    return (
        <div className="container" style={{ padding: '2rem' }}>
            <h1 style={{ marginBottom: '2rem' }}>Admin Dashboard</h1>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
                <Link href="/admin/races" style={{ textDecoration: 'none' }}>
                    <div className="card" style={{ padding: '1.5rem', cursor: 'pointer', transition: 'transform 0.2s' }}>
                        <h3>Races</h3>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Manage character races</p>
                    </div>
                </Link>
                {/* Future admin tools can be added here */}
            </div>
        </div>
    );
}
