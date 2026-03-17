import { useState } from 'react';

interface TaskInputProps {
  onAdd: (title: string) => Promise<void>;
  isLoading: boolean;
}

export default function TaskInput({ onAdd, isLoading }: TaskInputProps) {
  const [title, setTitle] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }
    setError('');
    await onAdd(title.trim());
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} className="task-input-form">
      <div className={`input-wrapper ${isFocused ? 'focused' : ''} ${error ? 'has-error' : ''}`}>
        <div className="input-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </div>
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError('');
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Add a new task…"
          className="task-input"
          disabled={isLoading}
          aria-label="New task title"
        />
        <button
          type="submit"
          className={`add-btn ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
          aria-label="Add task"
        >
          {isLoading ? (
            <span className="spinner"></span>
          ) : (
            <span>Add Task</span>
          )}
        </button>
      </div>
      {error && (
        <p className="error-msg" role="alert">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {error}
        </p>
      )}
    </form>
  );
}
