import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, Flame } from "lucide-react";
import gsap from "gsap";
import API from "../services/api";
import logo from "../assets/logo.jpg";

export default function Signup() {
  const containerRef = useRef(null);
  const cardRef = useRef(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/auth/register", {
        name,
        email,
        password,
      });
      alert("Registration successful! Please login.");
      navigate("/");
    } catch {
      alert(
        "Registration failed. Try a different email or check your connection.",
      );
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
            left: "-5%",
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
            right: "-5%",
            filter: "blur(150px)",
            opacity: 0.15,
          }}
        ></div>
      </div>

      <div className="w-full max-w-md relative z-10" ref={cardRef}>
        <div className="glass-card p-10 flex flex-col gap-8 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="text-center">
            <div className="anim-item inline-flex w-16 h-16 rounded-2xl overflow-hidden shadow-lg mb-6 mx-auto">
              <img src={logo} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <h1 className="anim-item text-4xl font-black text-white mb-2 tracking-tight">
              Join <span className="text-brand-cyan">NetixSol</span>
            </h1>
            <p className="anim-item text-white/50 font-medium">
              Start your journey with premium management.
            </p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSignup}>
            <div className="anim-item">
              <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2 px-1">
                Full Identity
              </label>
              <div className="relative group">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-brand-cyan transition-colors"
                />
                <input
                  type="text"
                  required
                  placeholder=""
                  className="input-field input-icon"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="anim-item">
              <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2 px-1">
                Email Connection
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
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? "Creating Instance..." : "Manifest Account"}
                {!loading && (
                  <Flame
                    size={18}
                    className="group-hover:scale-125 transition-transform"
                  />
                )}
              </span>
            </button>
          </form>

          <div className="anim-item text-center pt-2 border-t border-white/5">
            <p className="text-white/40 text-sm">
              Already a member?{" "}
              <Link
                to="/"
                className="text-brand-pink hover:text-brand-cyan transition-colors font-bold"
              >
                Authorize Access
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
