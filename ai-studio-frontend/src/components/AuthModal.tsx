import React, { useState } from 'react';
import { useAuth } from '../store/auth';

const AuthModal: React.FC = () => {
  const { modalOpen, setModalOpen, login, register, loading, error } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!modalOpen) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      await login(email, password);
    } else {
      await register(name, email, password);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-md p-6 shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{mode === 'login' ? 'Login' : 'Register'}</h2>
          <button className="text-gray-500" onClick={() => setModalOpen(false)}>✕</button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          {mode === 'register' && (
            <input className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-800" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
          )}
          <input className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-800" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-800" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white rounded px-3 py-2">{loading ? 'Please wait…' : (mode === 'login' ? 'Login' : 'Create account')}</button>
        </form>
        <div className="mt-3 text-sm">
          {mode === 'login' ? (
            <button className="underline" onClick={() => setMode('register')}>Need an account? Register</button>
          ) : (
            <button className="underline" onClick={() => setMode('login')}>Have an account? Login</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;