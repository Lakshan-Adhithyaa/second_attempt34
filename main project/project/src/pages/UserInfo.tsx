import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase-client';
import { useAuth } from '../contexts/AuthContext';
import { ChevronLeft, ChevronRight, User, Activity, Scale, Target, Calendar, Clock } from 'lucide-react';

type FormStep = {
  title: string;
  description: string;
};

const steps: FormStep[] = [
  { title: 'Body Stats', description: 'Your physical measurements' },
  { title: 'Fitness Goals', description: 'What you want to achieve' },
  { title: 'Schedule', description: 'Your availability' }
];

function UserInfo() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    fitnessGoal: '',
    activityLevel: '',
    workoutPreference: '',
    availability: [] as string[]
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    switch (step) {
      case 0: // Body Stats
        if (!formData.height) {
          newErrors.height = 'Height is required';
          isValid = false;
        } else if (parseFloat(formData.height) < 100 || parseFloat(formData.height) > 250) {
          newErrors.height = 'Height must be between 100 and 250 cm';
          isValid = false;
        }
        if (!formData.weight) {
          newErrors.weight = 'Weight is required';
          isValid = false;
        } else if (parseFloat(formData.weight) < 30 || parseFloat(formData.weight) > 300) {
          newErrors.weight = 'Weight must be between 30 and 300 kg';
          isValid = false;
        }
        break;

      case 1: // Fitness Goals
        if (!formData.fitnessGoal) {
          newErrors.fitnessGoal = 'Fitness goal is required';
          isValid = false;
        }
        if (!formData.activityLevel) {
          newErrors.activityLevel = 'Activity level is required';
          isValid = false;
        }
        break;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      try {
        if (!user) throw new Error('No user found');

        const { error } = await supabase
          .from('user_profiles')
          .upsert({
            id: user.id,
            height: parseFloat(formData.height),
            weight: parseFloat(formData.weight),
            fitness_goal: formData.fitnessGoal,
            activity_level: formData.activityLevel,
            workout_preference: formData.workoutPreference,
            availability: formData.availability,
            updated_at: new Date().toISOString()
          });

        if (error) throw error;

        toast.success('Profile updated successfully');
        navigate('/dashboard');
      } catch (error) {
        toast.error('Failed to update profile');
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2">
                Height (cm) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.height}
                onChange={(e) => handleInputChange('height', e.target.value)}
                className={`w-full px-4 py-3 bg-white/10 rounded-lg border ${
                  errors.height ? 'border-red-500' : 'border-white/20'
                } text-white placeholder-gray-400 focus:outline-none focus:border-red-500`}
                placeholder="Enter your height in cm"
              />
              {errors.height && (
                <p className="mt-1 text-sm text-red-500">{errors.height}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-300 mb-2">
                Weight (kg) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                className={`w-full px-4 py-3 bg-white/10 rounded-lg border ${
                  errors.weight ? 'border-red-500' : 'border-white/20'
                } text-white placeholder-gray-400 focus:outline-none focus:border-red-500`}
                placeholder="Enter your weight in kg"
              />
              {errors.weight && (
                <p className="mt-1 text-sm text-red-500">{errors.weight}</p>
              )}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2">
                Fitness Goal <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.fitnessGoal}
                onChange={(e) => handleInputChange('fitnessGoal', e.target.value)}
                className={`w-full px-4 py-3 bg-white/10 rounded-lg border ${
                  errors.fitnessGoal ? 'border-red-500' : 'border-white/20'
                } text-white placeholder-gray-400 focus:outline-none focus:border-red-500`}
              >
                <option value="">Select your goal</option>
                <option value="weight-loss">Weight Loss</option>
                <option value="muscle-gain">Muscle Gain</option>
                <option value="endurance">Endurance</option>
                <option value="flexibility">Flexibility</option>
              </select>
              {errors.fitnessGoal && (
                <p className="mt-1 text-sm text-red-500">{errors.fitnessGoal}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-300 mb-2">
                Activity Level <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.activityLevel}
                onChange={(e) => handleInputChange('activityLevel', e.target.value)}
                className={`w-full px-4 py-3 bg-white/10 rounded-lg border ${
                  errors.activityLevel ? 'border-red-500' : 'border-white/20'
                } text-white placeholder-gray-400 focus:outline-none focus:border-red-500`}
              >
                <option value="">Select activity level</option>
                <option value="sedentary">Sedentary</option>
                <option value="light">Lightly Active</option>
                <option value="moderate">Moderately Active</option>
                <option value="very">Very Active</option>
              </select>
              {errors.activityLevel && (
                <p className="mt-1 text-sm text-red-500">{errors.activityLevel}</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2">Preferred Workout Type</label>
              <select
                value={formData.workoutPreference}
                onChange={(e) => handleInputChange('workoutPreference', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 rounded-lg border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
              >
                <option value="">Select workout type</option>
                <option value="strength">Strength Training</option>
                <option value="cardio">Cardio</option>
                <option value="yoga">Yoga</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Available Days</label>
              <div className="grid grid-cols-2 gap-4">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                  <label key={day} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.availability.includes(day)}
                      onChange={(e) => {
                        const newAvailability = e.target.checked
                          ? [...formData.availability, day]
                          : formData.availability.filter(d => d !== day);
                        setFormData(prev => ({ ...prev, availability: newAvailability }));
                      }}
                      className="form-checkbox h-5 w-5 text-red-500 rounded border-white/20 bg-white/10"
                    />
                    <span className="text-white">{day}</span>
                  </label>
                ))}
              </div>
            </div>
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
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex-1 ${
                    index < steps.length - 1 ? 'relative' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index <= currentStep ? 'bg-red-500' : 'bg-white/20'
                    }`}
                  >
                    {index === 0 && <Scale className="w-4 h-4 text-white" />}
                    {index === 1 && <Target className="w-4 h-4 text-white" />}
                    {index === 2 && <Calendar className="w-4 h-4 text-white" />}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`absolute top-4 -right-1/2 w-full h-0.5 ${
                        index < currentStep ? 'bg-red-500' : 'bg-white/20'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {steps[currentStep].title}
            </h2>
            <p className="text-gray-400">
              {steps[currentStep].description}
            </p>
          </div>

          {/* Form Content */}
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 mb-8">
            {renderStep()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`flex items-center px-6 py-3 rounded-lg ${
                currentStep === 0
                  ? 'bg-white/10 text-gray-400 cursor-not-allowed'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <button
              onClick={handleNext}
              className="flex items-center px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default UserInfo;
