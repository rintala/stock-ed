import React, { Component } from "react";
import "./../../App.css";
import { withRouter, Link } from "react-router-dom";
import { FirebaseContext } from "../Firebase";

import "../../../node_modules/react-vis/dist/style.css";
import { XYPlot, LineSeries } from "react-vis";

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
  flex-wrap: wrap;
`;

const GraphAndTextWrapper = styled.div`
  width: 50%;
  padding: 30px;
`;

const GraphAndTextTitle = styled.div`
  padding-top: 20px;
  padding-bottom: 20px;
  font-size: 30px;
  font-weight: 600;
  color: var(--global-link-color);
`;

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      stocks: [
        { id: "1", marker: "OMX30", buyPrice: 30, sellPrice: 35 },
        { id: "2", marker: "TSLA", buyPrice: 35, sellPrice: 40 }
      ]
    };
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  /*   componentDidMount() {
    this.props.firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log("user logged");
      }
    });

    console.log("firebase", this.props.firebase);
  } */
  componentDidMount = () => {
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

    console.log("firebase", this.props.firebase);
    /* const user = this.props.firebase.getUserData(); */

    console.log("htis, auth curr user", this.props.firebase.auth.currentUser);
    if (this.props.firebase.auth.currentUser) {
      this.props.firebase.getUserData(this.props.firebase.auth.currentUser);
    }
    console.log("HSI");
    /* const currentUser = this.props.firebase.auth.currentUser;
    if (currentUser) {
      console.log("currentUserId", currentUser.uid);

    } */
    /*     console.log("user", user); */
  };

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
    const data = [
      { x: 0, y: 8 },
      { x: 1, y: 5 },
      { x: 2, y: 4 },
      { x: 3, y: 9 },
      { x: 4, y: 1 },
      { x: 5, y: 7 },
      { x: 6, y: 6 },
      { x: 7, y: 3 },
      { x: 8, y: 2 },
      { x: 9, y: 0 }
    ];
    console.log("this.state.user.portfolio", this.state.user.portfolio);
    return (
      <FirebaseContext.Consumer>
        {firebase => (
          <div>
            {console.log("firebase,", firebase)}
            <div className="App">
              <Header currentPage={"My portfolio"} />
              <Link to="/stockDetails/testID">
                <Button color="primary" className="">
                  Details about testStock
                </Button>
              </Link>
              <PortfolioWrapper>
                <StocksWrapper>
                  {this.state.user.portfolio &&
                    Object.keys(this.state.user.portfolio).map(stockKey => (
                      <StockCard
                        stock={this.state.user.portfolio[stockKey]}
                        key={stockKey}
                      />
                    ))}
                </StocksWrapper>
                <GraphAndTextWrapper>
                  <GraphAndTextTitle>GRAPH 1</GraphAndTextTitle>
                  <div>
                    Ut aliqua officia duis voluptate adipisicing cillum ut minim
                    minim tempor velit sunt esse.
                  </div>
                </GraphAndTextWrapper>
                <GraphAndTextWrapper>
                  <GraphAndTextTitle>GRAPH 2</GraphAndTextTitle>
                  <div>
                    Ut aliqua officia duis voluptate adipisicing cillum ut minim
                    minim tempor velit sunt esse.
                  </div>
                </GraphAndTextWrapper>
                <GraphAndTextWrapper>
                  <GraphAndTextTitle>Portfolio Performance</GraphAndTextTitle>
                  <div>
                    <XYPlot height={300} width={300}>
                      <LineSeries data={data} />
                    </XYPlot>
                  </div>
                </GraphAndTextWrapper>
              </PortfolioWrapper>
            </div>
          </div>
        )}
      </FirebaseContext.Consumer>
    );
  }
}
export default withRouter(Home);
