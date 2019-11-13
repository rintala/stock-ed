import React, { Component } from "react";
import "./../../App.css";
import { withRouter, Link } from "react-router-dom";
import { FirebaseContext } from "../Firebase";
import SignInForm from "./SignInForm";
import Header from "../Header/Header";


class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      pass1: "",
      pass2: ""
    };
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  componentDidMount() {
    this.props.firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log("user logged");
      }
    });
  }
  componentDidMount() { }

  render() {
    return (
      <FirebaseContext.Consumer>
        {firebase => (
          <div className="App">
            <SignInForm firebase={firebase} />
          </div>
        )}
      </FirebaseContext.Consumer>
    );
  }
}
export default withRouter(SignIn);
