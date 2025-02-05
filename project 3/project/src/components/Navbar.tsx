import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Dumbbell, LayoutGrid, User } from 'lucide-react';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, path: '/dashboard', label: 'Home' },
    { icon: Dumbbell, path: '/workouts', label: 'Workouts' },
    { icon: LayoutGrid, path: '/categories', label: 'Categories' },
    { icon: User, path: '/profile', label: 'Profile' }
  ];

  return (
    <nav className="fixed bottom-0 w-full px-6 pb-6 pt-4 z-50">
      <div className="relative">
        {/* Glowing background effect */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-xl rounded-2xl" />
        
        {/* Navigation items */}
        <div className="relative flex justify-around items-center bg-black/60 rounded-2xl p-4 border border-white/10">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <motion.button
                key={index}
                onClick={() => navigate(item.path)}
                className="relative flex flex-col items-center"
                whileTap={{ scale: 0.9 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="navGlow"
                    className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-40"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <motion.div
                  className={`relative p-3 rounded-xl transition-colors ${
                    isActive ? 'bg-red-500 text-white' : 'text-gray-400'
                  }`}
                >
                  <Icon size={20} />
                </motion.div>
                <motion.span
                  className={`text-xs mt-1 ${
                    isActive ? 'text-white' : 'text-gray-400'
                  }`}
                  animate={{ opacity: isActive ? 1 : 0.6 }}
                >
                  {item.label}
                </motion.span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
