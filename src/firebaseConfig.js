import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCva9SFaTlcorGU7ZZado7UabQN6AXXjIo",
  authDomain: "renga-b3beb.firebaseapp.com",
  projectId: "renga-b3beb",
  storageBucket: "renga-b3beb.firebasestorage.app",
  messagingSenderId: "867278181918",
  appId: "1:867278181918:web:5b6833a580003b6369800f",
  measurementId: "G-YMG6KQ3Z76"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
