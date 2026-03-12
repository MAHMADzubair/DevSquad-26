import API from "../services/api";
import { useEffect, useState, useRef } from "react";
import MainLayout from "../layouts/MainLayout";
import { FolderPlus, Trash2, CodeSquare } from "lucide-react";
import gsap from "gsap";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await API.get("/projects");
        setProjects(res.data);
      } catch {
        // Error handling
      }
    };

    fetchProjects();

    const ctx = gsap.context(() => {
      // Title section
      gsap.from(".header-anim", {
        opacity: 0,
        x: -30,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
      });

      // Grid items
      gsap.from(".animate-item", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.2,
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const addProject = async (e) => {
    e.preventDefault();
    if (!name) return;
    try {
      await API.post("/projects", { name, description });
      setName("");
      setDescription("");
      // Refresh local state or re-fetch
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch {
      // Error handling
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;
    try {
      await API.delete(`/projects/${id}`);
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch {
      // Error handling
    }
  };

  return (
    <MainLayout>
      <div className="page-wrapper max-w-7xl mx-auto" ref={containerRef}>
        <div className="header-anim">
          <h1 className="section-title text-brand-cyan uppercase tracking-tighter decoration-brand-pink font-black text-4xl mb-1">
            Projects Center
          </h1>
        </div>
        <div className="header-anim">
          <p className="section-sub text-lg opacity-60">
            Define high-level structural projects and directories to organize
            your workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-4">
          <div className="lg:col-span-1 animate-item">
            <div className="glass-card p-8 sticky top-24 border border-white/5 shadow-2xl">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                <FolderPlus className="text-brand-pink" size={20} /> New
                Initiative
              </h2>

              <form onSubmit={addProject} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-white/30 mb-2 uppercase tracking-widest">
                    Project Label
                  </label>
                  <input
                    type="text"
                    className="input-field bg-white/5 border-white/10 focus:border-brand-orange"
                    placeholder="e.g. Phoenix Rise"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/30 mb-2 uppercase tracking-widest">
                    Strategic Goals
                  </label>
                  <textarea
                    className="input-field min-h-[140px] bg-white/5 border-white/10 focus:border-brand-orange"
                    placeholder="Provide detailed summary of the project objectives..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-fire w-full py-4 shadow-[0_10px_30px_rgba(255,90,90,0.3)] hover:shadow-[0_15px_40px_rgba(255,90,90,0.5)]"
                >
                  Execute Launch
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="animate-item glass-card p-6 card-hover flex flex-col group relative overflow-hidden border border-white/5"
                >
                  <div className="absolute -top-12 -right-12 w-24 h-24 bg-brand-cyan opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500 rounded-full" />
<div className="flex justify-between items-start mb-5 relative z-10">
                    <div className="p-3 bg-linear-to-br from-white/5 to-white/2 rounded-xl border border-white/10 shadow-inner group-hover:border-brand-cyan/30 transition-colors">
                      <CodeSquare
                        size={24}
                        className="text-brand-cyan group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <button
                      onClick={() => deleteProject(project._id)}
                      className="text-white/20 hover:text-brand-red transition-all p-2 hover:bg-brand-red/10 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <h2 className="text-2xl font-black mb-3 text-white group-hover:text-brand-yellow transition-colors tracking-tight leading-tight relative z-10">
                    {project.name}
                  </h2>

                  <p className="text-sm text-white/40 mb-6 flex-1 line-clamp-4 leading-relaxed relative z-10 group-hover:text-white/60 transition-colors">
                    {project.description ||
                      "Establish objectives and key results for this workspace initiative."}
                  </p>

                  <div className="mt-auto pt-4 border-t border-white/5 relative z-10">
                    <div className="flex items-center justify-between text-[10px] font-bold tracking-widest text-white/20 uppercase">
                      <span>REF: {project._id.slice(-6)}</span>
                      <span className="flex items-center gap-1.5 text-brand-orange font-black">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse"></span>
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {projects.length === 0 && (
                <div className="lg:col-span-3 animate-item text-center py-24 bg-white/2 rounded-3xl border border-white/5 border-dashed">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FolderPlus size={32} className="text-white/20" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Void Detected
                  </h3>
                  <p className="text-white/40 max-w-xs mx-auto">
                    No active projects found in the registry. Initialize your
                    first strategic project to start tracking tasks.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
