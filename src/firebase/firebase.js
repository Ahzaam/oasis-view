import { initializeApp } from 'firebase/app';


const firebaseConfig = {
  apiKey: "AIzaSyCXzhUNs3rUZTB2FBk1w8tFNfXXSezizzY",
  authDomain: "oasis-e-model-review.firebaseapp.com",
  projectId: "oasis-e-model-review",
  storageBucket: "oasis-e-model-review.appspot.com",
  messagingSenderId: "1061988688810",
  appId: "1:1061988688810:web:84a7a82d1646510b20c1d3",
  measurementId: "G-YY4X9YMSSP"
};


const firebaseApp = initializeApp(firebaseConfig);

 
export default firebaseApp;