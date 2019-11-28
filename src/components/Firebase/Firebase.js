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
    return this.auth
      .createUserWithEmailAndPassword(email, password)
      .then(userCredential =>
        this.database()
          .ref(userCredential.user.uid)
          .set({
            about: "Avid fan of investing.",
            firstName: "Will",
            lastName: "Powell",
            fundsAvailable: 20000
          })
      );
  };

  doSignInWithEmailAndPassword = (email, password) => {
    return this.auth
      .signInWithEmailAndPassword(email, password)
      .then(function(firebaseUser) {
        // Success
        window.location.href = "/home";
        this.auth.updateCurrentUser(firebaseUser);
      })
      .catch(error => {
        // Error Handling
        console.log("error ocurred", error);
        /* this.props.history.push("/signin"); */
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
    if (newStock.totAmountInvested > 0 && newStock.totNumberBought > 0) {
      console.log("writingnewstock", user, newStock);
      let thisPostRef = this.database()
        .ref()
        .child(userId)
        .child("portfolio");

      thisPostRef.once("value", snapshot => {
        let oldFundsAvailable = this.database()
          .ref()
          .child(userId);
        let totFunds = -1;
        oldFundsAvailable
          .once("value", snapshot => {
            console.log("snapshot", snapshot);
            console.log("snapshot ref", snapshot.ref);
            console.log("snapshot", snapshot.val());

            let prevFunds = parseInt(snapshot.child("fundsAvailable").val());
            let leftFunds = prevFunds - parseInt(newStock.totAmountInvested);
            totFunds = leftFunds;
            console.log("Snapshot", snapshot);
            if (leftFunds > 0) {
              snapshot.ref.update({
                fundsAvailable:
                  parseInt(snapshot.child("fundsAvailable").val()) -
                  parseInt(newStock.totAmountInvested)
              });
            }
          })
          .then(data => {
            let hasMatch = false;
            console.log("tot funds", totFunds);
            if (totFunds >= 0) {
              let currentStocks = {};
              snapshot.val() &&
                Object.keys(snapshot.val()).forEach(key => {
                  currentStocks[key] = snapshot.val()[key];
                  console.log("key", key);
                  console.log(
                    "currentStocks[key].stockId",
                    currentStocks[key].stockId
                  );
                  console.log("newStock.stockId", newStock.stockId);
                  if (currentStocks[key].stockId === newStock.stockId) {
                    if (parseInt(newStock.totAmountInvested) > 0) {
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
                  }
                });
            }

            if (hasMatch === false) {
              thisPostRef.push().set(newStock);
            }
          });
      });
    }
  };

  sellExistingStock = (userId, stockId, sellNumber, sellPrice) => {
    if (sellNumber > 0 && sellPrice > 0) {
      let thisPostRef = this.database()
        .ref()
        .child(userId)
        .child("portfolio");
      let hasStock = false;

      thisPostRef.once("value", snapshot => {
        let currentStocks = {};

        Object.keys(snapshot.val()).forEach(key => {
          currentStocks[key] = snapshot.val()[key];
          console.log("currStocks", currentStocks[key]);
          if (currentStocks[key].stockId === stockId) {
            hasStock = true;
            if (
              parseInt(currentStocks[key].totNumberBought) >=
              parseInt(sellNumber)
            ) {
              const numberLeft =
                parseInt(currentStocks[key].totNumberBought) -
                parseInt(sellNumber);

              if (numberLeft === 0) {
                snapshot.ref.remove();
              } else {
                /* console.log("snapshot.ref.child(key)", snapshot.ref.child(key)); */
                snapshot.ref
                  .child(key)
                  .child("totNumberBought")
                  .set(numberLeft);
                snapshot.ref
                  .child(key)
                  .child("totAmountInvested")
                  .set(
                    parseInt(currentStocks[key].totAmountInvested) -
                      parseInt(sellNumber) * parseInt(sellPrice)
                  );
              }
            }
          }
        });
        if (hasStock) {
          let oldFundsAvailable = this.database()
            .ref()
            .child(userId);

          oldFundsAvailable.once("value", snapshot => {
            console.log("snapshot", snapshot);
            console.log("snapshot ref", snapshot.ref);
            console.log("snapshot", snapshot.val());
            console.log(
              "snapshot child",
              snapshot.child("fundsAvailable").val()
            );
            snapshot.ref.update({
              fundsAvailable:
                parseInt(snapshot.child("fundsAvailable").val()) +
                parseInt(sellPrice) * parseInt(sellNumber)
            });
          });
        }
      });
    }
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
          console.log("key", key);
          users[key] = snapshot.val()[key];
        });
        resolve(users);
      });
    });
  };
}
export default Firebase;
