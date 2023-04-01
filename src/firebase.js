import {initializeApp} from 'firebase/app'
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'
import{getAuth} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyAwTycULsy0xF8TCRYLJyy9BN2LoFIJGwg",
  authDomain: "react-register-b8c94.firebaseapp.com",
  databaseURL: "https://react-register-b8c94-default-rtdb.firebaseio.com",
  projectId: "react-register-b8c94",
  storageBucket: "react-register-b8c94.appspot.com",
  messagingSenderId: "164152895706",
  appId: "1:164152895706:web:e40a27e2512730eace9de3",
  measurementId: "G-3W6P19D13M"
  };

  const app=initializeApp(firebaseConfig);
  const db=getFirestore(app)
  const storage=getStorage(app)
  const auth=getAuth(app)
  export {app,db,storage,auth}