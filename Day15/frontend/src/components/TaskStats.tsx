import type { Task } from '../types';

interface TaskStatsProps {
  tasks: Task[];
  filter: 'all' | 'pending' | 'completed';
  onFilterChange: (f: 'all' | 'pending' | 'completed') => void;
}

export default function TaskStats({ tasks, filter, onFilterChange }: TaskStatsProps) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  const stats: { label: string; value: number; key: 'all' | 'pending' | 'completed' }[] = [
    { label: 'Total', value: total, key: 'all' },
    { label: 'Pending', value: pending, key: 'pending' },
    { label: 'Completed', value: completed, key: 'completed' },
  ];

  return (
    <div className="stats-section">
      <div className="stats-cards">
        {stats.map((s) => (
          <button
            key={s.key}
            onClick={() => onFilterChange(s.key)}
            className={`stat-card stat-${s.key} ${filter === s.key ? 'active' : ''}`}
          >
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </button>
        ))}
      </div>

      {total > 0 && (
        <div className="progress-section">
          <div className="progress-header">
            <span className="progress-label">Overall Progress</span>
            <span className="progress-percent">{percent}%</span>
          </div>
          <div className="progress-bar" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
            <div className="progress-fill" style={{ width: `${percent}%` }}></div>
          </div>
        </div>
      )}
    </div>
  );
}
