// Import the functions you need from the SDKs you need
import * as firebase from "firebase";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAljZN-9BW0DXKxuoLkUz8A7oRuzEZlpoM",
    authDomain: "osbb-135af.firebaseapp.com",
    projectId: "osbb-135af",
    storageBucket: "osbb-135af.appspot.com",
    messagingSenderId: "6918571952",
    appId: "1:6918571952:web:2f16271c6daae2ff22f875"
};

// Initialize Firebase
let app 
if (firebase.apps.length === 0 ){
    app = initializeApp(firebaseConfig);
}else {
    app = firebase.app()
}

const auth = firebase.auth()

export {auth}