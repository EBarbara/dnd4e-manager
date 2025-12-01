'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import styles from './Navbar.module.css';

export default function Navbar() {
    const router = useRouter();
    const { data: session } = authClient.useSession();

    const handleLogout = async () => {
        await authClient.signOut();
        router.push('/');
        router.refresh();
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    D&D 4e Manager
                </Link>

                <div className={styles.links}>
                    {session ? (
                        <>
                            <Link href="/dashboard" className={styles.link}>
                                Dashboard
                            </Link>
                            <Link href="/admin" className={styles.link}>
                                Admin
                            </Link>
                            <span className={`${styles.link} ${styles.disabled}`}>
                                Compendium
                            </span>
                            <div className={styles.userMenu}>
                                <span className={styles.userName}>{session.user.name}</span>
                                <button onClick={handleLogout} className={styles.logoutBtn}>
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <Link href="/" className={styles.link}>
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
