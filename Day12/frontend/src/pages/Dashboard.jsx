import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const getTasks = async () => {
    const res = await API.get("/tasks");
    setTasks(res.data);
  };

  const createTask = async (e) => {
    e.preventDefault();

    if (!title) return;

    await API.post("/tasks", { title });

    setTitle("");

    getTasks();
  };

  const deleteTask = async (id) => {
    await API.delete(`/tasks/${id}`);
    getTasks();
  };

  const toggleTask = async (task) => {
    await API.put(`/tasks/${task._id}`, {
      completed: !task.completed,
    });

    getTasks();
  };

  const startEdit = (task) => {
    setEditingId(task._id);
    setEditTitle(task.title);
  };

  const updateTask = async (id) => {
    await API.put(`/tasks/${id}`, {
      title: editTitle,
    });

    setEditingId(null);
    setEditTitle("");

    getTasks();
  };

  useEffect(() => {
    getTasks();
  }, []);

  const completedTasks = tasks.filter((t) => t.completed).length;

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Task Manager</h1>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Total: {tasks.length} | Completed: {completedTasks}
        </p>

        <form onSubmit={createTask} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="New Task..."
            className="border p-2 flex-1 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <button className="bg-blue-500 text-white px-4 rounded">Add</button>
        </form>

        {tasks.map((task) => (
          <div
            key={task._id}
            className="flex items-center justify-between border p-2 mb-2 rounded"
          >
            <div className="flex items-center gap-2 flex-1">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task)}
              />

              {editingId === task._id ? (
                <input
                  className="border p-1 flex-1"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
              ) : (
                <span
                  className={`flex-1 ${task.completed ? "line-through text-gray-400" : ""}`}
                >
                  {task.title}
                </span>
              )}
            </div>

            <div className="flex gap-3">
              {editingId === task._id ? (
                <button
                  onClick={() => updateTask(task._id)}
                  className="text-green-600"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => startEdit(task)}
                  className="text-blue-500"
                >
                  Edit
                </button>
              )}

              <button
                onClick={() => deleteTask(task._id)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
