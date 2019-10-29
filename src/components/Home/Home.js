import React, { Component } from "react";
import "./../../App.css";
import { withRouter, Link } from "react-router-dom";
import { FirebaseContext } from "../Firebase";

import CheckIcon from "@material-ui/icons/Check";
import NavBar from "./../NavBar/NavBar";
import StockCard from "./../StockCard/StockCard";
import styled from "styled-components";
import {
  Card,
  Typography,
  CardContent,
  Button,
  CardActions
} from "@material-ui/core";

const HeaderContainer = styled.div`
  padding-top: 25px;
  padding-bottom: 25px;
`;

const HeaderTitle = styled.div`
  font-size: 30px;
  padding: 30px;
`;

const HeaderTitleLink = styled.a`
  color: red;
`;

const HeaderSubTitle = styled.div`
  font-size: 20px;
  padding: 10px;
`;

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
              <HeaderContainer>
                <HeaderTitle>
                  <Link to="/home">
                    <HeaderTitleLink>stock-ed</HeaderTitleLink>
                  </Link>
                </HeaderTitle>

                <HeaderSubTitle>HOME - My Portfolio</HeaderSubTitle>
                <NavBar />
              </HeaderContainer>

              <div className="contentBody" style={{ display: "flex" }}>
                <div id="graphAndTextWrapper" style={{ width: "50%" }}>
                  <div>GRAPH 1</div>
                  <div>
                    Ut aliqua officia duis voluptate adipisicing cillum ut minim
                    minim tempor velit sunt esse.
                  </div>
                  <StockCard />
                </div>
                <div id="graphWrapper" style={{ width: "50%" }}>
                  <div>GRAPH 2</div>
                  <div>GRAPH 3</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </FirebaseContext.Consumer>
    );
  }
}
export default withRouter(Home);
