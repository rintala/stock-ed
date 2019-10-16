import React, { Component } from "react";
import "./../../App.css";
import { withRouter, Link } from "react-router-dom";
import { FirebaseContext } from "../Firebase";

class Home extends Component {
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
          <div>
            <div className="App">
              <header className="App-header">
                <h1>stock-ed</h1>
                <h2>HOME</h2>
              </header>
            </div>{" "}
            <div className="contentBody">
              Ut aliqua officia duis voluptate adipisicing cillum ut minim minim
              tempor velit sunt esse.
            </div>
          </div>
        )}
      </FirebaseContext.Consumer>
    );
  }
}
export default withRouter(Home);
