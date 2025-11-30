'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main className={styles.main}>
      <div className="container">
        <div className={styles.hero}>
          <h1>D&D 4e Manager</h1>
          <p>Manage your characters, powers, and conditions with ease.</p>
        </div>

        <div className={styles.authContainer}>
          <div className="card">
            <h2>{isLogin ? 'Login' : 'Register'}</h2>
            {error && <div className={styles.error}>{error}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  className="input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
      </div>
    </main>
  );
}
