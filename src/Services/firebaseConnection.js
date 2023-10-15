import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
    apiKey: "AIzaSyBkAZNBb6-hPb_y53lL_WyxAU3xW8Xxbv0",
    authDomain: "tickets-915de.firebaseapp.com",
    projectId: "tickets-915de",
    storageBucket: "tickets-915de.appspot.com",
    messagingSenderId: "1091092462166",
    appId: "1:1091092462166:web:fff9a10433601529ec19f7",
    measurementId: "G-JPM01DHXQN"  
  };
  
  const firebaseApp = initializeApp(firebaseConfig)

  const db = getFirestore(firebaseApp)
  const auth = getAuth(firebaseApp)
  const storage = getStorage(firebaseApp)

  export { db, auth, storage };