import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "medix-doctor-app",
  appId: "1:597194135286:web:5277699f8433217ff7fed7",
  storageBucket: "medix-doctor-app.firebasestorage.app",
  apiKey: "AIzaSyBU-4B76uwrc13w-aUUYujASuRmgHBm1wE",
  authDomain: "medix-doctor-app.firebaseapp.com",
  messagingSenderId: "597194135286",
};

// Initialize Firebase only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
