import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Dumbbell, LayoutGrid, User,
  ChevronRight, Play, CheckCircle, Clock, Flame,
  Trophy, Heart, Plus, Bell, X, Save
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

interface Streak {
  current: number;
  best: number;
  lastWorkout: string | null;
}

function Dashboard() {
  const navigate = useNavigate();
  const [selectedTask, setSelectedTask] = useState<number | null>(null);
  const [streak, setStreak] = useState<Streak>({
    current: 0,
    best: 0,
    lastWorkout: null
  });

  const workoutTasks = [
    {
      title: 'Morning Cardio',
      time: '7:00 AM',
      duration: '30 min',
      calories: '250',
      completed: true
    },
    {
      title: 'Upper Body Strength',
      time: '2:00 PM',
      duration: '45 min',
      calories: '400',
      completed: false
    },
    {
      title: 'Evening Yoga',
      time: '6:00 PM',
      duration: '20 min',
      calories: '150',
      completed: false
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      <Toaster position="top-center" />
      <div 
        className="min-h-screen flex flex-col"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80")',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <div className="absolute inset-0 bg-black/80" />

        <main className="flex-1 relative z-10 p-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-8"
          >
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Welcome back!</h1>
              <p className="text-gray-400">Let's crush today's goals</p>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            {[
              { title: 'Current Streak', value: `${streak.current} days`, subtitle: 'Best: ' + streak.best + ' days', icon: Trophy },
              { title: 'Calories', value: '320', subtitle: 'burned today', icon: Flame }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-red-600/20 p-6 rounded-lg backdrop-blur-sm hover:bg-red-600/30 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-semibold">{stat.title}</h3>
                  <stat.icon className="text-red-500 w-5 h-5" />
                </div>
                <p className="text-2xl text-white font-bold mb-1">{stat.value}</p>
                <p className="text-gray-400 text-sm">{stat.subtitle}</p>
              </motion.div>
            ))}
          </div>

          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Today's Workouts</h2>
              <motion.button
                className="text-red-500 text-sm flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </motion.button>
            </div>

            <div className="space-y-4">
              {workoutTasks.map((task, index) => (
                <motion.div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.div
                    className="p-4 cursor-pointer"
                    onClick={() => setSelectedTask(selectedTask === index ? null : index)}
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <motion.div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            task.completed ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {task.completed ? (
                            <CheckCircle className="w-4 h-4 text-white" />
                          ) : (
                            <Play className="w-4 h-4 text-white" />
                          )}
                        </motion.div>
                        <div>
                          <h3 className="text-white font-semibold">{task.title}</h3>
                          <p className="text-gray-400 text-sm">{task.time}</p>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: selectedTask === index ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </motion.div>
                    </div>

                    <AnimatePresence>
                      {selectedTask === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-4 space-y-4"
                        >
                          <div className="flex justify-between text-sm text-gray-300">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {task.duration}
                            </div>
                            <div className="flex items-center">
                              <Flame className="w-4 h-4 mr-1" />
                              {task.calories} cal
                            </div>
                            <div className="flex items-center">
                              <Heart className="w-4 h-4 mr-1" />
                              Intensity: Medium
                            </div>
                          </div>
                          
                          <motion.button
                            className="w-full bg-red-600 py-2 rounded-lg text-white font-medium"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {task.completed ? 'View Summary' : 'Start Workout'}
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </section>
        </main>

        <nav className="bg-black/90 backdrop-blur-sm border-t border-white/10 p-4 relative z-10">
          <div className="flex justify-around items-center">
            {[
              { icon: Home, path: '/dashboard', active: true },
              { icon: Dumbbell, path: '/workouts', active: false },
              { icon: LayoutGrid, path: '/categories', active: false },
              { icon: User, path: '/profile', active: false }
            ].map((item, index) => (
              <motion.button
                key={index}
                onClick={() => navigate(item.path)}
                className={item.active ? 'text-red-500' : 'text-white/60 hover:text-red-500'}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <item.icon size={24} />
              </motion.button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}

export default Dashboard;
