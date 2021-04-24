import firebase, {db} from './index'

import React from 'react'
import {Component} from 'react';

interface Props {
}

interface State {
    user: any | null
}

class App extends Component<Props, State> {
    constructor(props:Props) {
        super(props)
        this.state = {
            user: null
        }
    }
    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              this.setState({user})
            }
        });
        firebase.auth()
            .getRedirectResult()
            .then((result) => {
                if (result.credential) {
                    const credential = result.credential;
                    const token = credential.accessToken;
                }
                const user = result.user;
                console.log(user)
                this.setState({user})
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.email;
                const credential = error.credential;
                console.log(errorCode, errorMessage, email, credential)
            });
    }
    GoogleLogin() {
        const provider = new firebase.auth.GoogleAuthProvider()
        provider.addScope('https://www.googleapis.com/auth/contacts.readonly')
        firebase.auth().signInWithRedirect(provider)
    }
    signOut() {
        firebase.auth().signOut().then(() => {
            // Sign-out successful.
            location.reload()
          }).catch((error) => {
            // An error happened.
          });          
    }
    add() {
        db.collection("users").add({
            first: "Ada",
            last: "Lovelace",
            born: 1815
        })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);

        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        })
        db.collection("users").get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    }
    render() {
        return (<React.Fragment>
            {this.state.user ? (
                <React.Fragment>
                    <p>Welcome {this.state.user.displayName}</p>
                    <button onClick={this.signOut.bind(this)}>SignOut</button>
                    <button onClick={this.add.bind(this)}>add sample data on FireStore</button>
                </React.Fragment>
            ) : (
                <button onClick={this.GoogleLogin.bind(this)}>Google Login</button>
            )}
        </React.Fragment>);
    }
}

export default App