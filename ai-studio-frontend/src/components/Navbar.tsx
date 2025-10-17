import React from 'react';
import { Link } from 'react-router-dom';
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
    <nav className="flex items-center justify-between px-4 py-3 border-b bg-white dark:bg-gray-900">
      <div className="flex items-center gap-4">
        <Link to="/ai-studio" className="font-semibold">ELS Digital AI Studio</Link>
        <Link to="/ai-studio" className="text-sm text-gray-600 dark:text-gray-300">Tools</Link>
      </div>
      <div className="flex items-center gap-3">
        <button className="px-3 py-1 rounded border" onClick={toggleTheme}>Toggle Theme</button>
        {user ? (
          <>
            <span className="text-sm">Hi, {user.name}</span>
            <button className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-800" onClick={() => logout()}>Logout</button>
          </>
        ) : (
          <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={() => setModalOpen(true)}>Login / Register</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;