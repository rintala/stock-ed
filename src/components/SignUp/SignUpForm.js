import React, { Component } from "react";
import "./../../App.css";
import { withRouter, Link } from "react-router-dom";
import { FirebaseContext } from "../Firebase";
import { TextField, Button, Paper, Icon } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import ArrowbackIcon from "@material-ui/icons/ArrowBack";

class SignUpForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      pass1: "",
      pass2: "",
      error: false
    };
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value, error: false });
  };

  onSubmit = event => {
    const { username, email, pass1 } = this.state;
    this.props.firebase
      .doCreateUserWithEmailAndPassword(username, pass1)
      .then(authUser => {
        this.setState({ username: "", email: "", pass1: "", pass2: "" });
        this.props.history.push("/home");
      })
      .catch(() => {
        console.log("Error ocurred!");
        this.setState({ error: true });
      });
    event.preventDefault();
  };

  render() {
    return (
      <form
        onSubmit={this.onSubmit}
        style={{
          textAlign: "center",
          display: "flex",
          justifyContent: "center"
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            borderColor: "var(--global-link-color)",
            borderStyle: "solid",
            width: "50vw",
            margin: "30px",
            paddingTop: "20px",
            paddingBottom: "40px"
          }}
        >
          <h2>Sign Up</h2>
          <div style={{ padding: "10px" }}>
            {this.state.error ? (
              <TextField
                id="username"
                name="username"
                value={this.state.username}
                onChange={this.onChange}
                type="text"
                label="Email"
                error
                helperText="Incorrect email/password"
              ></TextField>
            ) : (
              <TextField
                id="username"
                name="username"
                value={this.state.username}
                onChange={this.onChange}
                type="text"
                label="Email"
              ></TextField>
            )}
          </div>
          <div style={{ padding: "10px" }}>
            {/* <label htmlFor="pass1">Password: </label> */}
            {this.state.error ? (
              <TextField
                id="pass1"
                name="pass1"
                value={this.state.pass1}
                onChange={this.onChange}
                type="password"
                label="Password"
                error
                helperText="Incorrect email/password"
              ></TextField>
            ) : (
              <TextField
                id="pass1"
                name="pass1"
                value={this.state.pass1}
                onChange={this.onChange}
                type="password"
                label="Password"
              ></TextField>
            )}
          </div>
          <div style={{ padding: "10px" }}>
            {this.state.error ? (
              <TextField
                id="pass2"
                name="pass2"
                value={this.state.pass2}
                onChange={this.onChange}
                type="password"
                label="Confirm password"
                error
                helperText="Incorrect email/password"
              ></TextField>
            ) : (
              <TextField
                id="pass2"
                name="pass2"
                value={this.state.pass2}
                onChange={this.onChange}
                type="password"
                label="Confirm password"
              ></TextField>
            )}
          </div>
          <div style={{ padding: "10px" }}>
            <Link to="/signin">
              <Button
                style={{ color: "grey" }}
                id="backButton"
                size="small"
                startIcon={<ArrowbackIcon />}
                style={{ margin: "10px" }}
              >
                Back
              </Button>
            </Link>
            <Button
              id="loginButton"
              type="submit"
              variant="outlined"
              endIcon={<SendIcon />}
              style={{ margin: "10px" }}
            >
              Signup
            </Button>
          </div>
        </div>
      </form>
    );
  }
}

export default withRouter(SignUpForm);
