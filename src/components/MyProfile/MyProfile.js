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
      user: {}
    };
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  componentDidMount() {
    console.log("mounted my profile ocmpoentn");
    this.props.firebase.auth.onAuthStateChanged(user => {
      if (user) {
        console.log("user logged");
        console.log("User", user);

        this.props.firebase.getUserData(user).then(userData => {
          console.log("userdata,", userData);
          this.setState(
            {
              user: {
                ...userData,
                email: user.email
              }
            },
            console.log("uthisr", this.state)
          );
        });
      }
    });
  }

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
                  <div>First name: {this.state.user.firstName}</div>
                  <div>Last name: {this.state.user.lastName}</div>
                  <div>Email: {this.state.user.email}</div>
                  <div>About: {this.state.user.about}</div>
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
