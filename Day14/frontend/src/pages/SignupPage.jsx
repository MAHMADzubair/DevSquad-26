import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Lock, ArrowRight, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, signup } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(name, email, password);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center bg-[#FDFDFD] py-20 px-6">
      <div className="w-full max-w-[420px]">
        <div className="bg-white p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-[var(--color-brand-primary)] mb-3">Join Us</h2>
            <p className="text-sm text-gray-400 font-medium">Create an account to start your tea journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium outline-none focus:bg-white focus:border-black transition-all"
                required
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium outline-none focus:bg-white focus:border-black transition-all"
                required
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium outline-none focus:bg-white focus:border-black transition-all"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[var(--color-brand-primary)] text-white py-4 rounded-2xl font-bold tracking-widest uppercase mt-4 hover:bg-black transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
            >
              {loading ? 'Creating Account...' : 'Register'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-50 text-center">
             <p className="text-sm text-gray-400 font-medium mb-4">Already have an account?</p>
             <Link 
               to="/login" 
               className="inline-flex items-center gap-2 text-sm font-bold text-[var(--color-brand-primary)] hover:underline"
             >
               <LogIn size={16} />
               Sign in here
             </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SignupPage;
