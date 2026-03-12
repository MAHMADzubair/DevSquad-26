import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import gsap from "gsap";
import API from "../services/api";
import logo from "../assets/logo.jpg";

export default function Login() {
  const containerRef = useRef(null);
  const cardRef = useRef(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch {
      alert("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background orbs animation
      gsap.to(".bg-orb", {
        x: "random(-100, 100)",
        y: "random(-100, 100)",
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 2,
      });

      // Card entrance
      gsap.from(cardRef.current, {
        opacity: 0,
        y: 40,
        scale: 0.95,
        duration: 1,
        ease: "power4.out",
      });

      // Elements entrance
      gsap.from(".anim-item", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.4,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center p-6 bg-dark overflow-hidden"
      ref={containerRef}
    >
      {/* Animated Background Mesh */}
      <div className="glow-mesh">
        <div
          className="bg-orb"
          style={{
            width: "40vw",
            height: "40vw",
            background: "var(--color-brand-cyan)",
            top: "-10%",
            right: "-5%",
            filter: "blur(150px)",
            opacity: 0.15,
          }}
        ></div>
        <div
          className="bg-orb"
          style={{
            width: "35vw",
            height: "35vw",
            background: "var(--color-brand-purple)",
            bottom: "-10%",
            left: "-5%",
            filter: "blur(150px)",
            opacity: 0.15,
          }}
        ></div>
      </div>

      <div className="w-full max-w-md relative z-10" ref={cardRef}>
        <div className="glass-card p-10 flex flex-col gap-8 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="text-center">
            <div className="anim-item inline-flex w-16 h-16 rounded-2xl overflow-hidden shadow-lg mb-6 mx-auto">
              <img
                src={logo}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="anim-item text-4xl font-black text-white mb-2 tracking-tight">
              Netix<span className="text-brand-cyan">Sol </span>
            </h1>
            <p className="anim-item text-white/50 font-medium">
              Empower your team, fuel your progress.
            </p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleLogin}>
            <div className="anim-item">
              <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2 px-1">
                Email Access
              </label>
              <div className="relative group">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-brand-cyan transition-colors"
                />
                <input
                  type="email"
                  required
                  placeholder=""
                  className="input-field input-icon"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="anim-item">
              <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2 px-1">
                Secure Password
              </label>
              <div className="relative group">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-brand-cyan transition-colors"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder=""
                  className="input-field input-icon pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              className="btn-fire w-full py-4 mt-2 group"
              type="submit"
              disabled={loading}
            >
              <span className="relative z-10 flex items-center justify-center gap-2 text-white font-bold">
                {loading ? "Authenticating..." : "Sign Into Workspace"}
              </span>
            </button>
          </form>

          <div className="anim-item text-center pt-2 border-t border-white">
            <p className="text-white text-sm">
              New to the platform?{" "}
              <Link
                to="/signup"
                className="text-brand-pink hover:text-brand-cyan transition-colors font-bold"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
