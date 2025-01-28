import { initializeApp } from "firebase/app"
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyD9VHsUkBt32HMrv9qSUh3F1Faq-X6orx8",
  authDomain: "myjournal-22151.firebaseapp.com",
  projectId: "myjournal-22151",
  storageBucket: "myjournal-22151.firebasestorage.app",
  messagingSenderId: "680387600580",
  appId: "1:680387600580:web:1611b2d54c5e1fdcc0e991",
  measurementId: "G-WP88S4S0DS",
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)
const googleProvider = new GoogleAuthProvider()

export { auth, db, storage, googleProvider, signInWithPopup, createUserWithEmailAndPassword }

