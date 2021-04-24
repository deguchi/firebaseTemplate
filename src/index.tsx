import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";

import firebaseConfig from '../firebaseConfig.json'

firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();
if (location.hostname === 'localhost' || location.hostname.match(/192\.168\.0\.\w+$/)) {
    db.useEmulator('localhost', 8080);
}
export const analytics = firebase.analytics();

export default firebase

import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'

ReactDOM.render(<App />, document.getElementById('app'));