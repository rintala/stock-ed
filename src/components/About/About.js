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
import Header from "../Header/Header";

const StocksWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: center;
`;

const PortfolioWrapper = styled.div`
  justify-content: center;
  padding: 30px;
  display: flex;
`;

const AboutBody = styled.div`
  width: 60vw;
  text-align: center;
  font-size: 24px;
`;

const GraphAndTextWrapper = styled.div`
  width: 50%;
  padding: 30px;
`;
class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      pass1: "",
      pass2: "",
      stocks: [
        { id: "1", marker: "OMX30", buyPrice: 30, sellPrice: 35 },
        { id: "1", marker: "TSLA", buyPrice: 35, sellPrice: 40 }
      ]
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
              <PortfolioWrapper>
                <AboutBody>
                  Stock-ed is a project for a course at KTH.Non in cupidatat
                  magna fugiat commodo commodo aliquip laboris consectetur qui
                  dolor do id ad. Pariatur ad aliquip nostrud tempor laboris.
                  Velit enim consectetur reprehenderit labore. Laboris in ex in
                  ipsum velit proident aliquip incididunt aute. Nulla pariatur
                  consequat id labore eu voluptate consequat duis nisi mollit.
                  Dolore velit nisi quis ex nulla nisi voluptate incididunt
                  laborum.
                </AboutBody>
              </PortfolioWrapper>
            </div>
          </div>
        )}
      </FirebaseContext.Consumer>
    );
  }
}
export default withRouter(About);
