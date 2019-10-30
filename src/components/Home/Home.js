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
  font-size: 2em;
  padding: 30px;
  font-weight: bold;
  display: flex;
  width: 100%;
  justify-content: center;
`;

const HeaderTitleLink = styled.a`
  text-decoration: none;
  color: var(--global-link-color);
`;

const HeaderSubTitle = styled.div`
  font-size: 20px;
  padding: 10px;
  display: flex;
  width: 100%;
  justify-content: center;
`;

const StocksWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: center;
`;

const PortfolioWrapper = styled.div`
  justify-content: center;
  padding: 30px;
`;

const GraphAndTextWrapper = styled.div`
  width: 50%;
  padding: 30px;
`;
class Home extends Component {
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
              <HeaderContainer>
                <HeaderTitle>
                  <Link to="/home">
                    <HeaderTitleLink>stock-ed</HeaderTitleLink>
                  </Link>
                </HeaderTitle>
                <NavBar />
                <HeaderSubTitle>My Portfolio</HeaderSubTitle>
              </HeaderContainer>

              <PortfolioWrapper>
                <StocksWrapper>
                  {this.state.stocks.map(stock => (
                    <StockCard stock={stock} />
                  ))}
                </StocksWrapper>
                <GraphAndTextWrapper>
                  <div>GRAPH 1</div>
                  <div>
                    Ut aliqua officia duis voluptate adipisicing cillum ut minim
                    minim tempor velit sunt esse.
                  </div>
                </GraphAndTextWrapper>
                <GraphAndTextWrapper>
                  <div>GRAPH 1</div>
                  <div>
                    Ut aliqua officia duis voluptate adipisicing cillum ut minim
                    minim tempor velit sunt esse.
                  </div>
                </GraphAndTextWrapper>
                <GraphAndTextWrapper>
                  <div>GRAPH 1</div>
                  <div>
                    Ut aliqua officia duis voluptate adipisicing cillum ut minim
                    minim tempor velit sunt esse.
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
