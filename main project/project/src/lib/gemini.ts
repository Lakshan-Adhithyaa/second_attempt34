import { GoogleGenerativeAI } from "@google/generative-ai";

// WARNING: Storing the API key directly in the code is not secure.
// In a production environment, use environment variables or a secure configuration.
const API_KEY = 'AIzaSyAZoen9eGszb4RpAvRzFd8fqI9UsKVYvkA';

const genAI = new GoogleGenerativeAI(API_KEY);

async function generateWorkoutPlan(userData: any) {
  try {
    // Basic data validation
    if (!userData || typeof userData !== 'object') {
      throw new Error('Invalid user data');
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Generate a personalized daily workout routine based on the following user data:
      Age: ${userData.age}
      Gender: ${userData.gender}
      Fitness Level: ${userData.fitnessLevel}
      Goals: ${userData.goals}
      Available Equipment: ${userData.equipment}
      Workout Preferences: ${userData.preferences}
      Time Preference: ${userData.timePreference}
      Workout Time: ${userData.workoutTime} minutes

      The workout plan should be structured with:
      - Warm-up exercises (5-10 minutes)
      - Main workout exercises (3-4 exercises with sets and reps)
      - Cool-down exercises (5-10 minutes)

      Consider progressive overload and recovery time. Provide specific exercise names, sets, reps, and rest times.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    console.log(response.text());
    return response.text();
  } catch (error: any) {
    console.error('Error generating workout plan:', error);
    // CORS issue warning
    if (error.message.includes('CORS')) {
      console.warn('Possible CORS issue. Make sure the Gemini API allows requests from this origin.');
    }
    return 'Failed to generate workout plan. Please check the console for errors.';
  }
}

export default generateWorkoutPlan;
