
import React, { createContext, useState, useContext, useEffect } from "react";
import { User, UserRole } from "@/types";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for local development
const mockUsers: User[] = [
  {
    id: "1",
    email: "hr@example.com",
    name: "HR Manager",
    role: "hr",
    createdAt: new Date(),
  },
  {
    id: "2",
    email: "student@example.com",
    name: "Student User",
    role: "student",
    createdAt: new Date(),
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for authentication
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // Find user in mock data
      const user = mockUsers.find(
        (u) => u.email === email && u.role === role
      );
      
      if (!user) {
        throw new Error("Invalid credentials");
      }
      
      // Store in localStorage
      localStorage.setItem("user", JSON.stringify(user));
      setCurrentUser(user);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // Check if user exists in mock data
      if (mockUsers.some((u) => u.email === email)) {
        throw new Error("Email already in use");
      }
      
      // Create new user
      const newUser: User = {
        id: String(mockUsers.length + 1),
        email,
        name,
        role,
        createdAt: new Date(),
      };
      
      // Add to mock users for this session
      mockUsers.push(newUser);
      
      // Store in localStorage
      localStorage.setItem("user", JSON.stringify(newUser));
      setCurrentUser(newUser);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
