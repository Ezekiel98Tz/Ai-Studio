import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AiStudio from './pages/AiStudio';
import Transcripta from './pages/Transcripta';
import Shortify from './pages/Shortify';
import BackgroundZap from './pages/BackgroundZap';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-background text-secondary dark:text-text-light">
      <Navbar />
      <AuthModal />
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/ai-studio" replace />} />
          <Route path="/ai-studio" element={<ErrorBoundary><AiStudio /></ErrorBoundary>} />
          <Route path="/ai-studio/transcripta" element={<ErrorBoundary><Transcripta /></ErrorBoundary>} />
          <Route path="/ai-studio/shortify" element={<ErrorBoundary><Shortify /></ErrorBoundary>} />
          <Route path="/ai-studio/backgroundzap" element={<ErrorBoundary><BackgroundZap /></ErrorBoundary>} />
        </Routes>
      </Layout>
    </div>
  );
}

export default App;
