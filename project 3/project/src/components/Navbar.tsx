import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Dumbbell, 
  MessageSquare,
  User,
  HelpCircle,
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const navItems = [
    { 
      icon: Home, 
      path: '/dashboard', 
      label: 'Home',
      description: 'View your workout summary and daily progress'
    },
    { 
      icon: Dumbbell, 
      path: '/categories', 
      label: 'Workouts',
      description: 'Browse workout categories and exercises'
    },
    { 
      icon: MessageSquare, 
      path: '/ai-chat', 
      label: 'AI Coach',
      description: 'Get personalized workout advice'
    },
    { 
      icon: User, 
      path: '/profile', 
      label: 'Profile',
      description: 'Manage your account and settings'
    }
  ];

  // Floating animation
  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const navbarAnimation = {
    initial: { y: 100, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemAnimation = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  const tooltipAnimation = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    exit: {
      opacity: 0,
      y: 10,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    }
  };

  const labelAnimation = {
    initial: { opacity: 0, y: -10 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      y: -10,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <motion.nav 
      className="fixed bottom-0 w-full px-6 pb-6 pt-4 z-50"
      {...navbarAnimation}
    >
      <div className="relative">
        {/* Enhanced glowing background effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-black/40 backdrop-blur-xl rounded-2xl">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-red-500/10"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>
        
        {/* Navigation items */}
        <motion.div 
          variants={containerAnimation}
          initial="hidden"
          animate="show"
          className="relative flex justify-around items-center bg-gradient-to-r from-black/80 via-black/60 to-black/80 rounded-2xl p-4 border border-white/10"
        >
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <motion.div
                key={index}
                className="relative"
                onHoverStart={() => setHoveredItem(index)}
                onHoverEnd={() => setHoveredItem(null)}
              >
                <AnimatePresence>
                  {hoveredItem === index && (
                    <motion.div
                      variants={tooltipAnimation}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="absolute bottom-full mb-2 w-48 p-2 bg-gradient-to-br from-black/95 to-black/85 backdrop-blur-lg rounded-lg border border-red-500/20 shadow-lg"
                    >
                      <div className="text-red-400 text-sm font-medium mb-1">{item.label}</div>
                      <div className="text-gray-300 text-xs">{item.description}</div>
                      <div className="absolute bottom-0 left-1/2 -mb-1 transform -translate-x-1/2 w-2 h-2 bg-black rotate-45 border-r border-b border-red-500/20" />
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  onClick={() => navigate(item.path)}
                  className="relative flex flex-col items-center"
                  variants={itemAnimation}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  animate={isActive ? floatingAnimation : {}}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navGlow"
                      className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-red-500/40 to-red-500/20 rounded-full blur-xl opacity-75"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <motion.div
                    className={`relative p-3 rounded-xl transition-colors overflow-hidden ${
                      isActive 
                        ? 'bg-gradient-to-tr from-red-600 to-red-500 text-white' 
                        : 'text-gray-400 hover:text-red-400'
                    }`}
                  >
                    <Icon size={20} className="relative z-10" />
                  </motion.div>
                  <AnimatePresence>
                    {(hoveredItem === index || isActive) && (
                      <motion.span
                        variants={labelAnimation}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className={`text-xs mt-1 font-medium ${
                          isActive 
                            ? 'bg-gradient-to-r from-red-500 to-red-400 text-transparent bg-clip-text' 
                            : 'text-red-400'
                        }`}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.nav>
  );
}

export default Navbar;
