import { useState } from "react";
import API from "../services/api";

export default function TaskForm() {
  const [title, setTitle] = useState("");

  const createTask = async (e) => {
    e.preventDefault();

    await API.post("/tasks", { title });

    window.location.reload();
  };

  return (
    <form onSubmit={createTask} className="mb-6">
      <input
        className="border p-2 mr-2"
        placeholder="New Task"
        onChange={(e) => setTitle(e.target.value)}
      />

      <button className="bg-green-500 text-white px-4 py-2 rounded">Add</button>
    </form>
  );
}
