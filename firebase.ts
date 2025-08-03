import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAO3qM1FKPLPJpF7-1nSZrlhbPXoma-BzU",
  authDomain: "chessmentor-eb968.firebaseapp.com",
  projectId: "chessmentor-eb968",
  storageBucket: "chessmentor-eb968.firebasestorage.app",
  messagingSenderId: "658417001794",
  appId: "1:658417001794:web:a61a12a308fc09ab5f54db",
  measurementId: "G-MHG4105PQ0"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
export const auth = firebase.auth();
