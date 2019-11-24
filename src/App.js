import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Route, Link, Redirect } from "react-router-dom";
import * as ROUTES from "./constants/routes";
import SignIn from "./components/SignIn/SignIn";
import SignUp from "./components/SignUp/SignUp";
import Home from "./components/Home/Home";
import StocksSearch from "./components/StocksSearch/StocksSearch";
import StockDetails from "./components/StockDetails/StockDetails";
import MyProfile from "./components/MyProfile/MyProfile";
import Error from "./components/Error/Error";
import { setEnvVars } from "./constants/config";
import { BrowserRouter } from "react-router-dom";
import Firebase, { FirebaseContext } from "./components/Firebase";
import About from "./components/About/About";
import Header from "./components/Header/Header";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import NavBar from "./components/NavBar/NavBar";

import { withAuthProtection } from "./components/Authentication/withAuthProtection";

function isAllEnvVarSet() {
  const envVars = setEnvVars();

  return Object.keys(envVars).reduce((acc, key) => {
    return envVars[key] && acc;
  }, true); //Initalize it to true
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      firebase: null,
      isAllEnvVarSet: false,
      authUser: null
    };
  }

  componentDidMount() {
    if (isAllEnvVarSet()) {
      this.setState(
        prevState => {
          const firebase =
            prevState.firebase != null ? prevState.firebase : new Firebase();
          console.log("FIREBASE!!", firebase);
          console.log("FIREBASE!!", firebase.auth.currentUser);
          return {
            firebase: firebase,
            isAllEnvVarSet: true
          };
        },
        () =>
          this.state.firebase.auth.onAuthStateChanged(authUser => {
            authUser
              ? this.setState({ authUser })
              : this.setState({ authUser: null });
          })
      );
    }
  }

  randomGen() {
    const randInt = Math.random();
    console.log("xxx", randInt);
    return randInt;
  }
  render() {
    console.log("App loaded");

    return !this.state.isAllEnvVarSet ? (
      <div className="App">
        <Error errors={setEnvVars()} />
      </div>
    ) : (
      <FirebaseContext.Provider value={this.state.firebase}>
        <BrowserRouter>
          <div className="App">
            {this.state.isAuthenticated && (
              <Header isCurrentlySelected={"home"} />
            )}
            <Route
              path={ROUTES.SIGN_IN}
              render={props => (
                <SignIn
                  {...props}
                  setIsAuthenticated={auth =>
                    this.setState({ isAuthenticated: auth })
                  }
                  firebase={this.state.firebase}
                  history
                />
              )}
            />
            <Route path={ROUTES.SIGN_UP} render={() => <SignUp history />} />
            <PrivateRoute
              authUser={this.state.authUser}
              path={[ROUTES.HOME]}
              key={this.randomGen()}
              keyProp={this.randomGen()}
              component={props => (
                <Home
                  key={this.randomGen()}
                  history
                  firebase={this.state.firebase}
                  {...props}
                />
              )}
            />
            <PrivateRoute
              authUser={this.state.authUser}
              path={ROUTES.STOCK_DETAILS + "/:stockName/:stockID"}
              component={props => (
                <StockDetails
                  history
                  firebase={this.state.firebase}
                  {...props}
                />
              )}
            />
            <PrivateRoute
              authUser={this.state.authUser}
              path={ROUTES.ABOUT}
              component={props => (
                <About history firebase={this.state.firebase} {...props} />
              )}
            />
            <PrivateRoute
              path={ROUTES.SEARCH}
              authUser={this.state.authUser}
              firebase={this.state.firebase}
              component={props => (
                <StocksSearch
                  firebase={this.state.firebase}
                  history
                  {...props}
                />
              )}
            />
            <PrivateRoute
              path={ROUTES.MY_PROFILE}
              authUser={this.state.authUser}
              component={props => (
                <MyProfile history firebase={this.state.firebase} {...props} />
              )}
            />
          </div>
        </BrowserRouter>
      </FirebaseContext.Provider>
    );
  }
}
