import  { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile 
} from 'firebase/auth';
import { User } from '../types';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCz8u7hif6m2s7S6cibOSdnT7luQRhO6bA",
  authDomain: "dataserver-5d143.firebaseapp.com",
  projectId: "dataserver-5d143",
  storageBucket: "dataserver-5d143.appspot.com",
  messagingSenderId: "823451234978",
  appId: "1:823451234978:web:7da11092f4a7e8d3a06a79",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Fallback authentication methods using Firebase
// These are used if Google Sheets integration fails
export const firebaseRegister = async (email: string, password: string, username: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Add display name
    await updateProfile(userCredential.user, {
      displayName: username
    });
    
    return {
      success: true,
      message: 'Conta criada com sucesso no Firebase!',
      user: userCredential.user
    };
  } catch (error: any) {
    console.error('Firebase registration error:', error);
    
    // Translate Firebase errors to Portuguese
    let message = 'Erro ao criar conta.';
    if (error.code === 'auth/email-already-in-use') {
      message = 'Este email já está em uso.';
    } else if (error.code === 'auth/invalid-email') {
      message = 'Email inválido.';
    } else if (error.code === 'auth/weak-password') {
      message = 'Senha muito fraca. Use pelo menos 6 caracteres.';
    }
    
    return {
      success: false,
      message,
      error
    };
  }
};

export const firebaseLogin = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Map Firebase user to our User type
    const user: User = {
      id: userCredential.user.uid,
      username: userCredential.user.displayName || 'Usuário',
      email: userCredential.user.email || '',
      role: 'Basic', // Default role
      proDaysLeft: 0,
      createdAt: userCredential.user.metadata.creationTime
    };
    
    return {
      success: true,
      message: 'Login realizado com sucesso!',
      user
    };
  } catch (error: any) {
    console.error('Firebase login error:', error);
    
    // Translate Firebase errors to Portuguese
    let message = 'Erro ao fazer login.';
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      message = 'Email ou senha incorretos.';
    } else if (error.code === 'auth/invalid-email') {
      message = 'Email inválido.';
    } else if (error.code === 'auth/too-many-requests') {
      message = 'Muitas tentativas de login. Tente novamente mais tarde.';
    }
    
    return {
      success: false,
      message,
      error
    };
  }
};

export const firebaseLogout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Firebase logout error:', error);
    return { success: false, error };
  }
};

export default { firebaseRegister, firebaseLogin, firebaseLogout };
 