import type { Task } from '../types';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  filter: 'all' | 'pending' | 'completed';
}

export default function TaskList({ tasks, onToggle, onDelete, filter }: TaskListProps) {
  const filtered = tasks.filter((t) => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  if (filtered.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          {filter === 'completed' ? '🏆' : filter === 'pending' ? '✨' : '📝'}
        </div>
        <p className="empty-title">
          {filter === 'completed'
            ? 'No completed tasks yet'
            : filter === 'pending'
            ? 'No pending tasks!'
            : 'No tasks yet'}
        </p>
        <p className="empty-sub">
          {filter === 'completed'
            ? 'Complete a task to see it here.'
            : filter === 'pending'
            ? 'All tasks are done — great work!'
            : 'Add your first task above to get started.'}
        </p>
      </div>
    );
  }

  return (
    <ul className="task-list" role="list">
      {filtered.map((task) => (
        <li key={task.id} className="task-list-item">
          <TaskItem task={task} onToggle={onToggle} onDelete={onDelete} />
        </li>
      ))}
    </ul>
  );
}
