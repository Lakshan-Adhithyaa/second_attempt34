import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Dumbbell, LayoutGrid, User,
  ChevronRight, Play, CheckCircle, Clock, Flame,
  Trophy, Heart, Plus, Bell, X, Save
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import WorkoutPlan from '../components/WorkoutPlan';
import generateWorkoutPlan from '../lib/gemini';
import { supabase } from '../lib/supabase-client';
import { useAuth } from '../contexts/AuthContext';
import CountUp from '../components/CountUp';
import ShinyText from '../components/ShinyText';
import GradientText from '../components/GradientText';

interface Streak {
  current: number;
  best: number;
  lastWorkout: string | null;
}

interface Workout {
  id: string;
  title: string;
  duration: string;
  calories: string;
  completed: boolean;
}

function Dashboard() {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const [selectedTask, setSelectedTask] = useState<number | null>(null);
  const [streak, setStreak] = useState<Streak>({
    current: 0,
    best: 0,
    lastWorkout: null
  });
  const [workoutPlan, setWorkoutPlan] = useState<string>('');
  const [selectedWorkouts, setSelectedWorkouts] = useState<Workout[]>([]);
  const [showWorkoutPlan, setShowWorkoutPlan] = useState(false);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [daysCount, setDaysCount] = useState(0);
  const [scores, setScores] = useState(0);
  const [workoutLoadError, setWorkoutLoadError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialProgress = async () => {
      if (user) {
        try {
          const { data: progressData, error: progressError } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (progressError) {
            console.error('Error fetching user progress:', progressError);
          } else if (progressData) {
            setCaloriesBurned(progressData.calories_burned || 0);
            setDaysCount(progressData.days_count || 0);
            setScores(progressData.scores || 0);
            setStreak({
              current: progressData.current_streak || 0,
              best: progressData.best_streak || 0,
              lastWorkout: progressData.last_workout || null
            });
          }
        } catch (error) {
          console.error('Error fetching initial progress:', error);
        }
      }
    };

    const fetchWorkoutPlan = async () => {
      if (userProfile) {
        try {
          const plan = await generateWorkoutPlan(userProfile);
          setWorkoutPlan(plan);
          setWorkoutLoadError(null);
        } catch (error: any) {
          console.error('Error generating workout plan:', error);
          setWorkoutLoadError('Failed to generate workout plan. Please select a workout from the workout categories.');
        }
      }
    };

    const fetchSelectedWorkouts = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('user_workouts')
            .select('*')
            .eq('user_id', user.id);

          if (error) {
            console.error('Error fetching selected workouts:', error);
            toast.error('Failed to load selected workouts');
          } else {
            setSelectedWorkouts(data || []);
          }
        } catch (error) {
          console.error('Error fetching selected workouts:', error);
          toast.error('Failed to load selected workouts');
        }
      }
    };

    fetchInitialProgress();
    fetchWorkoutPlan();
    fetchSelectedWorkouts();
  }, [user, userProfile]);

  const handleStartWorkout = () => {
    setShowWorkoutPlan(true);
  };

  const handleWorkoutCompletion = async (workout: Workout) => {
    const today = new Date();
    const lastWorkoutDate = streak.lastWorkout ? new Date(streak.lastWorkout) : null;
    const timeDiff = lastWorkoutDate ? today.getTime() - lastWorkoutDate.getTime() : 0;
    const daysDiff = timeDiff / (1000 * 3600 * 24);

    let newCurrentStreak = streak.current;
    if (daysDiff >= 1 && daysDiff < 2) {
      newCurrentStreak += 1;
    } else if (daysDiff >= 2) {
      newCurrentStreak = 0;
    } else if (!lastWorkoutDate) {
      newCurrentStreak = 1;
    }

    let newCaloriesBurned = caloriesBurned + parseInt(workout.calories);
    let newDaysCount = daysCount + 1;
    let newScores = scores + 10; // Example scoring system
    let newStreakData = {
      current: newCurrentStreak,
      best: Math.max(streak.best, newCurrentStreak),
      lastWorkout: today.toISOString()
    };

    try {
      if (!user) throw new Error('No user found');

      const { data: updatedProgress, error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          calories_burned: newCaloriesBurned,
          days_count: newDaysCount,
          scores: newScores,
          current_streak: newStreakData.current,
          best_streak: newStreakData.best,
          last_workout: newStreakData.lastWorkout,
        })
        .select()
        .single();

      if (error) throw error;

      // Update local state only if Supabase update was successful
      setCaloriesBurned(updatedProgress.calories_burned);
      setDaysCount(updatedProgress.days_count);
      setScores(updatedProgress.scores);
      setStreak({
        current: updatedProgress.current_streak,
        best: updatedProgress.best_streak,
        lastWorkout: updatedProgress.last_workout
      });

      // Update workout as completed
      setSelectedWorkouts(prev =>
        prev.map(w => (w.id === workout.id ? { ...w, completed: true } : w))
      );

      toast.success('Workout completed! Progress updated.');
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('Failed to update progress');
      // Revert local state if Supabase update failed
      newCaloriesBurned = caloriesBurned;
      newDaysCount = daysCount;
      newScores = scores;
      newStreakData = streak;
    }
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

        <main className="flex-1 relative z-10 p-6 pb-20"> {/* Added pb-20 for padding */}
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
              { title: 'Current Streak', value: showWorkoutPlan ? `${streak.current} days` : 'Start Working Out', subtitle: 'Best: ' + streak.best + ' days', icon: Trophy },
              { title: 'Calories', value: showWorkoutPlan ? <CountUp start={0} end={caloriesBurned} duration={2} /> : 'Start Working Out', subtitle: 'burned today', icon: Flame }
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

          {workoutLoadError ? (
            <div className="bg-white/10 rounded-lg p-6 text-center">
              <p className="text-red-500 font-semibold mb-4">{workoutLoadError}</p>
              <motion.button
                onClick={() => navigate('/categories')}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Select a Workout
              </motion.button>
            </div>
          ) : (
            <AnimatePresence>
              {showWorkoutPlan && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <WorkoutPlan plan={workoutPlan} />
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {selectedWorkouts.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Selected Workouts</h2>
              <div className="space-y-4">
                {selectedWorkouts.map((workout, index) => (
                  <motion.div
                    key={workout.id}
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
                              workout.completed ? 'bg-green-500' : 'bg-red-500'
                            }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            {workout.completed ? (
                              <CheckCircle className="w-4 h-4 text-white" />
                            ) : (
                              <Play className="w-4 h-4 text-white" />
                            )}
                          </motion.div>
                          <div>
                            <h3 className="text-white font-semibold">{workout.title}</h3>
                          </div>
                        </div>
                        <motion.div
                          animate={{ rotate: selectedTask === index ? 90 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </motion.div>
                      </div>
                    </motion.div>
                    {!workout.completed && (
                      <motion.button
                        className="w-full bg-red-600 py-2 rounded-lg text-white font-medium"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleWorkoutCompletion(workout)}
                      >
                        Complete Workout
                      </motion.button>
                    )}
                  </motion.div>
                ))}
              </div>
              {!showWorkoutPlan && (
                <motion.button
                  className="w-full bg-red-600 py-2 rounded-lg text-white font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleStartWorkout}
                >
                  Start Workout
                </motion.button>
              )}
            </section>
          )}
        </main>

        <Navbar />
      </div>
    </div>
  );
}

export default Dashboard;
