import firebase, { db } from './index'

import React from 'react'
import { Component } from 'react';

interface App {
    input: HTMLInputElement | null
}

interface Props {
}

interface State {
    user: any | null
}

class App extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            user: null
        }
    }
    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({ user })
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
                this.setState({ user })
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
    setInputRef(element: HTMLInputElement) {
        this.input = element;
    }
    loadImage() {
        if (this.input && this.input.files) {
            let reader: any = null;
            Array.from(this.input.files).map((file: any) => {
                reader = new FileReader();
                reader.onload = async (e: any) => {
                    const storageRef = firebase.storage().ref();
                    const ref = storageRef.child('test.jpg');
                    const uploadTask = ref.putString(e.target.result, 'data_url')
                    uploadTask.on('state_changed', (snapshot: any) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                        switch (snapshot.state) {
                            case firebase.storage.TaskState.PAUSED: // or 'paused'
                                console.log('Upload is paused');
                                break;
                            case firebase.storage.TaskState.RUNNING: // or 'running'
                                console.log('Upload is running');
                                break;
                        }
                    }, (error) => {
                        console.log(error)
                    }, async () => {
                        const downloadURL = await uploadTask.snapshot.ref.getDownloadURL()
                        console.log('File available at', downloadURL);

                        // // ファイルの削除
                        // const desertRef = storageRef.child('test.jpg');
                        // desertRef.delete().then(function () {
                        //     console.log('File deleted successfully')
                        // }).catch(function (error) {
                        //     console.log(error)
                        // });

                    });
                }
                reader.readAsDataURL(file)
            });
        }
    }

    render() {
        return (<React.Fragment>
            {this.state.user ? (
                <React.Fragment>
                    <p>Welcome {this.state.user.displayName}</p>
                    <button onClick={this.signOut.bind(this)}>SignOut</button>
                    <button onClick={this.add.bind(this)}>add sample data on FireStore</button>
                    <form action="" encType="multipart/form-data">
                        <input className="file" onChange={this.loadImage.bind(this)} id="file" type="file" name="file" accept="image/*" multiple={true} ref={this.setInputRef.bind(this)} />
                        <label htmlFor="file"></label>
                    </form>
                </React.Fragment>
            ) : (
                <button onClick={this.GoogleLogin.bind(this)}>Google Login</button>
            )}
        </React.Fragment>);
    }
}

export default App