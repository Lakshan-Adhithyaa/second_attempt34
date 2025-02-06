import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Bell,
  Trophy,
  X,
  Clock,
  Save,
  Flame
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

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

function Calendar() {
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

  // Calculate calendar data
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days: (number | null)[] = [];
    
    // Add empty slots for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add the days of the month
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
      // Schedule notification
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
    <div className="min-h-screen bg-black text-white p-6">
      <Toaster position="top-center" />
      
      {/* Header with Streak */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Workout Calendar</h1>
        <motion.div 
          className="bg-red-600/20 p-4 rounded-lg backdrop-blur-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Flame className="text-red-500" />
              <span className="text-lg font-semibold">Current Streak</span>
            </div>
            <div className="text-2xl font-bold text-red-500">{streak.current} days</div>
          </div>
          <div className="text-sm text-gray-400 mt-2">Best streak: {streak.best} days</div>
        </motion.div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <ChevronLeft />
        </button>
        <h2 className="text-xl font-semibold">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button
          onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <ChevronRight />
        </button>
      </div>

      {/* Calendar Grid */}
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
              <span className={`${isToday ? 'text-red-500 font-bold' : ''}`}>{day}</span>
              {hasWorkouts && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
                  <div className="w-1 h-1 rounded-full bg-red-500" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Selected Date Workouts */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
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
              <Plus />
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
                    <h4 className="font-semibold">{workout.title}</h4>
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
                <h3 className="text-xl font-semibold">Add Workout</h3>
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
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">Time</label>
                  <input
                    type="time"
                    value={newWorkout.time}
                    onChange={(e) => setNewWorkout(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    value={newWorkout.duration}
                    onChange={(e) => setNewWorkout(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">Workout Type</label>
                  <select
                    value={newWorkout.type}
                    onChange={(e) => setNewWorkout(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg"
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

export default Calendar;
