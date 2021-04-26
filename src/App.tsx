import firebase, { db } from './index'

import React from 'react'
import { Component } from 'react';

interface App {
    input: HTMLInputElement | null
}

interface Props {
}

interface State {
    loading: boolean
    user: any | null
}

class App extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            loading: true,
            user: null
        }
    }
    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({ user })
            }
            this.setState({loading: false})
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
            {this.state.loading ? null : (this.state.user ? (
                <React.Fragment>
                    <div className="profile">
                        <img src={this.state.user.photoURL} alt="" />
                        <p>
                            {this.state.user.displayName}
                        </p>
                        <button onClick={this.signOut.bind(this)}>SignOut</button>
                    </div>
                    <br />
                    <button onClick={this.add.bind(this)}>add sample data in FireStore</button>
                    <br />
                    <br />
                    <form action="" encType="multipart/form-data">
                        <label htmlFor="file"></label>
                        <input className="file" onChange={this.loadImage.bind(this)} id="file" type="file" name="file" accept="image/*" multiple={true} ref={this.setInputRef.bind(this)} />
                    </form>
                </React.Fragment>
            ) : (
                <button onClick={this.GoogleLogin.bind(this)}>Google Login</button>
            ))}
        </React.Fragment>);
    }
}

export default App