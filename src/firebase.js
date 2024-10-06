import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const config = {
   apiKey: "AIzaSyBhQRfzanT9sX0FTfiw1b4SLW1lsUl9QJQ",
   authDomain: "scu-theta-tau-website.firebaseapp.com",
   projectId: "scu-theta-tau-website",
   storageBucket: "scu-theta-tau-website.appspot.com",
   messagingSenderId: "126559078877",
   appId: "1:126559078877:web:853dfd16e3ba197e7c4e34"
};

const firebaseApp = initializeApp(config);
export const auth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);