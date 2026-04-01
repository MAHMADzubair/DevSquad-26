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
    <div className="min-h-screen bg-background text-text p-4 md:p-8 flex justify-center">
      <div className="w-full max-w-4xl flex flex-col gap-6">
        {/* Header Section */}
        <header className="glass p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/20 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight gradient-text">Task Central</h1>
              <p className="text-text-muted text-sm font-medium">Manage your daily flow</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-5 py-2.5 rounded-xl border border-red-500/20 transition-all font-semibold"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stats Section */}
          <section className="glass p-6 rounded-2xl flex flex-col justify-between h-full animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              Your Progress
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-end">
                <span className="text-4xl font-black text-white">{completedTasks} <span className="text-lg font-medium text-text-muted">/ {tasks.length}</span></span>
                <span className="text-primary font-bold">{tasks.length > 0 ? Math.round((completedTasks/tasks.length)*100) : 0}%</span>
              </div>
              <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-1000 ease-out" 
                  style={{ width: `${tasks.length > 0 ? (completedTasks/tasks.length)*100 : 0}%` }}
                ></div>
              </div>
              <p className="text-xs text-text-muted leading-relaxed">
                {completedTasks === tasks.length && tasks.length > 0 
                  ? "Incredible! You've cleared everything for today." 
                  : "Keep pushing! Small steps lead to big achievements."}
              </p>
            </div>
          </section>

          {/* Main Content Area */}
          <div className="md:col-span-2 flex flex-col gap-6">
            {/* Task Creation Form */}
            <form onSubmit={createTask} className="glass p-4 rounded-2xl flex gap-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <input
                type="text"
                placeholder="What needs to be done?"
                className="input-field p-3.5 flex-1 rounded-xl text-white placeholder-slate-500 font-medium"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <button 
                type="submit"
                className="btn-primary text-white p-3.5 rounded-xl font-bold flex items-center justify-center gap-2 min-w-[100px] shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add
              </button>
            </form>

            {/* Task List */}
            <div className="flex flex-col gap-3">
              {tasks.length === 0 ? (
                <div className="glass p-12 rounded-2xl flex flex-col items-center justify-center gap-4 text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
                  <div className="p-4 bg-white/5 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-text-muted opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-1">No tasks today</h4>
                    <p className="text-text-muted">Enjoy your free time or start something new!</p>
                  </div>
                </div>
              ) : (
                tasks.map((task, index) => (
                  <div
                    key={task._id}
                    className={`glass p-4 rounded-2xl flex items-center justify-between gap-4 transition-all hover:translate-x-1 animate-fade-in ${task.completed ? 'opacity-60' : ''}`}
                    style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <button
                        onClick={() => toggleTask(task)}
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                          task.completed 
                            ? 'bg-success border-success text-white' 
                            : 'border-white/20 hover:border-primary'
                        }`}
                      >
                        {task.completed && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>

                      {editingId === task._id ? (
                        <input
                          className="input-field p-2 flex-1 rounded-lg text-white text-lg font-medium"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onBlur={() => updateTask(task._id)}
                          autoFocus
                        />
                      ) : (
                        <span
                          className={`text-lg font-medium transition-all ${
                            task.completed ? "line-through text-text-muted" : "text-white"
                          }`}
                        >
                          {task.title}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Desktop only: standard buttons. Mobile: maybe an overflow menu if needed, but here simple icons */}
                    </div>

                    <div className="flex items-center gap-1">
                      {editingId === task._id ? (
                        <button
                          onClick={() => updateTask(task._id)}
                          className="p-2 text-success hover:bg-success/10 rounded-xl transition-all"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      ) : (
                          <button
                          onClick={() => startEdit(task)}
                          className="p-2.5 text-text-muted hover:text-white hover:bg-white/5 rounded-xl transition-all"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                      )}

                      <button
                        onClick={() => deleteTask(task._id)}
                        className="p-2.5 text-text-muted hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
