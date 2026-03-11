import { useEffect, useState } from "react";
import API from "../services/api";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await API.get("/tasks");
    setTasks(res.data);
  };

  const deleteTask = async (id) => {
    await API.delete(`/tasks/${id}`);
    fetchTasks();
  };

  const startEdit = (task) => {
    setEditingId(task._id);
    setNewTitle(task.title);
  };

  const updateTask = async (id) => {
    await API.put(`/tasks/${id}`, {
      title: newTitle,
    });

    setEditingId(null);
    fetchTasks();
  };

  return (
    <ul>
      {tasks.map((task) => (
        <li
          key={task._id}
          className="flex justify-between items-center border p-2 mb-2"
        >
          {editingId === task._id ? (
            <>
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="border p-1"
              />

              <button
                onClick={() => updateTask(task._id)}
                className="bg-green-500 text-white px-2 py-1 ml-2"
              >
                Save
              </button>
            </>
          ) : (
            <>
              <span>{task.title}</span>

              <div>
                <button
                  onClick={() => startEdit(task)}
                  className="text-blue-500 mr-3"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteTask(task._id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
