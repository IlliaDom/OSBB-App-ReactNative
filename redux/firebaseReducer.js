// import firebase from "firebase";
// import "firebase/firestore";
// import "firebase/auth";
import { initializeApp } from 'firebase/app';
import {
    getAuth,
    onAuthStateChanged,
    FacebookAuthProvider,
    signInWithCredential,
} from 'firebase/auth';
import { getFirestore, setDoc, doc } from 'firebase/firestore';

const SET_USER_DATA = "SET_USER_DATA";
const SET_OSBB_NEWS = "SET_OSBB_NEWS";
const SET_OSBB = "SET_OSBB";
const SET_OSBB_VOTE = "SET_OSBB_VOTE";

// // Initialize Firebase
initializeApp({
    apiKey: "AIzaSyAljZN-9BW0DXKxuoLkUz8A7oRuzEZlpoM",
    authDomain: "osbb-135af.firebaseapp.com",
    projectId: "osbb-135af",
    storageBucket: "osbb-135af.appspot.com",
    messagingSenderId: "6918571952",
    appId: "1:6918571952:web:2f16271c6daae2ff22f875"
});
const auth = getAuth();
const firestore = getFirestore();

let initialState = {
    firebaseAuth: auth,
    firestore: firestore,
    news:null,
    osbb:null,
    vote:null,
};

const firebaseReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_DATA: {
            return {
                ...state,
                userData: action.userData,
            };
        }
        case SET_OSBB_NEWS: {
            return {
                ...state,
                news: action.data,
            };
        }
        case SET_OSBB_VOTE: {
            return {
                ...state,
                vote: action.data,
            };
        }
        case SET_OSBB: {
            return {
                ...state,
                osbb: action.data,
            };
        }
        default:
            return state;
    }
};

export const setOsbb = (data) => ({
    type: SET_OSBB,
    data: data,
});
export const setOsbbNews = (data) => ({
    type: SET_OSBB_NEWS,
    data: data,
});
export const setOsbbVote= (data) => ({
    type: SET_OSBB_VOTE,
    data: data,
});

export const getOsbb = (osbb) => async (dispatch) => {
    try {
        dispatch(setOsbb(osbb));
    } catch (error) {
        console.log(error);
    }
};
export const getOsbbNews = (news) => async (dispatch) => {
    try {
        dispatch(setOsbbNews(news));
    } catch (error) {
        console.log(error);
    }
};

export const getOsbbVote = (vote) => async (dispatch) => {
    try {
        dispatch(setOsbbVote(vote));
    } catch (error) {
        console.log(error);
    }
};
export const signOut = (firebaseAuth) => async (dispatch) => {
    try {
        await firebaseAuth.signOut();
    } catch (error) {
        console.log(error);
    }
};
export const isOnline = (firestore, user, online) => async (dispatch) => {
    try {
        await firestore.collection("users").doc(user.uid).update({
            isOnline: online,
        });
    } catch (error) { }
};

export default firebaseReducer;
