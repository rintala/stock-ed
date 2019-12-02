import React, { Component } from "react";
import "./../../App.css";
import { withRouter } from "react-router-dom";

import "../../../node_modules/react-vis/dist/style.css";
import {
  RadialChart,
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  VerticalBarSeries,
  HorizontalBarSeries,
  HorizontalBarSeriesCanvas,
  BarSeries,
  DiscreteColorLegend
} from "react-vis";
import StockCard from "./../StockCard/StockCard";
import styled from "styled-components";

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
  padding: 10px;
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
      barChartData: [],
      investedVsCashChartData: [],
      isFlushed: false
    };
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  componentDidMount = () => {
    this.props.firebase.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        authUser
          ? localStorage.setItem("authUser", JSON.stringify(authUser))
          : localStorage.removeItem("authUser");

        this.props.firebase.getUserData(authUser).then(userData => {
          this.setState(
            {
              user: {
                ...userData,
                email: authUser.email
              }
            },
            () => this.state.user.portfolio && this.generateChartData()
          );
        });
      }
    });

    if (this.props.firebase.auth.currentUser) {
      this.props.firebase.getUserData(this.props.firebase.auth.currentUser);
    }
  };

  onSubmit = event => {
    const { email, passwordOne } = this.state;
    let error = this.props.firebase
      .doSignInWithEmailAndPassword(email, passwordOne)
      .then(() => {
        this.setState({ username: "", email: "", pass1: "", pass2: "" });
      });

    event.preventDefault();
  };

  generateChartData = () => {
    this.generatePieChartData();
    this.generateBarChartData();
    this.generateInvestedVsCashChartData();
  };

  generatePieChartData = () => {
    let pieChartData = [];
    Object.keys(this.state.user.portfolio).map(stockKey => {
      pieChartData.push({
        angle:
          parseInt(this.state.user.portfolio[stockKey].totAmountInvested) *
          parseInt(this.state.user.portfolio[stockKey].totNumberBought),
        label: this.state.user.portfolio[stockKey].stockId
      });
    });
    this.setState({ pieChartData: pieChartData });
  };

  generateBarChartData = () => {
    let barChartData = [];
    Object.keys(this.state.user.portfolio).map(stockKey => {
      barChartData.push({
        x: this.state.user.portfolio[stockKey].stockId,
        y: parseInt(this.state.user.portfolio[stockKey].totNumberBought)
      });
    });
    this.setState({ barChartData: barChartData });
  };

  generateInvestedVsCashChartData = () => {
    let fundsAvailable = this.state.user.fundsAvailable;
    let investedFunds = 0;
    Object.keys(this.state.user.portfolio).map(stockKey => {
      investedFunds += parseInt(
        this.state.user.portfolio[stockKey].totAmountInvested
      );
    });
    let newInvestedVsCashChartData = [];
    newInvestedVsCashChartData.push({
      y: 1,
      x: investedFunds,
      label: "funds-invested",
      title: "Funds Invested",
      color: "var(--highlight-red)"
    });
    newInvestedVsCashChartData.push({
      y: 2,
      x: fundsAvailable,
      label: "cash-invested",
      title: "Cash Available",
      color: "#12939A"
    });

    this.setState({ investedVsCashChartData: newInvestedVsCashChartData });
  };

  render() {
    return (
      <div>
        {console.log("firebase,", this.props.firebase)}
        <div className="App">
          <PortfolioWrapper>
            <GraphAndTextWrapper>
              <GraphAndTextTitleCard>
                Funds available: $ {this.state.user.fundsAvailable}
              </GraphAndTextTitleCard>

              {this.state.user.portfolio && (
                <div>
                  <GraphAndTextTitle>Stocks</GraphAndTextTitle>
                  <StocksWrapper>
                    {Object.keys(this.state.user.portfolio).map(stockKey => (
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
                  </StocksWrapper>
                </div>
              )}
            </GraphAndTextWrapper>
            {this.state.user.portfolio && (
              <GraphAndTextWrapper>
                <GraphAndTextTitle>Invested capital vs. cash</GraphAndTextTitle>

                <XYPlot
                  width={300}
                  height={300}
                  stackBy="x"
                  showLabels
                  style={{
                    text: { stroke: "var(--global-link-color)" }
                  }}
                >
                  <DiscreteColorLegend
                    style={{
                      position: "absolute",
                      left: "50px",
                      top: "0px"
                    }}
                    orientation="horizontal"
                    items={[
                      {
                        title: "Cash",
                        color: "#12939A"
                      },
                      {
                        title: "Invested",
                        color: "var(--highlight-red)"
                      }
                    ]}
                  />

                  <VerticalGridLines />
                  <XAxis />

                  <HorizontalBarSeries
                    barWidth={0.5}
                    showLabels
                    colorType="literal"
                    data={this.state.investedVsCashChartData}
                  />
                </XYPlot>
              </GraphAndTextWrapper>
            )}
            {this.state.user.portfolio && (
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
            )}

            {this.state.user.portfolio && (
              <GraphAndTextWrapper>
                <GraphAndTextTitle>Number stocks split</GraphAndTextTitle>

                <XYPlot
                  margin={{ bottom: 70 }}
                  xType="ordinal"
                  width={300}
                  height={300}
                  animation
                  style={{
                    text: { stroke: "var(--global-link-color)" }
                  }}
                >
                  <HorizontalGridLines />
                  <XAxis
                    tickLabelAngle={-45}
                    style={{
                      text: { stroke: "var(--global-link-color)" }
                    }}
                  />
                  <YAxis />
                  <VerticalBarSeries data={this.state.barChartData} />
                </XYPlot>
              </GraphAndTextWrapper>
            )}
          </PortfolioWrapper>
        </div>
      </div>
    );
  }
}
export default withRouter(Home);
