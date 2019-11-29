import React, { Component } from "react";
import "./../../App.css";
import { withRouter, Link } from "react-router-dom";
import { FirebaseContext } from "../Firebase";
import basicAvatar from "../../img/basic-avatar-color.png";
import styled from "styled-components";
import { sizes } from "./../../constants/sizes";

const AvatarImage = styled.div`
  background-image: url(${basicAvatar});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 100px;
  height: 100px;
  border-radius: 15px;
  border-style: solid;
  border-color: var(--global-link-color);
`;

const UserInfoContainer = styled.div`
  margin-left: 50px;
  @media (max-width: ${sizes.mobileDevice}) {
    margin-left: 0;
    padding-top: 20px;
  }
`;

const ProfileWrapper = styled.div`
  align-items: center;
  justify-content: center;
  padding: 30px;
  display: flex;
  width: 100%;
  justify-content: center;
  font-size: 24px;
  @media (max-width: ${sizes.mobileDevice}) {
    flex-wrap: wrap;
    flex-direction: row;
    padding: 0;
    padding-top: 30px;
  }
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
            <ProfileWrapper>
              <AvatarImage />
              <UserInfoContainer>
                <div>First name: {this.state.user.firstName}</div>
                <div>Last name: {this.state.user.lastName}</div>
                <div>Email: {this.state.user.email}</div>
                <div>About: {this.state.user.about}</div>
              </UserInfoContainer>
            </ProfileWrapper>
          </div>
        )}
      </FirebaseContext.Consumer>
    );
  }
}
export default withRouter(MyProfile);
