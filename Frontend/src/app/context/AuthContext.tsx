import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email?: string;
  phone?: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  signIn: (credentials: { email?: string; phone?: string; password: string }) => Promise<void>;
  signUp: (credentials: { email?: string; phone?: string; password: string; name: string }) => Promise<void>;
  signOut: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const storedUser = localStorage.getItem('fincy_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const signIn = async (credentials: { email?: string; phone?: string; password: string }) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Get stored users
    const storedUsers = localStorage.getItem('fincy_users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    // Find user by email or phone
    const foundUser = users.find((u: any) => 
      (credentials.email && u.email === credentials.email) ||
      (credentials.phone && u.phone === credentials.phone)
    );

    if (!foundUser || foundUser.password !== credentials.password) {
      throw new Error('Invalid credentials');
    }

    const user = {
      id: foundUser.id,
      email: foundUser.email,
      phone: foundUser.phone,
      name: foundUser.name,
    };

    setUser(user);
    localStorage.setItem('fincy_user', JSON.stringify(user));
  };

  const signUp = async (credentials: { email?: string; phone?: string; password: string; name: string }) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Get stored users
    const storedUsers = localStorage.getItem('fincy_users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    // Check if user already exists
    const existingUser = users.find((u: any) => 
      (credentials.email && u.email === credentials.email) ||
      (credentials.phone && u.phone === credentials.phone)
    );

    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email: credentials.email,
      phone: credentials.phone,
      password: credentials.password,
      name: credentials.name,
    };

    users.push(newUser);
    localStorage.setItem('fincy_users', JSON.stringify(users));

    const user = {
      id: newUser.id,
      email: newUser.email,
      phone: newUser.phone,
      name: newUser.name,
    };

    setUser(user);
    localStorage.setItem('fincy_user', JSON.stringify(user));
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('fincy_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signUp,
        signOut,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}