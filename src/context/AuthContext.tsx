import  { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, UserRole } from '../types';
import db from '../utils/db';

interface AuthContextProps {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (username: string, email: string, password: string, promoCode?: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
  isPro: () => boolean;
  updateUserProfile: (userId: string, data: Partial<User>) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for logged in user in localStorage
    const user = db.getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  }, []);

  async function register(username: string, email: string, password: string, promoCode?: string) {
    try {
      const result = await db.register(username, email, password, promoCode);
      
      if (result.success) {
        // Auto login after successful registration
        await login(email, password);
      }
      
      return result;
    } catch (error: any) {
      console.error('Error during registration:', error);
      return { success: false, message: error.message || 'Erro ao criar conta.' };
    }
  }

  async function login(email: string, password: string) {
    try {
      const result = db.login(email, password);
      
      if (result.success) {
        setCurrentUser(db.getCurrentUser());
      }
      
      return result;
    } catch (error: any) {
      console.error('Error during login:', error);
      return { success: false, message: 'Email ou senha incorretos.' };
    }
  }

  async function logout() {
    db.logout();
    setCurrentUser(null);
  }

  function isAdmin() {
    return currentUser?.role === 'Admin';
  }

  function isPro() {
    return currentUser?.role === 'Pro' || currentUser?.role === 'Admin';
  }

  async function updateUserProfile(userId: string, data: Partial<User>) {
    try {
      if (!isAdmin() && currentUser?.id !== userId) {
        return { success: false, message: 'Permissão negada.' };
      }
      
      const result = await db.updateUser(userId, data);
      
      // Update current user if updating self
      if (result.success && currentUser?.id === userId) {
        const updatedUser = db.getCurrentUser();
        setCurrentUser(updatedUser);
      }
      
      return result;
    } catch (error: any) {
      console.error('Error updating profile:', error);
      return { success: false, message: error.message || 'Erro ao atualizar perfil.' };
    }
  }

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    isAdmin,
    isPro,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
 