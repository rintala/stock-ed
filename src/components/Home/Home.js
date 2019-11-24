import React, { Component } from "react";
import "./../../App.css";
import { withRouter, Link } from "react-router-dom";
import { FirebaseContext } from "../Firebase";

import "../../../node_modules/react-vis/dist/style.css";
import { XYPlot, LineSeries, RadialChart } from "react-vis";

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
  padding: 30px;
`;

const GraphAndText = styled.div`
  font-size: 30px;
  font-weight: 700;
  color: #2dffc6;
`;
const GraphAndTextTitle = styled.div`
  padding-top: 20px;
  padding-bottom: 20px;
  font-size: 30px;
  font-weight: 600;
  color: var(--global-link-color);
  text-align: center;
`;

const GraphAndTextTitleCard = styled.div`
  padding-top: 20px;
  padding-bottom: 20px;
  font-size: 30px;
  font-weight: 600;
  color: var(--global-link-color);
  background-color: var(--dark-bg);
  border-style: solid;
  border-color: var(--global-link-color);
  text-align: center;
`;

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      currentUser: {},
      username: "",
      email: "",
      pass1: "",
      pass2: "",
      stocks: [],
      pieChartData: [],
      isFlushed: false
    };
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  componentDidMount = () => {
    console.log("home mounted", this.props);

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
            () => this.state.user.portfolio && this.generatePieChartData()
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
  };

  /* componentDidUpdate(prevProps, prevState) {
    let user = this.props.firebase.auth.currentUser;
    console.log("User comp did update", user);
    let newUser = {
      user: {
        ...user,
        email: user.email
      }
    };
    console.log(
      "newUserr",
      this.props.location.state,
      prevProps.location.state
    );

    if (this.props.location.state !== prevProps.location.state) {
      this.setState({ locationState: this.props.location.state });
    }
    if (prevState.locationState !== this.state.locationState) {
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
          () => this.generatePieChartData()
        );
      });
    }
  } */

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

  generatePieChartData = () => {
    let pieChartData = [];
    Object.keys(this.state.user.portfolio).map(stockKey => {
      console.log("stock pie", this.state.user.portfolio[stockKey]);
      // todo: calc actual angle by summing up portfolio value and dividing on number stocks
      pieChartData.push({
        angle: 3,
        label: this.state.user.portfolio[stockKey].stockId
      });
    });
    this.setState({ pieChartData: pieChartData });
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
      <div>
        {console.log("firebase,", this.props.firebase)}
        <div className="App">
          <PortfolioWrapper>
            <GraphAndTextWrapper>
              <GraphAndTextTitleCard>
                Funds available: $ {this.state.user.fundsAvailable}
              </GraphAndTextTitleCard>
              <GraphAndTextTitle>Stocks</GraphAndTextTitle>
              <StocksWrapper>
                {this.state.user.portfolio &&
                  Object.keys(this.state.user.portfolio).map(stockKey => (
                    <StockCard
                      stock={this.state.user.portfolio[stockKey]}
                      key={stockKey}
                      onCardClick={() =>
                        this.props.history.push(
                          "/stockDetails/" +
                            this.state.user.portfolio[stockKey].stockName +
                            "/" +
                            this.state.user.portfolio[stockKey].stockId
                        )
                      }
                    />
                  ))}
              </StocksWrapper>{" "}
            </GraphAndTextWrapper>

            <GraphAndTextWrapper>
              <GraphAndTextTitle>Portfolio value split</GraphAndTextTitle>
              <div>
                <RadialChart
                  data={this.state.pieChartData}
                  width={300}
                  height={300}
                  showLabels
                  animation
                  labelsStyle={{
                    fontSize: "15px",
                    padding: "10px"
                  }}
                  labelsRadiusMultiplier={0.8}
                />
              </div>
            </GraphAndTextWrapper>
            {/* <GraphAndTextWrapper>
              <GraphAndTextTitle>GRAPH 2</GraphAndTextTitle>
              <div>
                Ut aliqua officia duis voluptate adipisicing cillum ut minim
                minim tempor velit sunt esse.
              </div>
            </GraphAndTextWrapper> */}
            {/*  <GraphAndTextWrapper>
              <GraphAndTextTitle>Portfolio Performance</GraphAndTextTitle>
              <div>
                <XYPlot height={300} width={300}>
                  <LineSeries data={data} />
                </XYPlot>
              </div>
            </GraphAndTextWrapper> */}
          </PortfolioWrapper>
        </div>
      </div>
    );
  }
}
export default withRouter(Home);
