'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import { authClient } from '@/lib/auth-client';

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        await authClient.signIn.email({
          email,
          password,
        }, {
          onSuccess: () => {
            router.refresh(); // Refresh to update session state
          },
          onError: (ctx) => {
            setError(ctx.error.message);
          }
        });
      } else {
        await authClient.signUp.email({
          email,
          password,
          name,
        }, {
          onSuccess: () => {
            router.refresh();
          },
          onError: (ctx) => {
            setError(ctx.error.message);
          }
        });
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }
  };

  const handleLogout = async () => {
    await authClient.signOut();
    router.refresh();
  };

  if (isPending) {
    return (
      <main className={styles.main}>
        <div className="container">Loading...</div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className="container">
        <div className={styles.hero}>
          <h1>D&D 4e Manager</h1>
          <p>Manage your characters, powers, and conditions with ease.</p>
        </div>

        {session ? (
          <div className={styles.contentContainer}>
            <div className={styles.welcomeSection}>
              <h2>Welcome back, {session.user.name}!</h2>
              <p className={styles.description}>
                D&D 4e Manager is your comprehensive tool for creating and managing Dungeons & Dragons 4th Edition characters.
              </p>
              <div className={styles.features}>
                <div className={styles.feature}>
                  <h3>Character Creation</h3>
                  <p>Use our step-by-step wizard to build your hero, from Race and Class selection to Powers and Equipment.</p>
                </div>
                <div className={styles.feature}>
                  <h3>Power Management</h3>
                  <p>Keep track of your At-Will, Encounter, and Daily powers. Mark them as used and rest to recover them.</p>
                </div>
                <div className={styles.feature}>
                  <h3>Conditions Tracker</h3>
                  <p>Easily apply and track status effects and conditions during combat.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.authContainer}>
            <div className="card">
              <h2>{isLogin ? 'Login' : 'Register'}</h2>
              {error && <div className={styles.error}>{error}</div>}

              <form onSubmit={handleSubmit} className={styles.form}>
                {!isLogin && (
                  <div className={styles.field}>
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      className="input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className={styles.field}>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    className="input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  {isLogin ? 'Login' : 'Register'}
                </button>
              </form>

              <p className={styles.toggle}>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  className={styles.linkBtn}
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? 'Register' : 'Login'}
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
