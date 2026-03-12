import { useState, useEffect } from "react";
import API from "../services/api";
import MainLayout from "../layouts/MainLayout";
import { Plus, CheckSquare, Trash2, Edit } from "lucide-react";
import gsap from "gsap";
import { useRef } from "react";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [project, setProject] = useState("");
  const [permission, setPermission] = useState("view");
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [taskRes, projRes, memRes] = await Promise.all([
          API.get("/tasks"),
          API.get("/projects"),
          API.get("/members"),
        ]);
        setTasks(taskRes.data);
        setProjects(projRes.data);
        setMembers(memRes.data);
      } catch {
        // Error handling
      }
    };

    fetchData();

    const ctx = gsap.context(() => {
      gsap.from(".header-anim", {
        opacity: 0,
        x: -20,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
      });

      gsap.from(".animate-item", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.2,
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const createTask = async (e) => {
    e.preventDefault();
    if (!title || !assignedTo) return alert("Title and Assignee are required!");

    try {
      const payload = {
        title,
        description,
        assignedTo,
        permission,
      };

      if (project) {
        payload.project = project;
      }

      await API.post("/tasks", payload);

      setTitle("");
      setDescription("");
      setAssignedTo("");
      setProject("");
      setPermission("view");

      // Re-fetch data
      const [taskRes] = await Promise.all([API.get("/tasks")]);
      setTasks(taskRes.data);
    } catch (error) {
      console.log(error);
      const msg =
        error.response?.data?.message || error.message || "Error creating task";
      alert("Error: " + msg);
    }
  };

  return (
    <MainLayout>
      <div className="page-wrapper max-w-7xl mx-auto" ref={containerRef}>
        <div className="header-anim">
          <h1 className="section-title text-brand-cyan font-black tracking-tight text-4xl mb-1">
            Task Management
          </h1>
        </div>
        <div className="header-anim">
          <p className="section-sub text-lg opacity-60">
            Create, assign, and track workspace tasks globally to maintain
            momentum.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
          {/* Create Form */}
          <div className="glass-card p-8 h-fit lg:col-span-1 animate-item border border-white/5 shadow-2xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
              <Plus className="text-brand-pink" size={20} /> New Task
            </h2>

            <form onSubmit={createTask} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-white/30 mb-2 uppercase tracking-widest px-1">
                  Task Heading
                </label>
                <input
                  className="input-field bg-white/5 border-white/10"
                  placeholder="e.g. Update Landing Page UI"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/30 mb-2 uppercase tracking-widest px-1">
                  Brief Summary
                </label>
                <textarea
                  className="input-field min-h-[100px] resize-y bg-white/5 border-white/10"
                  placeholder="Task details and expectations..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-yellow mb-2 uppercase tracking-widest px-1">
                  Assign Member (ID) *
                </label>
                <input
                  type="text"
                  className="input-field border-brand-yellow/20 bg-brand-yellow/2 text-white"
                  placeholder="64b8f... (Paste Member ID)"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white/30 mb-2 uppercase tracking-widest px-1">
                    Project
                  </label>
                  <select
                    className="input-field bg-white/5 border-white/10"
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                  >
                    <option value="">None</option>
                    {projects.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/30 mb-2 uppercase tracking-widest px-1">
                    Access
                  </label>
                  <select
                    className="input-field bg-white/5 border-white/10"
                    value={permission}
                    onChange={(e) => setPermission(e.target.value)}
                  >
                    <option value="view">View</option>
                    <option value="edit">Edit</option>
                  </select>
                </div>
              </div>

              <button
                className="btn-fire w-full py-4 shadow-[0_10px_30px_rgba(255,90,90,0.2)]"
                type="submit"
              >
                <CheckSquare size={18} /> Deploy Task
              </button>
            </form>
          </div>

          {/* Task List */}
          <div className="lg:col-span-2 animate-item">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white tracking-tight">
                All Active Tasks{" "}
                <span className="text-brand-orange opacity-50 ml-2 font-mono text-sm">
                  {tasks.length}
                </span>
              </h2>
            </div>

            <div className="glass-card overflow-hidden border border-white/5">
              {tasks.length === 0 ? (
                <div className="p-16 text-center text-white/20">
                  <CheckSquare size={64} className="mx-auto mb-6 opacity-10" />
                  <p className="text-lg font-medium">Registry Clear</p>
                  <p className="text-sm">
                    No tasks found. Initialize one to start tracking.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {tasks.map((task) => (
                    <div
                      key={task._id}
                      className="p-6 hover:bg-white/3 transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-6 group relative"
                    >
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-xl text-white group-hover:text-brand-yellow transition-colors tracking-tight">
                            {task.title}
                          </h3>
                          <span
                            className={`stat-badge px-3 py-1 scale-90 ${task.status === "completed" ? "pill-completed" : task.status === "in-progress" ? "pill-in-progress" : "pill-todo"}`}
                          >
                            {task.status || "todo"}
                          </span>
                        </div>
                        <p className="text-sm text-white/40 mb-4 line-clamp-2 max-w-xl group-hover:text-white/60 transition-colors">
                          {task.description ||
                            "No tactical details provided for this task."}
                        </p>
                        <div className="flex flex-wrap items-center gap-6 text-[11px] font-bold uppercase tracking-widest text-white/20">
                          <span className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded">
                            Assignee:{" "}
                            <span className="text-brand-orange">
                              {task.assignedTo?.name || "Unlinked"}
                            </span>
                          </span>
                          {task.project && (
                            <span className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded">
                              Project:{" "}
                              <span className="text-brand-yellow">
                                {task.project?.name || "..."}
                              </span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 relative z-10 opactiy-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-3 rounded-xl bg-white/5 hover:bg-brand-orange/10 hover:text-brand-orange border border-white/5 transition-all text-white/30">
                          <Edit size={18} />
                        </button>
                        <button className="p-3 rounded-xl bg-white/5 hover:bg-brand-red/10 hover:text-brand-red border border-white/5 transition-all text-white/30">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
