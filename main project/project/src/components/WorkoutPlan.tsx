import React from 'react';

interface WorkoutPlanProps {
  plan: string;
}

const WorkoutPlan: React.FC<WorkoutPlanProps> = ({ plan }) => {
  return (
    <div className="bg-white/10 rounded-lg p-4 mb-4">
      <h3 className="text-xl font-semibold text-white mb-2">Today's Workout Plan</h3>
      <p className="text-gray-300">{plan}</p>
    </div>
  );
};

export default WorkoutPlan;
