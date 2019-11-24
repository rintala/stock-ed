import app from "firebase/app";
import "firebase/auth";
import firebase from "firebase";
import { envVar } from "../../constants/config";
import { userInfo } from "os";

const config = Object.keys(envVar).reduce((acc, key) => {
  return Object.assign(acc, { [key]: envVar[key].value });
}, {});

class Firebase {
  constructor() {
    console.log("FIREBASE", firebase);
    this.app = !firebase.apps.length
      ? firebase.initializeApp(config)
      : firebase.app();
    this.database = firebase.database;
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

  writeNewStock = (userId, user, newStock) => {
    console.log("writingnewstock", user, newStock);
    let thisPostRef = this.database()
      .ref()
      .child(userId)
      .child("portfolio");

    thisPostRef.once("value", snapshot => {
      let currentStocks = {};
      let hasMatch = false;
      snapshot.val() &&
        Object.keys(snapshot.val()).forEach(key => {
          currentStocks[key] = snapshot.val()[key];
          if (currentStocks[key].stockId === newStock.stockId) {
            hasMatch = true;
            snapshot.ref.child(key).update({
              totNumberBought:
                parseInt(currentStocks[key].totNumberBought) +
                parseInt(newStock.totNumberBought),
              totAmountInvested:
                parseInt(currentStocks[key].totAmountInvested) +
                parseInt(newStock.totAmountInvested)
            });
          }
        });

      let oldFundsAvailable = this.database()
        .ref()
        .child(userId);

      oldFundsAvailable.once("value", snapshot => {
        console.log("snapshot", snapshot);
        console.log("snapshot ref", snapshot.ref);
        console.log("snapshot", snapshot.val());
        snapshot.ref.update({
          fundsAvailable:
            parseInt(snapshot.child("fundsAvailable").val()) -
            parseInt(newStock.totAmountInvested)
        });
      });

      if (hasMatch === false) {
        thisPostRef.push().set(newStock);
      }
    });
  };

  sellExistingStock = (userId, stockId, sellNumber, sellPrice) => {
    let thisPostRef = this.database()
      .ref()
      .child(userId)
      .child("portfolio");

    thisPostRef.once("value", snapshot => {
      let currentStocks = {};

      Object.keys(snapshot.val()).forEach(key => {
        currentStocks[key] = snapshot.val()[key];
        if (currentStocks[key].stockId === stockId) {
          if (
            parseInt(currentStocks[key].totNumberBought) >= parseInt(sellNumber)
          ) {
            const numberLeft =
              parseInt(currentStocks[key].totNumberBought) -
              parseInt(sellNumber);

            if (numberLeft === 0) {
              snapshot.ref.remove();
            } else {
              snapshot.ref.child(key).update({
                totNumberBought: numberLeft,
                totAmountInvested:
                  parseInt(currentStocks[key].totAmountInvested) -
                  parseInt(sellNumber) * parseInt(sellPrice)
              });

              let oldFundsAvailable = this.database()
                .ref()
                .child(userId);

              oldFundsAvailable.once("value", snapshot => {
                console.log("snapshot", snapshot);
                console.log("snapshot ref", snapshot.ref);
                console.log("snapshot", snapshot.val());
                snapshot.ref.update({
                  fundsAvailable:
                    parseInt(snapshot.child("fundsAvailable").val()) +
                    parseInt(sellPrice) * parseInt(sellNumber)
                });
              });
            }
          }
        }
      });
    });
  };

  getUserData = user => {
    console.log("user inside get", user);
    let userInfoFromDb = this.database()
      .ref()
      .child(user.uid);

    return new Promise((resolve, reject) => {
      userInfoFromDb.once("value", snapshot => {
        let users = {};
        Object.keys(snapshot.val()).forEach(key => {
          users[key] = snapshot.val()[key];
        });
        resolve(users);
      });
    });
  };
}
export default Firebase;
