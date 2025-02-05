import { toast } from 'react-hot-toast';

// Mock user data for development
const MOCK_USERS = [
  {
    email: 'demo@example.com',
    password: 'password123',
    name: 'Demo User',
    avatar: null,
  },
];

interface AuthResponse {
  error: Error | null;
  data: {
    user: { email: string; name: string; avatar: string | null } | null;
  };
}

export const auth = {
  signInWithPassword: async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return {
        error: new Error('Invalid email or password'),
        data: { user: null },
      };
    }

    return {
      error: null,
      data: { user },
    };
  },

  signUp: async ({
    email,
    password,
    name,
  }: {
    email: string;
    password: string;
    name: string;
  }): Promise<AuthResponse> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Check if user already exists
    if (MOCK_USERS.some((u) => u.email === email)) {
      return {
        error: new Error('Email already in use'),
        data: { user: null },
      };
    }

    // In a real app, we would save this to a database
    const newUser = {
      email,
      password,
      name,
      avatar: null,
    };

    MOCK_USERS.push(newUser);

    return {
      error: null,
      data: { user: newUser },
    };
  },

  signInWithOAuth: async ({ provider }: { provider: string }) => {
    toast.error(`${provider} sign-in is not available in demo mode`);
    return { error: new Error('OAuth not available in demo mode') };
  },
};
