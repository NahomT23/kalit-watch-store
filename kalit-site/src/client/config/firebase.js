import { getFirestore } from "firebase/firestore"
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signOut } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDqJt9PWcGZVmO0ZRFMMvbuHtgL8R4p1hA",
  authDomain: "kalit-9642f.firebaseapp.com",
  projectId: "kalit-9642f",
  storageBucket: "kalit-9642f.appspot.com",
  messagingSenderId: "1026822599536",
  appId: "1:1026822599536:web:26d3583d680baf24e495b5",
  measurementId: "G-WFG0HZGHCR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
const analytics = getAnalytics(app);

export const db = getFirestore(app)
export { signOut }; // Export signOut
