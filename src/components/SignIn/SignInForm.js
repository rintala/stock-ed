import React, { Component } from "react";
import "./../../App.css";
import { withRouter, Link } from "react-router-dom";
import { FirebaseContext } from "../Firebase";
import { TextField, Button, Paper, Icon } from '@material-ui/core';

class SignInForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      pass1: ""
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

  onSubmit = event => {
    const { username, email, pass1 } = this.state;
    this.props.firebase
      .doSignInWithEmailAndPassword(username, pass1)
      .then(() => {
        console.log("successful login");
        this.setState({ username: "", email: "", pass1: "" });
        this.props.setIsAuthenticated(true);
        this.props.history.push("/home");
      })
      .catch(error => {
        console.log("login error", error);
        this.setState({ error });
      });
    event.preventDefault();
  };

  render() {
    return (
      <form onSubmit={this.onSubmit} style={{ textAlign: "center" }}>
        <Paper>
          <div style={{ padding: "10px" }}>
            <TextField
              id="username"
              name="username"
              value={this.state.username}
              onChange={this.onChange}
              type="text"
              label="Username"
            ></TextField>
            {/* <label htmlFor="username">User: </label>
          <input
            id="username"
            name="username"
            value={this.state.username}
            onChange={this.onChange}
            type="text"
            placeholder="Email.."
            style={{ marginLeft: "45px" }}
          ></input> */}
          </div>
          <div style={{ paddingBottom: "20px" }}>
            {/* <label htmlFor="pass1">Password: </label>
          <input
            id="pass1"
            name="pass1"
            value={this.state.pass1}
            onChange={this.onChange}
            type="password"
            placeholder="Password.."
            style={{ marginLeft: "10px" }}
          ></input> */}
            <TextField
              id="pass1"
              name="pass1"
              value={this.state.pass1}
              onChange={this.onChange}
              type="password"
              label="Password"
            ></TextField>
          </div>

          <Button id="loginButton" type="submit">
            Login
        </Button>
          <Link to="/signup">
            <Button id="signupButton">Signup</Button>
          </Link>
        </Paper>
      </form>
    );
  }
}

export default withRouter(SignInForm);
