import firebase from "firebase";

class Firebase {
  constructor() {
    this.init();
    this.observeAuth();
  }

  init = () => {
    firebase.initializeApp({
        apiKey: "AIzaSyDTzGF0uF05Y1l-U6aqyb7iuJglJOU0hf4",
        authDomain: "reactbootcamp-8bc82.firebaseapp.com",
        databaseURL: "https://reactbootcamp-8bc82.firebaseio.com",
        projectId: "reactbootcamp-8bc82",
        storageBucket: "reactbootcamp-8bc82.appspot.com",
        messagingSenderId: "608613070453",
        appId: "1:608613070453:web:4ffe636d90b1d3af702a3c",
        measurementId: "G-B3H1Z8VRLG"
    });
  };

  observeAuth = () => {
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
  };

  onAuthStateChanged = user => {
    if (!user) {
      try {
        firebase.auth().signInAnonymously();
      } catch ({ message }) {}
    }
  };

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  get ref() {
    return firebase.database().ref("message");
  }

  parse = snapshot => {
    const { timestamp: numberStamp, text, user } = snapshot.val();
    const { key: _id } = snapshot;
    const timestamp = new Date(numberStamp);

    const message = {
      _id,
      timestamp,
      text,
      user
    };
    return message;
  };

  on = callback => {
    this.ref
      .limitToLast(50)
      .on("child_added", snapshot => callback(this.parse(snapshot)));
  };

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }

  send = messages => {
    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];
      const message = {
        text,
        user,
        timestamp: this.timestamp
      };
      this.append(message);
    }
  };

  append = message => this.ref.push(message);

  off() {
    this.ref.off();
  }
}

Firebase.shared = new Firebase();
export default Firebase;
