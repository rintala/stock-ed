import React, { Component } from "react";
import "./../../App.css";
import { withRouter } from "react-router-dom";

import "../../../node_modules/react-vis/dist/style.css";
import { RadialChart } from "react-vis";
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
            () => this.state.user.portfolio && this.generatePieChartData()
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
          </PortfolioWrapper>
        </div>
      </div>
    );
  }
}
export default withRouter(Home);
