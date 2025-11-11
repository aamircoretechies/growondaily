// import { initializeApp } from "firebase/app";
// import { getAuth, GoogleAuthProvider } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyA8fHtU0Ekr_72jn5oAzI3_Z_wAmNxWwwM",
//   authDomain: "grow-on-daily.firebaseapp.com",
//   projectId: "grow-on-daily",
//   storageBucket: "grow-on-daily.firebasestorage.app",
//   messagingSenderId: "568619971767",
//   appId: "1:568619971767:web:b28765c501b773ea5c4932",
//   measurementId: "G-9RCWFTSWZJ",
// };

// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const googleProvider = new GoogleAuthProvider();




import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA8fHtU0Ekr_72jn5oAzI3_Z_wAmNxWwwM",
  authDomain: "grow-on-daily.firebaseapp.com",
  projectId: "grow-on-daily",
  storageBucket: "grow-on-daily.firebasestorage.app",
  messagingSenderId: "568619971767",
  appId: "1:568619971767:web:b28765c501b773ea5c4932",
  measurementId: "G-9RCWFTSWZJ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();

export default app;
