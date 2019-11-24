import React, { Component } from "react";
import "./../../App.css";
import { withRouter, Link } from "react-router-dom";
import { FirebaseContext } from "../Firebase";
import NavBar from "./../NavBar/NavBar";
import Header from "../Header/Header";
import basicAvatar from "../../img/basic-avatar-color.png";
import styled from "styled-components";

const AvatarImage = styled.div`
  background-image: url(${basicAvatar});
  background-size: contain;
  background-repeat: no-repeat;
  background-position-y: center;
  width: 100px;
`;

const UserInfoContainer = styled.div`
  margin-left: 20px;
`;

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
    this.props.firebase.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        authUser
          ? localStorage.setItem("authUser", JSON.stringify(authUser))
          : localStorage.removeItem("authUser");

        this.props.firebase.getUserData(authUser).then(userData => {
          console.log("userdata,", userData);
          this.setState(
            {
              user: {
                ...userData,
                email: authUser.email
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
            <div className="contentBody" style={{ display: "flex" }}>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  fontSize: "24px"
                }}
              >
                <AvatarImage />
                <UserInfoContainer>
                  <div>First name: {this.state.user.firstName}</div>
                  <div>Last name: {this.state.user.lastName}</div>
                  <div>Email: {this.state.user.email}</div>
                  <div>About: {this.state.user.about}</div>
                </UserInfoContainer>
              </div>
            </div>
          </div>
        )}
      </FirebaseContext.Consumer>
    );
  }
}
export default withRouter(MyProfile);
