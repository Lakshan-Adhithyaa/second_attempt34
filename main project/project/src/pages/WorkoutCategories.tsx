import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  Home, Dumbbell, LayoutGrid, User, Clock, Flame, Target, ChevronRight, Play, Heart, Calendar, Trophy, Cog as Yoga, FileWarning as Running, Bike, SwissFranc as Swim, Brain, Music
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { supabase } from '../lib/supabase-client';
import { useAuth } from '../contexts/AuthContext';
import GradientText from '../components/GradientText';

interface Category {
  title: string;
  description: string;
  icon: React.ReactNode;
  id: number;
}

function WorkoutCategories() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [step, setStep] = useState(1);
  const [workoutHours, setWorkoutHours] = useState('');
  const [workoutMinutes, setWorkoutMinutes] = useState('');
  const [sundayWorkoutHours, setSundayWorkoutHours] = useState('');
  const [sundayWorkoutMinutes, setSundayWorkoutMinutes] = useState('');
  const [timePreference, setTimePreference] = useState('');
  const [equipment, setEquipment] = useState<string[]>([]);
  const [maxWeight, setMaxWeight] = useState('');
  const [loading, setLoading] = useState(false);

  const categories: Category[] = [
    {
      title: 'Strength Training',
      description: 'Build muscle and get stronger',
      icon: <Dumbbell className="w-6 h-6" />,
      id: 1
    },
    {
      title: 'HIIT Cardio',
      description: 'Intense cardio workouts',
      icon: <Flame className="w-6 h-6" />,
      id: 2
    },
    {
      title: 'Yoga & Flexibility',
      description: 'Improve mobility and flexibility',
      icon: <Yoga className="w-6 h-6" />,
      id: 3
    },
    {
      title: 'Running',
      description: 'Outdoor and treadmill running',
      icon: <Running className="w-6 h-6" />,
      id: 4
    },
    {
      title: 'Cycling',
      description: 'Indoor and outdoor cycling',
      icon: <Bike className="w-6 h-6" />,
      id: 5
    },
    {
      title: 'Swimming',
      description: 'Pool workouts and techniques',
      icon: <Swim className="w-6 h-6" />,
      id: 6
    },
    {
      title: 'Meditation',
      description: 'Mental wellness and mindfulness',
      icon: <Brain className="w-6 h-6" />,
      id: 7
    },
    {
      title: 'Dance Fitness',
      description: 'Fun cardio through dance',
      icon: <Music className="w-6 h-6" />,
      id: 8
    }
  ];

  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategory(categoryId);
    setStep(1);
  };

  const handleEquipmentSelect = (equipmentItem: string) => {
    if (equipment.includes(equipmentItem)) {
      setEquipment(equipment.filter(item => item !== equipmentItem));
    } else {
      setEquipment([...equipment, equipmentItem]);
    }
  };

  const handleNext = async () => {
    if (step === 1 && (!workoutHours || !workoutMinutes)) {
      toast.error('Please enter your available workout time');
      return;
    }

    if (step === 2 && equipment.length === 0) {
      toast.error('Please select at least one equipment option');
      return;
    }

    if (step === 2 && equipment.includes('Dumbbells') && !maxWeight) {
      toast.error('Please specify the maximum weight you have available');
      return;
    }

    if (step < 3) {
      setStep(prev => prev + 1);
    } else {
      setLoading(true);
      try {
        if (!user) throw new Error('No user found');

        const totalWorkoutTime = (parseInt(workoutHours) || 0) * 60 + (parseInt(workoutMinutes) || 0);
        const totalSundayWorkoutTime = (parseInt(sundayWorkoutHours) || 0) * 60 + (parseInt(sundayWorkoutMinutes) || 0);

        const { error } = await supabase
          .from('user_workout_preferences')
          .upsert({
            user_id: user.id,
            category_id: selectedCategory,
            workout_time: totalWorkoutTime,
            sunday_workout_time: totalSundayWorkoutTime,
            time_preference: timePreference,
            equipment: equipment,
            max_weight: maxWeight,
          });

        if (error) throw error;

        toast.success('Workout preferences saved!');
        navigate('/dashboard');
      } catch (error) {
        toast.error('Failed to save workout preferences');
      } finally {
        setLoading(false);
      }
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Available Workout Time</h3>
            <p className="text-gray-400">How much time can you dedicate daily?</p>
            <div className="flex space-x-4">
              <input
                type="number"
                value={workoutHours}
                onChange={(e) => setWorkoutHours(e.target.value)}
                placeholder="Hours"
                className="w-1/2 px-4 py-3 bg-white/10 rounded-lg border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
              />
              <input
                type="number"
                value={workoutMinutes}
                onChange={(e) => setWorkoutMinutes(e.target.value)}
                placeholder="Minutes"
                className="w-1/2 px-4 py-3 bg-white/10 rounded-lg border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
              />
            </div>

            <label className="block text-gray-300 mb-2">Time Preference</label>
            <select
              value={timePreference}
              onChange={(e) => setTimePreference(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 rounded-lg border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
            >
              <option value="">Select time preference</option>
              <option value="morning">Morning</option>
              <option value="evening">Evening</option>
              <option value="custom">Custom</option>
            </select>

            {new Date().getDay() === 0 && (
              <>
                <p className="text-gray-400">Sunday Workout Time (optional)</p>
                <div className="flex space-x-4">
                  <input
                    type="number"
                    value={sundayWorkoutHours}
                    onChange={(e) => setSundayWorkoutHours(e.target.value)}
                    placeholder="Hours"
                    className="w-1/2 px-4 py-3 bg-white/10 rounded-lg border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                  />
                  <input
                    type="number"
                    value={sundayWorkoutMinutes}
                    onChange={(e) => setSundayWorkoutMinutes(e.target.value)}
                    placeholder="Minutes"
                    className="w-1/2 px-4 py-3 bg-white/10 rounded-lg border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                  />
                </div>
              </>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Available Equipment</h3>
            <p className="text-gray-400">Select the equipment you have access to:</p>
            <div className="grid grid-cols-2 gap-4">
              {['Dumbbells', 'Barbells', 'Resistance Bands', 'Machines', 'None'].map(item => (
                <label key={item} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={equipment.includes(item)}
                    onChange={() => handleEquipmentSelect(item)}
                    className="form-checkbox h-5 w-5 text-red-500 rounded border-white/20 bg-white/10"
                  />
                  <span className="text-white">{item}</span>
                </label>
              ))}
            </div>
            {equipment.includes('Dumbbells') && (
              <div>
                <label className="block text-gray-300 mb-2">Maximum Weight (kg)</label>
                <input
                  type="number"
                  value={maxWeight}
                  onChange={(e) => setMaxWeight(e.target.value)}
                  placeholder="Enter maximum weight"
                  className="w-full px-4 py-3 bg-white/10 rounded-lg border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                />
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Confirm and Proceed</h3>
            <p className="text-gray-400">Please confirm your selections:</p>
            <p className="text-white">Workout Time: {workoutHours} hours {workoutMinutes} minutes</p>
            {new Date().getDay() === 0 && (
              <p className="text-white">Sunday Workout Time: {sundayWorkoutHours} hours {sundayWorkoutMinutes} minutes</p>
            )}
            <p className="text-white">Time Preference: {timePreference}</p>
            <p className="text-white">Equipment: {equipment.join(', ')}</p>
            {equipment.includes('Dumbbells') && (
              <p className="text-white">Maximum Weight: {maxWeight} kg</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div 
        className="min-h-screen flex flex-col"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80")',
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
              <GradientText text="Workout Categories" className="text-2xl font-bold text-white mb-2" />
              <p className="text-gray-400">Choose your workout type</p>
            </div>
          </motion.div>

          {selectedCategory === null ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.map((category) => (
                <motion.div 
                  key={category.id}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-colors cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: category.id * 0.1 }}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <motion.div 
                      className="bg-red-600 p-3 rounded-lg"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      {category.icon}
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{category.title}</h3>
                      <p className="text-gray-300">{category.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              className="bg-black/40 backdrop-blur-sm rounded-lg p-6 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {renderStepContent()}

              <div className="flex justify-between mt-8">
                <motion.button
                  className="bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
                  onClick={() => {
                    if (step === 1) {
                      setSelectedCategory(null);
                    } else {
                      setStep(prev => prev - 1);
                    }
                  }}
                >
                  Back
                </motion.button>
                <motion.button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  onClick={handleNext}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : step === 3 ? 'Generate Plan' : 'Next'}
                </motion.button>
              </div>
            </motion.div>
          )}
        </main>

        <Navbar />
      </div>
    </div>
  );
}

export default WorkoutCategories;
