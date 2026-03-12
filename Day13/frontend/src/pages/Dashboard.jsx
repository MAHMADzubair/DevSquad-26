import API from "../services/api";
import { useEffect, useState, useRef } from "react";
import MainLayout from "../layouts/MainLayout";
import { FolderKanban, Users, ShieldAlert, CheckSquare } from "lucide-react";
import gsap from "gsap";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);

  const cardsRef = useRef([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectRes = await API.get("/projects");
        const memberRes = await API.get("/members");
        const taskRes = await API.get("/tasks");

        setProjects(projectRes.data);
        setMembers(memberRes.data);
        setTasks(taskRes.data);
      } catch {
        // Error handling if needed
      }
    };

    fetchData();

    const ctx = gsap.context(() => {
      // Animate title and sub
      gsap.from(".header-anim", {
        opacity: 0,
        x: -20,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
      });

      // Animate cards
      gsap.from(cardsRef.current, {
        opacity: 0,
        scale: 0.9,
        y: 20,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)",
        delay: 0.3,
      });

      // Animate bottom section
      gsap.from(".bottom-anim", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.6,
        ease: "power3.out",
      });
    });

    return () => ctx.revert();
  }, []);

  const statCards = [
    {
      label: "Total Projects",
      value: projects.length,
      icon: FolderKanban,
      color: "#f06292",
      glow: "rgba(240,98,146,0.3)",
    },
    {
      label: "Team Members",
      value: members.length,
      icon: Users,
      color: "#9d50bb",
      glow: "rgba(157,80,187,0.3)",
    },
    {
      label: "Total Tasks",
      value: tasks.length || 0,
      icon: CheckSquare,
      color: "#4facfe",
      glow: "rgba(79,172,254,0.3)",
    },
    {
      label: "Completed",
      value: tasks.filter((t) => t.status === "completed").length || 0,
      icon: ShieldAlert,
      color: "#00d2ff",
      glow: "rgba(0,210,255,0.3)",
    },
  ];

  return (
    <MainLayout>
      <div className="page-wrapper max-w-7xl mx-auto">
        <div className="header-anim">
          <h1 className="section-title gradient-text inline-block">
            Workspace Overview
          </h1>
        </div>
        <div className="header-anim">
          <p className="section-sub">
            Welcome back! Here's what's happening today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                ref={(el) => (cardsRef.current[idx] = el)}
                className="glass-card p-6 card-hover relative overflow-hidden group border border-white/5 hover:border-white/10"
              >
                {/* Background flare */}
                <div
                  className="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-10 group-hover:opacity-30 transition-all duration-500"
                  style={{ background: stat.color }}
                />

                <div className="flex justify-between items-start mb-6">
                  <div
                    className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-300"
                    style={{
                      color: stat.color,
                      boxShadow: `0 0 20px ${stat.glow}`,
                    }}
                  >
                    <Icon size={24} strokeWidth={2.5} />
                  </div>
                  <div className="text-4xl font-black text-white group-hover:text-brand-yellow transition-colors tracking-tighter">
                    {stat.value}
                  </div>
                </div>

                <div className="text-xs font-bold text-white/40 tracking-widest uppercase group-hover:text-white/70 transition-colors">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Action Area */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 bottom-anim">
          <div className="glass-card p-8 border border-white/5">
            <h2 className="text-xl font-bold mb-6 text-white border-b border-white/10 pb-4">
              Recent Activity
            </h2>
            <div className="flex flex-col items-center justify-center h-48 text-white/20 space-y-4">
              <div className="p-4 rounded-full bg-white/5">
                <FolderKanban size={40} className="opacity-40" />
              </div>
              <p className="text-sm">No recent activity detected.</p>
            </div>
          </div>

          <div className="glass-card p-8 bg-linear-to-br from-dark-2 to-black border border-white/5">
            <h2 className="text-xl font-bold mb-6 text-brand-orange border-b border-brand-orange/20 pb-4">
              System Status
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                <span className="text-white/60 font-medium">
                  Database Connection
                </span>
                <span className="text-[#5aff8c] flex items-center gap-2 text-sm font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#5aff8c] shadow-[0_0_12px_#5aff8c] animate-pulse"></span>
                  Online
                </span>
              </div>
              <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                <span className="text-white/60 font-medium">API Services</span>
                <span className="text-[#5aff8c] flex items-center gap-2 text-sm font-bold">
                  <span
                    className="w-2.5 h-2.5 rounded-full bg-[#5aff8c] shadow-[0_0_12px_#5aff8c] animate-pulse"
                    style={{ animationDelay: "0.5s" }}
                  ></span>
                  Operational
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
