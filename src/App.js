import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Route, Link } from "react-router-dom";
import * as ROUTES from "./constants/routes";
import SignIn from "./components/SignIn/SignIn";
import SignUp from "./components/SignUp/SignUp";
import Home from "./components/Home/Home";
import StocksSearch from "./components/StocksSearch/StocksSearch";
import StockDetails from "./components/StockDetails/stockDetails";
import MyProfile from "./components/MyProfile/MyProfile";
import Error from "./components/Error/Error";
import { setEnvVars } from "./constants/config";
import { BrowserRouter } from "react-router-dom";
import Firebase, { FirebaseContext } from "./components/Firebase";
import About from "./components/About/About";

function isAllEnvVarSet() {
  const envVars = setEnvVars();

  return Object.keys(envVars).reduce((acc, key) => {
    return envVars[key] && acc;
  }, true); //Initalize it to true
}

function App() {
  console.log("app is run", isAllEnvVarSet());
  if (!isAllEnvVarSet()) {
    console.log("display error page");
    return (
      <div className="App">
        <Error errors={setEnvVars()} />
      </div>
    );
  } else {
    const firebase = new Firebase();

    return (
      <FirebaseContext.Provider value={firebase}>
        <BrowserRouter>
          <div className="App">
            <Route path={ROUTES.SIGN_IN} render={() => <SignIn history />} />
            <Route path={ROUTES.SIGN_UP} render={() => <SignUp history />} />
            {/* <Route path={ROUTES.LANDING} render={() => <SignIn history />} /> */}
            <Route
              path={ROUTES.HOME}
              render={() => <Home history firebase={firebase} />}
            />
            <Route
              path={ROUTES.STOCK_DETAILS + "/:stockID"}
              render={() => <StockDetails history />}
            />
            <Route path={ROUTES.ABOUT} render={() => <About history />} />
            <Route
              path={ROUTES.SEARCH}
              render={() => <StocksSearch history />}
            />
            <Route
              path={ROUTES.MY_PROFILE}
              render={() => <MyProfile history />}
            />

            <Route path={ROUTES.ACCOUNT} render={() => <SignIn history />} />
            <Route path={ROUTES.ADMIN} render={() => <SignIn history />} />
          </div>
        </BrowserRouter>
      </FirebaseContext.Provider>
    );
  }
}

export default App;
