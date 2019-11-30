import React, { Component } from "react";
import "./../../App.css";
import { withRouter, Link } from "react-router-dom";
import { FirebaseContext } from "../Firebase";
import { TextField, Button, Paper, Icon } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import CreateIcon from "@material-ui/icons/Create";

class SignInForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      pass1: "",
      error: false
    };
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value, error: false });
  };

  componentDidMount() {
    /* this.props.firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log("user logged");
      }
    }); */
  }

  onSubmit = event => {
    const { username, pass1 } = this.state;
    this.props.firebase
      .doSignInWithEmailAndPassword(username, pass1)
      .then(resp => {
        if (resp !== undefined) {
          this.setState({ error: true });
        } else {
          this.setState({ error: false });
        }
        this.setState({ username: "", email: "", pass1: "" });
      })
      .catch(error => {
        console.log("errror ocurred", error);
        this.setState({ error: true });
      });
    event.preventDefault();

    /* .then(() => {
        this.props.setIsAuthenticated(true);
      }) */
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
            paddingTop: "40px",
            paddingBottom: "40px"
          }}
        >
          <div style={{ padding: "10px" }}>
            {this.state.error ? (
              <TextField
                id="username"
                name="username"
                value={this.state.username}
                onChange={this.onChange}
                type="text"
                label="Username"
                error
                helperText="Incorrect username/password"
              ></TextField>
            ) : (
              <TextField
                id="username"
                name="username"
                value={this.state.username}
                onChange={this.onChange}
                type="text"
                label="Username"
              ></TextField>
            )}
          </div>
          <div style={{ padding: "10px", paddingBottom: "20px" }}>
            {this.state.error ? (
              <TextField
                id="pass1"
                name="pass1"
                value={this.state.pass1}
                onChange={this.onChange}
                type="password"
                label="Password"
                error
                helperText="Incorrect username/password"
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
          <Button
            id="loginButton"
            type="submit"
            variant="outlined"
            endIcon={<SendIcon />}
            style={{ margin: "10px" }}
          >
            Login
          </Button>
          <Link to="/signup">
            <Button
              id="signupButton"
              endIcon={<CreateIcon />}
              variant="outlined"
              style={{ margin: "10px" }}
            >
              Signup
            </Button>
          </Link>
        </div>
        {/*  </Paper> */}
      </form>
    );
  }
}

export default withRouter(SignInForm);
