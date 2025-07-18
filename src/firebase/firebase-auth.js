import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


//  for development 
// if (process.env.NODE_ENV === 'development') {
//   auth.settings.appVerificationDisabledForTesting = true;
// }

export { auth, RecaptchaVerifier, signInWithPhoneNumber };




// REACT_APP_FIREBASE_API_KEY=AIzaSyCNjxAIum2sUIaNv8zYzf_ooF8FwW71SFw
// REACT_APP_FIREBASE_AUTH_DOMAIN=v3careapp-1560246438112.firebaseapp.com
// REACT_APP_FIREBASE_DATABASE_URL=https://v3careapp-1560246438112.firebaseio.com
// REACT_APP_FIREBASE_PROJECT_ID=v3careapp-1560246438112
// REACT_APP_FIREBASE_STORAGE_BUCKET=v3careapp-1560246438112.firebasestorage.app
// REACT_APP_FIREBASE_MESSAGING_SENDER_ID=857656837080
// REACT_APP_FIREBASE_APP_ID=1:857656837080:web:36aa2b231791cacff5e8ad
