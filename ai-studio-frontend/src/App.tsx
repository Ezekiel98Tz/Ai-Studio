import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AiStudio from './pages/AiStudio';
import Transcripta from './pages/Transcripta';
import Shortify from './pages/Shortify';
import BackgroundZap from './pages/BackgroundZap';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Navbar />
      <AuthModal />
      <Routes>
        <Route path="/" element={<Navigate to="/ai-studio" replace />} />
        <Route path="/ai-studio" element={<AiStudio />} />
        <Route path="/ai-studio/transcripta" element={<Transcripta />} />
        <Route path="/ai-studio/shortify" element={<Shortify />} />
        <Route path="/ai-studio/backgroundzap" element={<BackgroundZap />} />
      </Routes>
    </div>
  );
}

export default App;
