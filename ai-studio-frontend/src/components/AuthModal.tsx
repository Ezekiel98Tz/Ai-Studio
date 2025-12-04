import React, { useState } from 'react';
import { useAuth } from '../store/auth';

const AuthModal: React.FC = () => {
  const { modalOpen, setModalOpen, login, register, loading, error } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  if (!modalOpen) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      await login(email, password);
    } else {
      if (password !== password2) return;
      await register(name, email, password);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark rounded-2xl w-full max-w-md p-6 shadow-xl border border-border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{mode === 'login' ? 'Login' : 'Create an account'}</h2>
          <button className="text-text-muted hover:text-secondary dark:hover:text-text-light" onClick={() => setModalOpen(false)}>✕</button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          {mode === 'register' && (
            <input className="w-full border border-border rounded-md px-3 py-2 bg-white dark:bg-background focus:ring-2 focus:ring-primary outline-none" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
          )}
          <input className="w-full border border-border rounded-md px-3 py-2 bg-white dark:bg-background focus:ring-2 focus:ring-primary outline-none" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="w-full border border-border rounded-md px-3 py-2 bg-white dark:bg-background focus:ring-2 focus:ring-primary outline-none" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          {mode === 'register' && (
            <input className="w-full border border-border rounded-md px-3 py-2 bg-white dark:bg-background focus:ring-2 focus:ring-primary outline-none" placeholder="Confirm Password" type="password" value={password2} onChange={e => setPassword2(e.target.value)} />
          )}
          {error && <div className="text-destructive text-sm">{error}</div>}
          <button type="submit" disabled={loading} className="w-full px-4 py-2 rounded-md bg-primary hover:bg-primary-glow text-black font-medium transition-colors">{loading ? 'Please wait…' : (mode === 'login' ? 'Login' : 'Create account')}</button>
        </form>
        <div className="mt-3 text-sm text-text-muted">
          {mode === 'login' ? (
            <button className="underline hover:text-primary" onClick={() => setMode('register')}>Need an account? Register</button>
          ) : (
            <button className="underline hover:text-primary" onClick={() => setMode('login')}>Have an account? Login</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
