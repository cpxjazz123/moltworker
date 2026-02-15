import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth, GoogleAuthProvider, OAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getDataConnect, connectDataConnectEmulator } from 'firebase/data-connect'
import { connectorConfig } from '@/lib/dataconnect'

const firebaseConfig = {
  apiKey: "AIzaSyBmNZML3E3V3p-4wjQmGJFOutOYd-04dC4",
  appId: "1:879214528363:web:88ad724181b82dd435ee2e",
  authDomain: "anify-oiy-ai.firebaseapp.com",
  measurementId: "G-VFZY67M6F5",
  messagingSenderId: "879214528363",
  projectId: "anify-oiy-ai",
  storageBucket: "anify-oiy-ai.firebasestorage.app",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Data Connect
const dataConnect = getDataConnect(app, connectorConfig);

// Connect to emulator in development
if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATOR === 'true') {
  connectDataConnectEmulator(dataConnect, 'localhost', 9399);
}

// Google Provider
const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({ prompt: "select_account" });

// Apple Provider
const appleProvider = new OAuthProvider("apple.com");

appleProvider.addScope("email");
appleProvider.addScope("name");

export { analytics, app, appleProvider, auth, dataConnect, db, googleProvider };
