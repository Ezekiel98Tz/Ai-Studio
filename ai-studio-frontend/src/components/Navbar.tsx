import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../store/auth';

const Navbar: React.FC = () => {
  const { user, setModalOpen, logout } = useAuth();

  const toggleTheme = () => {
    const root = document.documentElement;
    const isDark = root.classList.contains('dark');
    if (isDark) root.classList.remove('dark');
    else root.classList.add('dark');
  };

  return (
    <nav className="sticky top-0 z-30 backdrop-blur border-b border-border bg-white/70 dark:bg-background/80">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/ai-studio" className="font-bold text-lg tracking-tight text-primary">AiStudio</Link>
          <div className="h-6 w-px bg-border mx-2 hidden sm:block"></div>
          <div className="hidden sm:flex gap-1 text-sm font-medium">
            <NavLink to="/ai-studio" className={({isActive}) => `px-2 py-1 rounded ${isActive ? 'bg-primary text-black' : 'text-text-muted hover:text-secondary dark:hover:text-text-light hover:bg-gray-100 dark:hover:bg-secondary'}`} end>Tools</NavLink>
            <NavLink to="/ai-studio/transcripta" className={({isActive}) => `px-2 py-1 rounded ${isActive ? 'bg-primary text-black' : 'text-text-muted hover:text-secondary dark:hover:text-text-light hover:bg-gray-100 dark:hover:bg-secondary'}`}>Transcripta</NavLink>
            <NavLink to="/ai-studio/shortify" className={({isActive}) => `px-2 py-1 rounded ${isActive ? 'bg-primary text-black' : 'text-text-muted hover:text-secondary dark:hover:text-text-light hover:bg-gray-100 dark:hover:bg-secondary'}`}>Shortify</NavLink>
            <NavLink to="/ai-studio/backgroundzap" className={({isActive}) => `px-2 py-1 rounded ${isActive ? 'bg-primary text-black' : 'text-text-muted hover:text-secondary dark:hover:text-text-light hover:bg-gray-100 dark:hover:bg-secondary'}`}>BackgroundZap</NavLink>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-3 py-1 rounded border border-border hover:bg-gray-100 dark:hover:bg-secondary text-text-muted hover:text-secondary dark:hover:text-text-light" onClick={toggleTheme}>Toggle Theme</button>
          {user ? (
            <>
              <span className="text-sm text-text-muted">Hi, {user.name}</span>
              <button className="px-3 py-1 rounded bg-secondary hover:bg-gray-800 dark:bg-secondary dark:hover:bg-border text-text-light" onClick={() => logout()}>Logout</button>
            </>
          ) : (
            <button className="px-3 py-1 rounded bg-primary hover:bg-primary-glow text-black font-medium transition-colors" onClick={() => setModalOpen(true)}>Login / Register</button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
