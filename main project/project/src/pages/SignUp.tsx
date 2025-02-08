import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { signupSchema } from '../lib/validation';
import { supabase } from '../lib/supabase-client';
import { z } from 'zod';

type SignUpForm = z.infer<typeof signupSchema>;

function SignUp() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<SignUpForm>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<SignUpForm>>({});

  const validateForm = () => {
    try {
      signupSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<SignUpForm> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof SignUpForm] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleInputChange = (field: keyof SignUpForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
          },
        },
      });

      if (authError) throw authError;

      // Create user profile
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert([
            {
              id: authData.user.id,
              full_name: formData.name,
            },
          ]);

        if (profileError) throw profileError;
      }

      toast.success('Account created successfully!');
      navigate('/user-info');
    } catch (error) {
      toast.error('Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full">
      <Toaster position="top-center" />
      <div 
        className="min-h-screen w-full bg-cover bg-center flex flex-col relative"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80")',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/70">
          <div className="absolute inset-0 gradient-overlay" />
        </div>

        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 text-white z-10 hover:text-red-500 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>

        <main className="flex-1 flex items-center justify-center p-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md px-8 py-10"
          >
            <motion.div 
              className="flex justify-center mb-8"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">FIT</span>
              </div>
            </motion.div>
            
            <h1 className="text-2xl font-bold text-white text-center mb-8">CREATE ACCOUNT</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-4 py-3 bg-white/10 border-b-2 ${
                    errors.name ? 'border-red-500' : 'border-red-500/50'
                  } text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors`}
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-3 bg-white/10 border-b-2 ${
                    errors.email ? 'border-red-500' : 'border-red-500/50'
                  } text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors`}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="relative"
              >
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full px-4 py-3 bg-white/10 border-b-2 ${
                    errors.password ? 'border-red-500' : 'border-red-500/50'
                  } text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="relative"
              >
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`w-full px-4 py-3 bg-white/10 border-b-2 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-red-500/50'
                  } text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors`}
                  disabled={isLoading}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </motion.div>

              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? 'Creating Account...' : 'SIGN UP'}
              </motion.button>

              <p className="text-center text-gray-400 mt-6">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-red-500 hover:text-red-400 transition-colors"
                  disabled={isLoading}
                >
                  Log in
                </button>
              </p>
            </form>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default SignUp;