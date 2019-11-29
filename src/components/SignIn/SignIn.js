import React, { Component } from "react";
import "./../../App.css";
import { withRouter, Link } from "react-router-dom";
import SignInForm from "./SignInForm";
import styled from "styled-components";

const HeaderContainer = styled.div`
  padding-top: 25px;
  padding-bottom: 25px;
`;

const HeaderTitle = styled.div`
  font-size: 70px;
  padding-top: 30px;
  padding-bottom: 30px;
  font-weight: bold;
  display: flex;
  width: 100%;
  justify-content: center;
`;

const HeaderTitleLink = styled(Link)`
  text-decoration: none;
  color: var(--global-link-color);
  &:hover {
    color: var(--on-hover);
  }
  transition: all 0.3s ease-in-out;
`;

const HeaderSubTitle = styled.div`
  font-size: 20px;
  padding: 10px;
  display: flex;
  width: 100%;
  justify-content: center;
`;

class SignIn extends Component {
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
    console.log("THISPROPS", this.props);
    console.log("firebasee", this.props.firebase);
  }
  render() {
    return (
      /*  <FirebaseContext.Consumer>
        {firebase => ( */
      <div className="App" style={{ alignItems: "center" }}>
        <HeaderContainer>
          <HeaderTitle>
            <HeaderTitleLink
              onClick={() => this.setState({ isHomeSelected: true })}
              to="/home"
            >
              [stock-ed]
            </HeaderTitleLink>
          </HeaderTitle>
        </HeaderContainer>
        <SignInForm
          setIsAuthenticated={auth => this.props.setIsAuthenticated(auth)}
          firebase={this.props.firebase}
        />
      </div>
      /*   )}
      </FirebaseContext.Consumer> */
    );
  }
}
export default withRouter(SignIn);
