import React, { Component } from "react";
import "./../../App.css";
import { withRouter, Link } from "react-router-dom";
import { FirebaseContext } from "../Firebase";
import NavBar from "./../NavBar/NavBar";
import Header from "../Header/Header";

class MyProfile extends Component {
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
    console.log("mounted my profile ocmpoentn");
    this.props.firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log("user logged");
        console.log("User", user);
        this.setState({ email: user.email });
      }
    });
  }

  /*   componentDidMount() {} */

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
            <Header currentPage={"My profile"} />
            <div className="contentBody" style={{ display: "flex" }}>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  fontSize: "24px"
                }}
              >
                <div>
                  <div>Name: Jonathan</div>
                  <div>Email: {this.state.email}</div>
                  <div>About: Hobby investor</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </FirebaseContext.Consumer>
    );
  }
}
export default withRouter(MyProfile);
