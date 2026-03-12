import API from "../services/api";
import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { UserPlus, Shield, Mail, KeyRound, Trash2 } from "lucide-react";

export default function Members() {
  const [members, setMembers] = useState([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("employee");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const fetchMembers = async () => {
    try {
      const res = await API.get("/members");
      setMembers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const addMember = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return alert("Must fill core fields.");

    try {
      await API.post("/members", {
        name,
        role,
        email,
        password,
      });

      setName("");
      setRole("employee");
      setEmail("");
      setPassword("");

      fetchMembers();
    } catch (error) {
      console.log(error);
      alert("Error adding member. Email might exist.");
    }
  };

  const deleteMember = async (id) => {
    try {
      await API.delete(`/members/${id}`);
      fetchMembers();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <MainLayout>
      <div className="page-wrapper max-w-7xl mx-auto">
        <h1 className="section-title text-brand-orange">Team Roster</h1>
        <p className="section-sub">
          Manage workspace users, roles, and access credentials.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="glass-card p-8 sticky top-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                <UserPlus className="text-brand-red" size={20} /> Onboard Member
              </h2>

              <form onSubmit={addMember} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-white/50 mb-2 uppercase tracking-wide">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    className="input-field"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/50 mb-2 uppercase tracking-wide">
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                    />
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      className="input-field pl-[36px]"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/50 mb-2 uppercase tracking-wide">
                    Password Credentials
                  </label>
                  <div className="relative">
                    <KeyRound
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                    />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      className="input-field pl-[36px]"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/50 mb-2 uppercase tracking-wide">
                    System Role
                  </label>
                  <select
                    className="input-field"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="employee">Employee</option>
                    <option value="admin">Administrator</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>

                <button type="submit" className="btn-fire w-full mt-6">
                  Provision Account
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="glass-card overflow-hidden">
              <div className="p-6 border-b border-white/5 bg-white/5">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Shield className="text-brand-amber" size={20} /> Active
                  Personnel
                </h2>
              </div>

              {members.length === 0 ? (
                <div className="p-12 text-center text-white/40">
                  <UserPlus size={48} className="mx-auto mb-4 opacity-20" />
                  <p>No team members found.</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {members.map((member) => (
                    <div
                      key={member._id}
                      className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        {/* Avatar Circle */}
                        <div className="w-12 h-12 rounded-full bg-linear-to-tr from-brand-red to-brand-amber p-[2px] shadow-lg">
                          <div className="w-full h-full bg-[#1A1A20] rounded-full flex items-center justify-center font-bold text-brand-yellow">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                        </div>

                        <div>
                          <h3 className="font-bold text-white group-hover:text-brand-yellow transition-colors flex items-center gap-2">
                            {member.name}
                            {member.role === "admin" && (
                              <span className="text-[10px] uppercase font-bold tracking-widest bg-brand-red/20 text-brand-red px-2 py-0.5 rounded">
                                ADMIN
                              </span>
                            )}
                          </h3>
                          <p className="text-sm text-white/50">
                            {member.email}
                          </p>
                          <p className="text-xs text-white/30 mt-1 font-mono">
                            <span className="uppercase tracking-widest">
                              Role: {member.role}
                            </span>
                            <span className="mx-2">•</span>
                            <span>
                              ID:{" "}
                              <span className="text-brand-orange selection:bg-brand-orange/30">
                                {member._id}
                              </span>
                            </span>
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => deleteMember(member._id)}
                        className="p-3 text-white/30 hover:text-brand-red hover:bg-brand-red/10 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Revoke Access"
                      >
                        <Trash2 size={20} />
                      </button>
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
