import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Route, Link } from "react-router-dom";
import * as ROUTES from "./constants/routes";
import SignIn from "./components/SignIn/SignIn";
import SignUp from "./components/SignUp/SignUp";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Route path={ROUTES.SIGN_IN} render={() => <SignIn />} />
        <Route path={ROUTES.SIGN_UP} render={() => <SignUp />} />
        <Route path={ROUTES.LANDING} render={() => <SignIn />} />
        <Route path={ROUTES.HOME} render={() => <SignIn />} />
        <Route path={ROUTES.ACCOUNT} render={() => <SignIn />} />
        <Route path={ROUTES.ADMIN} render={() => <SignIn />} />
      </header>
    </div>
  );
}

export default App;
