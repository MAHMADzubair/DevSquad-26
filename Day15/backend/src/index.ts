import express, { Request, Response } from 'express';
import cors from 'cors';
import { Task, CreateTaskBody } from './types';

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── In-Memory Store ───────────────────────────────────────────────────────────
let tasks: Task[] = [];

// ─── Routes ────────────────────────────────────────────────────────────────────

// GET /api/tasks — return all tasks
app.get('/api/tasks', (_req: Request, res: Response) => {
  res.json(tasks);
});

// POST /api/tasks — create a new task
app.post('/api/tasks', async (req: Request<{}, {}, CreateTaskBody>, res: Response) => {
  const { title } = req.body;

  if (!title || title.trim() === '') {
    res.status(400).json({ error: 'Title is required.' });
    return;
  }

  const { v4: uuidv4 } = await import('uuid');

  const newTask: Task = {
    id: uuidv4(),
    title: title.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT /api/tasks/:id — toggle completed status
app.put('/api/tasks/:id', (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    res.status(404).json({ error: 'Task not found.' });
    return;
  }

  task.completed = !task.completed;
  res.json(task);
});

// DELETE /api/tasks/:id — remove a task
app.delete('/api/tasks/:id', (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Task not found.' });
    return;
  }

  tasks.splice(index, 1);
  res.status(200).json({ message: 'Task deleted.' });
});

// ─── Start Server ──────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
}

export default app;
