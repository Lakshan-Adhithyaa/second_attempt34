import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import { 
  Home, Dumbbell, LayoutGrid, User, Settings, Award, 
  Calendar, Bell, ChevronRight, Edit2, LogOut, Flame,
  Camera, Trash2, Save, X, Lock, Mail, Phone
} from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  notifications: boolean;
  darkMode: boolean;
  units: 'metric' | 'imperial';
  privacyMode: boolean;
}

function Profile() {
  const navigate = useNavigate();
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const [profile, setProfile] = useState<UserProfile>({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 234 567 8900',
    notifications: true,
    darkMode: true,
    units: 'metric',
    privacyMode: false,
  });

  const [editableProfile, setEditableProfile] = useState<UserProfile>(profile);

  const userStats = {
    workouts: 248,
    calories: '12.4k',
    streak: 12,
    level: 'Gold'
  };

  const achievements = [
    { title: '5 Day Streak', date: '2024-03-15', icon: <Award className="w-6 h-6" /> },
    { title: '100 Workouts', date: '2024-03-10', icon: <Dumbbell className="w-6 h-6" /> },
    { title: '10k Calories', date: '2024-03-05', icon: <Flame className="w-6 h-6" /> }
  ];

  const handleAvatarClick = () => {
    setShowAvatarMenu(!showAvatarMenu);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
        toast.success('Profile picture updated');
      };
      reader.readAsDataURL(file);
    }
    setShowAvatarMenu(false);
  };

  const removeAvatar = () => {
    setAvatar(null);
    setShowAvatarMenu(false);
    toast.success('Profile picture removed');
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setProfile(editableProfile);
      toast.success('Profile updated successfully');
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setEditableProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement password change logic here
    toast.success('Password updated successfully');
    setShowChangePassword(false);
  };

  const handleLogout = () => {
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-black">
      <Toaster position="top-center" />
      <div 
        className="min-h-screen flex flex-col"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80")',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <div className="absolute inset-0 bg-black/80" />

        <main className="flex-1 relative z-10 p-6">
          {/* Profile Header */}
          <motion.div 
            className="flex items-center justify-between mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center space-x-4">
              <div className="relative">
                <motion.div
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center overflow-hidden cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  onClick={handleAvatarClick}
                >
                  {avatar ? (
                    <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={32} className="text-white" />
                  )}
                </motion.div>
                <AnimatePresence>
                  {showAvatarMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute top-full mt-2 w-48 bg-black/90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden z-50"
                    >
                      <label className="flex items-center space-x-2 px-4 py-3 hover:bg-white/10 cursor-pointer">
                        <Camera size={16} className="text-white" />
                        <span className="text-white text-sm">Change Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                      {avatar && (
                        <button
                          onClick={removeAvatar}
                          className="w-full flex items-center space-x-2 px-4 py-3 hover:bg-white/10 text-red-500"
                        >
                          <Trash2 size={16} />
                          <span className="text-sm">Remove Photo</span>
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div>
                <motion.h1 
                  className="text-2xl font-bold text-white"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {isEditing ? (
                    <input
                      type="text"
                      value={editableProfile.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="bg-white/10 px-2 py-1 rounded"
                    />
                  ) : profile.name}
                </motion.h1>
                <motion.p 
                  className="text-gray-400"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Premium Member
                </motion.p>
              </div>
            </div>
            <motion.button
              onClick={handleEditToggle}
              className="bg-red-600 p-2 rounded-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isEditing ? <Save size={20} className="text-white" /> : <Edit2 size={20} className="text-white" />}
            </motion.button>
          </motion.div>

          {/* Profile Information */}
          <motion.div 
            className="bg-white/10 rounded-lg p-6 mb-8 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="text-xl font-semibold text-white mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Mail className="text-red-500" />
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editableProfile.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="bg-white/10 px-2 py-1 rounded text-white"
                      />
                    ) : (
                      <p className="text-white">{profile.email}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Phone className="text-red-500" />
                  <div>
                    <p className="text-gray-400 text-sm">Phone</p>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editableProfile.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="bg-white/10 px-2 py-1 rounded text-white"
                      />
                    ) : (
                      <p className="text-white">{profile.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {Object.entries({ Workouts: userStats.workouts, Calories: userStats.calories }).map(([label, value], index) => (
              <motion.div
                key={label}
                className="bg-red-600/20 p-4 rounded-lg backdrop-blur-sm hover:bg-red-600/30 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className="text-white font-semibold mb-1">{label}</h3>
                <p className="text-2xl text-white font-bold">{value}</p>
              </motion.div>
            ))}
          </div>

          {/* Settings */}
          <motion.div 
            className="bg-white/10 rounded-lg p-6 mb-8 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="text-xl font-semibold text-white mb-4">Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="text-red-500" />
                  <span className="text-white">Notifications</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editableProfile.notifications}
                    onChange={(e) => handleInputChange('notifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Settings className="text-red-500" />
                  <span className="text-white">Dark Mode</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editableProfile.darkMode}
                    onChange={(e) => handleInputChange('darkMode', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Lock className="text-red-500" />
                  <span className="text-white">Privacy Mode</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editableProfile.privacyMode}
                    onChange={(e) => handleInputChange('privacyMode', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Settings className="text-red-500" />
                  <span className="text-white">Units</span>
                </div>
                <select
                  value={editableProfile.units}
                  onChange={(e) => handleInputChange('units', e.target.value)}
                  className="bg-white/10 text-white px-3 py-1 rounded"
                >
                  <option value="metric">Metric</option>
                  <option value="imperial">Imperial</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Security */}
          <motion.div 
            className="bg-white/10 rounded-lg p-6 mb-8 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="text-xl font-semibold text-white mb-4">Security</h2>
            <button
              onClick={() => setShowChangePassword(true)}
              className="w-full flex items-center justify-between p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Lock className="text-red-500" />
                <span className="text-white">Change Password</span>
              </div>
              <ChevronRight className="text-gray-400" />
            </button>
          </motion.div>

          {/* Logout Button */}
          <motion.button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 p-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </motion.button>
        </main>

        {/* Navigation Bar */}
        <nav className="bg-black/90 backdrop-blur-sm border-t border-white/10 p-4 relative z-10">
          <div className="flex justify-around items-center">
            {[
              { icon: Home, path: '/dashboard' },
              { icon: Dumbbell, path: '/workouts' },
              { icon: LayoutGrid, path: '/categories' },
              { icon: User, path: '/profile', active: true }
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

        {/* Change Password Modal */}
        <AnimatePresence>
          {showChangePassword && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-gray-900 rounded-lg p-6 w-full max-w-md"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-white">Change Password</h3>
                  <button
                    onClick={() => setShowChangePassword(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X size={24} />
                  </button>
                </div>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-gray-400 mb-2">Current Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">New Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Update Password
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Profile;