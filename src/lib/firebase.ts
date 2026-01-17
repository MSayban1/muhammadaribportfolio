import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set, push, remove, update, onValue, DataSnapshot } from 'firebase/database';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBI4Su3YzW7avlJ9GUsNQvGYtv1YjzvHL4",
  authDomain: "arib-portfolio.firebaseapp.com",
  databaseURL: "https://arib-portfolio-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "arib-portfolio",
  storageBucket: "arib-portfolio.firebasestorage.app",
  messagingSenderId: "686166324284",
  appId: "1:686166324284:web:a7b91a8f84fdbbfbacff39"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);

// Database helpers
export const dbRef = (path: string) => ref(database, path);

export const getData = async (path: string) => {
  try {
    const snapshot = await get(dbRef(path));
    return snapshot.exists() ? snapshot.val() : null;
  } catch (error) {
    console.error(`Firebase getData error for ${path}:`, error);
    return null;
  }
};

export const setData = async (path: string, data: any) => {
  try {
    await set(dbRef(path), data);
    return true;
  } catch (error) {
    console.error(`Firebase setData error for ${path}:`, error);
    throw error;
  }
};

export const pushData = async (path: string, data: any) => {
  try {
    const newRef = push(dbRef(path));
    await set(newRef, data);
    return newRef.key;
  } catch (error) {
    console.error(`Firebase pushData error for ${path}:`, error);
    throw error;
  }
};

export const updateData = async (path: string, data: any) => {
  try {
    await update(dbRef(path), data);
    return true;
  } catch (error) {
    console.error(`Firebase updateData error for ${path}:`, error);
    throw error;
  }
};

export const removeData = async (path: string) => {
  try {
    await remove(dbRef(path));
    return true;
  } catch (error) {
    console.error(`Firebase removeData error for ${path}:`, error);
    throw error;
  }
};

export const subscribeToData = (path: string, callback: (data: any) => void) => {
  const unsubscribe = onValue(
    dbRef(path), 
    (snapshot: DataSnapshot) => {
      callback(snapshot.exists() ? snapshot.val() : null);
    }, 
    (error) => {
      console.error(`Firebase subscription error for ${path}:`, error);
      callback(null);
    }
  );
  return unsubscribe;
};

// Auth helpers
export const login = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signup = async (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const logout = async () => {
  return signOut(auth);
};

export const subscribeToAuth = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Image to Base64 converter
export const imageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// Types
export interface Profile {
  name: string;
  headline1: string;
  headline2: string;
  intro: string;
  picture: string;
  bannerImage: string;
  yearsExperience: number;
  clientsWorked: number;
}

export interface Skill {
  id?: string;
  name: string;
  icon: string;
}

export interface Service {
  id?: string;
  title: string;
  description: string;
  image: string;
  details: string;
}

export interface Project {
  id?: string;
  title: string;
  description: string;
  image: string;
  link?: string;
}

export interface Testimonial {
  id?: string;
  name: string;
  stars: number;
  feedback: string;
  image?: string;
  approved?: boolean;
}

export interface ServiceReview {
  id?: string;
  name: string;
  stars: number;
  feedback: string;
  image?: string;
  date: string;
  approved?: boolean;
}

export interface Post {
  id?: string;
  title: string;
  content: string;
  image: string;
  date: string;
}

export interface HireRequest {
  id?: string;
  name: string;
  email: string;
  message: string;
  serviceId: string;
  serviceName: string;
  date: string;
  status: 'pending' | 'contacted' | 'completed';
}

export interface ContactSubmission {
  id?: string;
  name: string;
  email: string;
  website?: string;
  message: string;
  date: string;
  read: boolean;
}

export interface SocialLinks {
  email: string;
  linkedin: string;
  facebook: string;
  instagram: string;
}

export interface Visitor {
  ip: string;
  country: string;
  city?: string;
  lastVisit: string;
  visitCount: number;
}

export interface Analytics {
  pageViews: number;
  visitors: { [key: string]: Visitor };
}

export interface CreatorInfo {
  name: string;
  link: string;
}
