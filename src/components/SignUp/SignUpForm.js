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
        /* return <Redirect to="/home" push />; */
        this.props.history.push("/home");
      })
      .catch(error => {
        this.setState({ error });
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
        {/* <label htmlFor="username">User: </label> */}
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
            <TextField
              id="username"
              name="username"
              value={this.state.username}
              onChange={this.onChange}
              type="text"
              label="Email"
            ></TextField>
          </div>
          <div style={{ padding: "10px" }}>
            {/* <label htmlFor="pass1">Password: </label> */}
            <TextField
              id="pass1"
              name="pass1"
              value={this.state.pass1}
              onChange={this.onChange}
              type="password"
              label="Password"
            ></TextField>
          </div>
          <div style={{ padding: "10px" }}>
            {/* <label htmlFor="pass2">Confirm password: </label> */}
            <TextField
              id="pass2"
              name="pass2"
              value={this.state.pass2}
              onChange={this.onChange}
              type="password"
              label="Confirm password"
            ></TextField>
          </div>
          <div style={{ padding: "10px" }}>
            <Link to="/signin">
              <Button
                style={{ color: "grey" }}
                id="backButton"
                size="small"
                // variant="outlined"
                startIcon={<ArrowbackIcon />}
              >
                Back
              </Button>
            </Link>
            <Button
              id="loginButton"
              type="submit"
              variant="outlined"
              endIcon={<SendIcon />}
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
