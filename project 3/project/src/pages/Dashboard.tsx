import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Dumbbell, LayoutGrid, User, Calendar,
  ChevronRight, ChevronLeft, Play, CheckCircle, Clock, Flame,
  Trophy, Heart, Plus, Bell, X, Save
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

interface Workout {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  type: string;
  reminder: boolean;
  completed: boolean;
}

interface Streak {
  current: number;
  best: number;
  lastWorkout: string | null;
}

function Dashboard() {
  const navigate = useNavigate();
  const [selectedTask, setSelectedTask] = useState<number | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [streak, setStreak] = useState<Streak>({
    current: 0,
    best: 0,
    lastWorkout: null
  });

  const [newWorkout, setNewWorkout] = useState<Omit<Workout, 'id'>>({
    title: '',
    date: '',
    time: '',
    duration: '30',
    type: 'strength',
    reminder: true,
    completed: false
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

  // Calendar Functions
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days: (number | null)[] = [];
    
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const updateStreak = (workoutDate: string) => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    setStreak(prev => {
      let newStreak = { ...prev };
      
      if (!prev.lastWorkout || workoutDate > prev.lastWorkout) {
        if (workoutDate === today || workoutDate === yesterday) {
          newStreak.current += 1;
          newStreak.best = Math.max(newStreak.current, prev.best);
        } else {
          newStreak.current = 1;
        }
        newStreak.lastWorkout = workoutDate;
      }
      
      return newStreak;
    });
  };

  const handleAddWorkout = () => {
    if (!selectedDate) return;

    const id = Math.random().toString(36).substr(2, 9);
    const formattedDate = selectedDate.toISOString().split('T')[0];
    
    const workout: Workout = {
      id,
      ...newWorkout,
      date: formattedDate
    };

    setWorkouts(prev => [...prev, workout]);
    
    if (workout.reminder) {
      const notificationTime = new Date(formattedDate + 'T' + workout.time);
      const now = new Date();
      
      if (notificationTime > now) {
        const timeUntilNotification = notificationTime.getTime() - now.getTime();
        setTimeout(() => {
          toast(`🏋️‍♂️ Reminder: Time for your ${workout.title} workout!`, {
            duration: 5000,
            icon: '⏰'
          });
        }, timeUntilNotification);
      }
    }

    setShowAddWorkout(false);
    toast.success('Workout scheduled successfully!');
  };

  const toggleWorkoutCompletion = (workoutId: string) => {
    setWorkouts(prev => prev.map(workout => {
      if (workout.id === workoutId) {
        const newWorkout = { ...workout, completed: !workout.completed };
        if (newWorkout.completed) {
          updateStreak(workout.date);
        }
        return newWorkout;
      }
      return workout;
    }));
  };

  const getWorkoutsForDate = (date: Date) => {
    const formattedDate = date.toISOString().split('T')[0];
    return workouts.filter(workout => workout.date === formattedDate);
  };

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
            <motion.div
              className="bg-red-600/20 p-2 rounded-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Calendar className="w-6 h-6 text-white" />
            </motion.div>
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

          {/* Calendar Section */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-white/5 rounded-lg p-6 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <ChevronLeft className="text-white" />
              </button>
              <h2 className="text-xl font-semibold text-white">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h2>
              <button
                onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <ChevronRight className="text-white" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-6">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-gray-400 text-sm py-2">
                  {day}
                </div>
              ))}
              
              {getDaysInMonth(currentDate).map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} className="aspect-square" />;
                }

                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                const isSelected = selectedDate?.toDateString() === date.toDateString();
                const hasWorkouts = getWorkoutsForDate(date).length > 0;
                const isToday = new Date().toDateString() === date.toDateString();

                return (
                  <motion.button
                    key={`day-${day}`}
                    onClick={() => setSelectedDate(date)}
                    className={`relative aspect-square rounded-lg ${
                      isSelected 
                        ? 'bg-red-600' 
                        : hasWorkouts 
                          ? 'bg-red-600/20' 
                          : 'bg-white/5'
                    } hover:bg-red-600/40 transition-colors`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className={`${isToday ? 'text-red-500 font-bold' : 'text-white'}`}>{day}</span>
                    {hasWorkouts && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
                        <div className="w-1 h-1 rounded-full bg-red-500" />
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {selectedDate && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    {selectedDate.toLocaleDateString('default', { 
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </h3>
                  <button
                    onClick={() => setShowAddWorkout(true)}
                    className="bg-red-600 p-2 rounded-full hover:bg-red-700 transition-colors"
                  >
                    <Plus className="text-white" />
                  </button>
                </div>

                <div className="space-y-4">
                  {getWorkoutsForDate(selectedDate).map(workout => (
                    <motion.div
                      key={workout.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 rounded-lg ${
                        workout.completed ? 'bg-green-600/20' : 'bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-white">{workout.title}</h4>
                          <div className="text-sm text-gray-400">
                            {workout.time} • {workout.duration} min • {workout.type}
                          </div>
                        </div>
                        <button
                          onClick={() => toggleWorkoutCompletion(workout.id)}
                          className={`p-2 rounded-full ${
                            workout.completed ? 'bg-green-600' : 'bg-red-600'
                          }`}
                        >
                          {workout.completed ? '✓' : '•'}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.section>

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
      </div>

      {/* Add Workout Modal */}
      <AnimatePresence>
        {showAddWorkout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-gray-900 rounded-lg p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-white">Add Workout</h3>
                <button
                  onClick={() => setShowAddWorkout(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X />
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleAddWorkout(); }} className="space-y-4">
                <div>
                  <label className="block text-gray-400 mb-2">Workout Title</label>
                  <input
                    type="text"
                    value={newWorkout.title}
                    onChange={(e) => setNewWorkout(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">Time</label>
                  <input
                    type="time"
                    value={newWorkout.time}
                    onChange={(e) => setNewWorkout(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    value={newWorkout.duration}
                    onChange={(e) => setNewWorkout(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">Workout Type</label>
                  <select
                    value={newWorkout.type}
                    onChange={(e) => setNewWorkout(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  >
                    <option value="strength">Strength Training</option>
                    <option value="cardio">Cardio</option>
                    <option value="yoga">Yoga</option>
                    <option value="hiit">HIIT</option>
                  </select>
                </div>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newWorkout.reminder}
                    onChange={(e) => setNewWorkout(prev => ({ ...prev, reminder: e.target.checked }))}
                    className="form-checkbox h-5 w-5 text-red-500"
                  />
                  <span className="text-gray-400">Set reminder</span>
                </label>

                <button
                  type="submit"
                  className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Add Workout
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Dashboard;
