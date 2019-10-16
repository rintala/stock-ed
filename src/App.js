import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Route, Link } from "react-router-dom";
import * as ROUTES from "./constants/routes";
import SignIn from "./components/SignIn/SignIn";
import SignUp from "./components/SignUp/SignUp";
import Home from "./components/Home/Home";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Route path={ROUTES.SIGN_IN} render={() => <SignIn history />} />
        <Route path={ROUTES.SIGN_UP} render={() => <SignUp history />} />
        {/* <Route path={ROUTES.LANDING} render={() => <SignIn history />} /> */}
        <Route path={ROUTES.HOME} render={() => <Home history />} />
        <Route path={ROUTES.ACCOUNT} render={() => <SignIn history />} />
        <Route path={ROUTES.ADMIN} render={() => <SignIn history />} />
      </header>
    </div>
  );
}

export default App;
