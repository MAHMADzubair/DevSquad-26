import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, LogIn, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotificationModal = ({ isOpen, onClose, message }) => {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-white overflow-hidden shadow-2xl rounded-2xl"
          >
            {/* Top accent line */}
            <div className="h-1.5 w-full bg-[var(--color-brand-secondary)]" />
            
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>

            <div className="p-8">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center text-[var(--color-brand-secondary)]">
                  <UserPlus size={32} />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
                Join our community
              </h2>
              <p className="text-center text-gray-500 mb-8 px-4">
                {message || "You need to create account first before place order"}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    navigate('/login');
                    onClose();
                  }}
                  className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all active:scale-95"
                >
                  <LogIn size={18} />
                  Login
                </button>
                <button
                  onClick={() => {
                    navigate('/signup');
                    onClose();
                  }}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-brand-primary)] text-white font-semibold rounded-xl hover:bg-black transition-all shadow-lg shadow-black/10 active:scale-95"
                >
                  <UserPlus size={18} />
                  Sign Up
                </button>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 text-center">
              <button 
                onClick={onClose}
                className="text-xs font-medium text-gray-400 uppercase tracking-widest hover:text-gray-600"
              >
                Continue Browsing
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default NotificationModal;
