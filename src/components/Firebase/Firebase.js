import app from "firebase/app";
import "firebase/auth";
import firebase from "firebase";
import { envVar } from "../../constants/config";

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
    this.state = {
      error: null
    };
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
      .then(function (firebaseUser) {
        window.location.href = "/home";

        /* this.auth.updateCurrentUser(firebaseUser); */
      });
    /* .catch(error => {
        // Error Handling
        /* window.location.href = "/signin";
        console.log("error ocurred", error); */
    /*  return error; */
    /* this.props.history.push("/signin"); */
    /* });  */
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
    return new Promise((resolve, reject) => {
      if (newStock.totAmountInvested > 0 && newStock.totNumberBought > 0) {
        // console.log("writingnewstock", user, newStock);
        let thisPostRef = this.database()
          .ref()
          .child(userId)
          .child("portfolio");

        thisPostRef.once("value", snapshot => {
          let oldFundsAvailable = this.database()
            .ref()
            .child(userId);

          let availableFunds = -1;
          oldFundsAvailable
            .once("value", snapshot => {
              // console.log("snapshot", snapshot);
              // console.log("snapshot ref", snapshot.ref);
              // console.log("snapshot", snapshot.val());

              //TODO: Add courtage here
              const currentFunds = parseInt(
                snapshot.child("fundsAvailable").val()
              );
              const purchaseCost = parseInt(newStock.totAmountInvested);
              const courtage = (purchaseCost * 0.15) / 100;

              availableFunds = currentFunds - purchaseCost - courtage;

              if (availableFunds >= 0) {
                snapshot.ref.update({ fundsAvailable: availableFunds });
              }
            })
            .then(data => {
              console.log(data);
              if (availableFunds < 0) {
                reject();
                return;
              }
              console.log("Has enough funds");
              let hasMatch = false;
              // console.log("tot funds", availableFunds);
              // console.log("tot data", data);
              let currentStocks = {};
              snapshot.val() &&
                Object.keys(snapshot.val()).forEach(key => {
                  currentStocks[key] = snapshot.val()[key];
                  // console.log("key", key);
                  // console.log(
                  //   "currentStocks[key].stockId",
                  //   currentStocks[key].stockId
                  // );
                  // console.log("newStock.stockId", newStock.stockId);

                  if (currentStocks[key].stockId === newStock.stockId) {
                    if (parseInt(newStock.totAmountInvested) > 0) {
                      hasMatch = true;
                      console.log("Does this happen?");

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

              if (hasMatch === false) {
                thisPostRef.push().set(newStock);
              }
              resolve();
            });
        });
      } else {
        reject();
      }
    });
  };

  sellExistingStock = (userId, stockId, sellNumber, sellPrice) => {
    console.log('Trying to sell stock')
    console.log('selling amount: ', sellNumber)
    console.log('selling price: ', sellPrice)
    const soldAmount = parseInt(sellNumber);

    return new Promise((resolve, reject) => {
      console.log("Inside the promise")
      if (sellNumber > 0 && sellPrice > 0) {

        let thisPostRef = this.database()
          .ref()
          .child(userId)
          .child("portfolio");

        console.log("Before once")
        thisPostRef.once("value", snapshot => {
          console.log("In once")
          let currentStocks = {};
          console.log(snapshot.val())
          if (!snapshot.val()) {
            console.log("trying to sell a stock which isn't in the portfolio, rejecting")
            reject()
            return
          }
          Object.keys(snapshot.val()).forEach(key => {
            currentStocks[key] = snapshot.val()[key];
            const stocksOwned = parseInt(currentStocks[key].totNumberBought);
            const stocksLeftInPortfolio = stocksOwned - soldAmount;

            if (currentStocks[key].stockId === stockId) {
              // Stock in portfolio
              if (stocksLeftInPortfolio < 0) {
                console.log("trying to sell more stocks than owned, rejecting")
                reject();
                return;
              }
              if (stocksLeftInPortfolio === 0) {
                // Removing the stock from the portfolio

                //TODO: Remove stock from portfolio!!

                console.log("All stocks in portfolio sold")
                console.log(this.database().ref().child(stockId))
                // this.database().ref().child(stockId).remove()
                // this.database().ref().set({ [stockId]: null })
                // snapshot.ref.child(stockId).remove()
                this.database().ref().child(stockId).removeValue();

              } else {
                // Didn't sell all the stocks
                console.log("part of the stocks in portfolio sold")
                snapshot.ref.child(key).child("totNumberBought").set(
                  stocksLeftInPortfolio
                );
                snapshot.ref.child(key).child("totAmountInvested").set(
                  parseInt(currentStocks[key].totAmountInvested) -
                  soldAmount * parseInt(sellPrice)
                );
              }


              // Stocks sold, now updating the funds amount
              const oldFundsAvailable = this.database().ref().child(userId);

              oldFundsAvailable.once("value", snapshot => {
                snapshot.ref.update({
                  fundsAvailable:
                    parseInt(snapshot.child("fundsAvailable").val()) +
                    parseInt(sellPrice) * soldAmount
                });
              });
              console.log("The funds are now updated, resolving")
              resolve();
              return
            } else {
              console.log("This isn't the stock we're selling, countinue")
            }
          });
        });
      } else {
        console.log("Sell price or sell number are 0 or below, rejecting")
        reject("Sell price or sell number are 0 or below")
        return
      }
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
          console.log("key", key);
          users[key] = snapshot.val()[key];
        });
        resolve(users);
      });
    });
  };
}
export default Firebase;
