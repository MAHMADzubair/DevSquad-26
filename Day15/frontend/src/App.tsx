import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import type { Task } from './types';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import TaskStats from './components/TaskStats';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/tasks';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Load initial theme based on local storage or system preference
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') {
      setTheme(saved);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light');
    }
  }, []);

  // Update DOM and local storage when theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // ── Fetch all tasks ──────────────────────────────────────────────────────────
  const fetchTasks = useCallback(async () => {
    try {
      setError('');
      const { data } = await axios.get<Task[]>(API);
      setTasks(data);
    } catch {
      setError('Could not connect to the server. Make sure the backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // ── Add task ─────────────────────────────────────────────────────────────────
  const handleAdd = async (title: string) => {
    setAddLoading(true);
    try {
      const { data } = await axios.post<Task>(API, { title });
      setTasks((prev) => [data, ...prev]);
    } catch {
      setError('Failed to add task.');
    } finally {
      setAddLoading(false);
    }
  };

  // ── Toggle complete ───────────────────────────────────────────────────────────
  const handleToggle = async (id: string) => {
    try {
      const { data } = await axios.put<Task>(`${API}/${id}`);
      setTasks((prev) => prev.map((t) => (t.id === id ? data : t)));
    } catch {
      setError('Failed to update task.');
    }
  };

  // ── Delete task ───────────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API}/${id}`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch {
      setError('Failed to delete task.');
    }
  };

  // ── Reset all tasks ───────────────────────────────────────────────────────────
  const handleReset = async () => {
    try {
      // We will loop through and delete all tasks to clear them, or assuming backend has a bulk delete we could call it.
      // Easiest is to delete locally and let the backend know sequentially, or if there's no reset endpoint we just clear it all.
      // Since it's a simple app, let's delete one by one or see if there's a better way. Wait, we don't have a bulk API. 
      // We'll delete them one by one.
      setLoading(true);
      await Promise.all(tasks.map(t => axios.delete(`${API}/${t.id}`)));
      setTasks([]);
      fetchTasks();
    } catch {
      setError('Failed to reset tasks.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-bg">
      <div className="grain-overlay"></div>

      {/* ── Header ────────────────────────────────────────────────────────────── */}
      <header className="app-header">
        <div className="header-glow"></div>
        <div className="header-inner">
          <div className="logo">
            <div className="logo-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4"></path>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
              </svg>
            </div>
            <div>
              <h1 className="logo-title">Ahmad Zubair</h1>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="header-badge">TODO</div>
            <button 
              onClick={handleReset} 
              className="header-badge"
              style={{ background: 'var(--red-bg)', color: 'var(--red)', borderColor: 'rgba(239, 68, 68, 0.3)', cursor: 'pointer' }}
              aria-label="Reset Tasks"
              title="Reset All Tasks"
            >
              Reset All
            </button>
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
              className="theme-toggle"
              aria-label="Toggle Theme"
              title="Toggle Theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      {/* ── Main ──────────────────────────────────────────────────────────────── */}
      <main className="app-main">

        {/* Server error banner */}
        {error && (
          <div className="error-banner" role="alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{error}</span>
            <button onClick={() => setError('')} className="banner-close">✕</button>
          </div>
        )}

        {/* Card */}
        <div className="card">

          {/* Input */}
          <section className="card-section">
            <TaskInput onAdd={handleAdd} isLoading={addLoading} />
          </section>

          {/* Stats + Filter */}
          {!loading && (
            <section className="card-section no-border">
              <TaskStats tasks={tasks} filter={filter} onFilterChange={setFilter} />
            </section>
          )}

          {/* Divider */}
          <div className="card-divider"></div>

          {/* List */}
          <section className="card-section no-border list-section">
            {loading ? (
              <div className="skeleton-wrap">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="skeleton-item">
                    <div className="skeleton skeleton-check"></div>
                    <div className="skeleton skeleton-text"></div>
                    <div className="skeleton skeleton-badge"></div>
                  </div>
                ))}
              </div>
            ) : (
              <TaskList
                tasks={tasks}
                onToggle={handleToggle}
                onDelete={handleDelete}
                filter={filter}
              />
            )}
          </section>
        </div>

        {/* Footer note removed */}
      </main>
    </div>
  );
}