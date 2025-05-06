import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBgQbcevQJlAKdEVE9S14dmJ7jgsb-7zeU",
  authDomain: "crowdfunding-platform-firebase.firebaseapp.com",
  projectId: "crowdfunding-platform-firebase",
  storageBucket: "crowdfunding-platform-firebase.firebasestorage.app",
  messagingSenderId: "34269933246",
  appId: "1:34269933246:web:cba059ca33434bf8e2b8ef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Create admin user if it doesn't exist
auth.onAuthStateChanged(async (user) => {
  if (user && user.email === "admin@startfund.com") {
    const adminDoc = await db.collection("users").doc(user.uid).get();
    if (!adminDoc.exists) {
      await db.collection("users").doc(user.uid).set({
        email: "admin@startfund.com",
        role: "admin",
        createdAt: new Date(),
        displayName: "Admin",
      });
    }
  }
});

export default app;