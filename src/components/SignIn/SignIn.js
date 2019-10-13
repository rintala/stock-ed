import React, { Component } from "react";
import "./../../App.css";
import { Link } from "react-router-dom";
import { FirebaseContext } from "../Firebase";

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

  componentDidMount() {}

  onSubmit = event => {
    const { username, email, passwordOne } = this.state;
    this.props.firebase
      .doSignInWithEmailAndPassword(email, passwordOne)
      .then(() => {
        console.log("successful login");
        this.setState({ username: "", email: "", pass1: "", pass2: "" });
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
              <h2>Sign-in</h2>
              <form onSubmit={this.onSubmit}>
                <label htmlFor="username">User: </label>
                <input
                  id="username"
                  name="username"
                  value={this.state.username}
                  onChange={this.onChange}
                  type="text"
                  placeholder="Email.."
                ></input>

                <label htmlFor="pass1">Password: </label>
                <input
                  id="pass1"
                  name="pass1"
                  value={this.state.pass1}
                  onChange={this.onChange}
                  type="password"
                  placeholder="Password.."
                ></input>
                <label htmlFor="pass2">Confirm password: </label>
                <input
                  id="pass2"
                  name="pass2"
                  value={this.state.pass2}
                  onChange={this.onChange}
                  type="password"
                  placeholder="Password.."
                ></input>
                <button id="loginButton" type="submit">
                  >Login
                </button>
              </form>
            </header>
          </div>
        )}
      </FirebaseContext.Consumer>
    );
  }
}
export default SignIn;
