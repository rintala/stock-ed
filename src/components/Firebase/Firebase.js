import app from "firebase/app";
import "firebase/auth";
import firebase from "firebase";
import { envVar } from "../../constants/config";

const config = Object.keys(envVar).reduce((acc, key) => {
  return Object.assign(acc, { [key]: envVar[key].value });
}, {});

class Firebase {
  constructor() {
    console.log("onfig", config);
    this.app = firebase.initializeApp(config);
    this.database = firebase.database;
    /* .ref()
      .child("user")
      .on("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          var childData = childSnapshot.val();
          console.log("cx", childData);
        });
      }); */

    /*   console.log("app", app);
    this.database = app.database(); */
    console.log("database:", this.database, app);
    this.auth = firebase.auth();
  }

  componentDidMount() {
    /* this.getUserData(); */
  }

  componentDidUpdate(prevProps, prevState) {
    // check on previous state
    // only write when it's different with the new state
    if (prevState !== this.state) {
      this.writeUserData();
    }
  }

  // *** Auth API ***
  doCreateUserWithEmailAndPassword = (email, password) => {
    return this.auth.createUserWithEmailAndPassword(email, password);
  };

  doSignInWithEmailAndPassword = (email, password) => {
    return this.auth
      .signInWithEmailAndPassword(email, password)
      .then(function(firebaseUser) {
        // Success
        this.auth.updateCurrentUser(firebaseUser);
      })
      .catch(function(error) {
        // Error Handling
      });
  };

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);
  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);

  writeUserData = () => {
    this.database()
      .ref("/")
      .set(this.state);
    console.log("DATA SAVED");
  };

  getUserData = user => {
    /* let ref = this.database().ref("/"); */

    let ref = this.database()
      .ref()
      .child(user.uid);
    ref.on("value", snapshot => {
      snapshot.forEach(childSnapshot => {
        var childData = childSnapshot.val();
        console.log("cx", childData);
      });
      /*  const state = snapshot.val();
      this.setState(state);
 */
      console.log("sn", snapshot.val());
    });
    console.log("DATA RETRIEVED");
  };
}
export default Firebase;
