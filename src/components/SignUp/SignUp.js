import React, { Component } from "react";
import "./../../App.css";
import { Link } from "react-router-dom";
import { FirebaseContext } from "../Firebase";
import SignUpForm from "./SignUpForm";
class SignUp extends Component {
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
    /* this.props.firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log("user logged");
      }
    }); */
  }

  componentDidMount() {}

  onSubmit = event => {
    console.log("this props", this.props);
    const { username, email, passwordOne } = this.state;
    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        this.setState({ username: "", email: "", pass1: "", pass2: "" });
        console.log("user signed up", authUser);
      })
      .catch(error => {
        this.setState({ error });
      });
    event.preventDefault();
  };

  render() {
    return (
      <FirebaseContext.Consumer>
        {firebase => (
          <div className="App">
            <header className="App-header">
              <h1>stock-ed</h1>
              <h2>Sign-up</h2>
              <SignUpForm firebase={firebase} />
            </header>
          </div>
        )}
      </FirebaseContext.Consumer>
    );
  }
}
export default SignUp;
