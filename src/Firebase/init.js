// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAKQj5FkAkCd8FeG2cSRXYgzFYQ_XKV_Bo",
  authDomain: "week7-zechen.firebaseapp.com",
  projectId: "week7-zechen",
  storageBucket: "week7-zechen.firebasestorage.app",
  messagingSenderId: "495128956003",
  appId: "1:495128956003:web:d15d7922a717c18f27fc56",
  measurementId: "G-NWHLLWC1VZ"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase services
const analytics = getAnalytics(firebaseApp);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

// Export Firebase services for use in other files
export { firebaseApp, analytics, auth, db, storage };

// Export Firebase authentication functions
export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

// Export Firestore functions
export {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot
} from "firebase/firestore";

// Export Storage functions
export {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "firebase/storage";

// Console log for debugging
console.log("Firebase initialized successfully!");
console.log("Available services: Auth, Firestore, Storage, Analytics");