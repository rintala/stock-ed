import React, { Component } from "react";
import "./../../App.css";
import { Link } from "react-router-dom";
import { FirebaseContext } from "../Firebase";

class SignUpForm extends Component {
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
    const { username, email, pass1 } = this.state;
    this.props.firebase
      .doCreateUserWithEmailAndPassword(username, pass1)
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
          >Signup
        </button>
      </form>
    );
  }
}

export default SignUpForm;
