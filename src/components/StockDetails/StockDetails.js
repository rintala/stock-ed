import React, { Component } from "react";
import "./../../App.css";
import { withRouter, Link } from "react-router-dom";
import { FirebaseContext } from "../Firebase";
import { Paper, Grid } from "@material-ui/core";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  TextField
} from "@material-ui/core";
import {
  FlexibleXYPlot,
  LineSeries,
  VerticalGridLines,
  HorizontalGridLines,
  XAxis,
  YAxis
} from "react-vis";
import { alphaVantageApiCall } from "../../api/api";

class StockDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      stockID: this.props.match.params.stockID,
      stockName: this.props.match.params.stockName,
      graphData: [],
      currentData: {
        open: 0,
        high: null,
        low: null,
        price: null,
        volume: null,
        lastTraded: null,
        previousClose: null,
        change: null,
        changePercent: null
      },
      amountToBuy: null,
      priceToBuyAt: null,
      totPurchaseAmount: 0,
      currentUser: null,
      currentUserId: null,
      graphPeriod: "last year",
      errorMsg: false
    };
    this.courtage = 0.15; //in percent
  }

  componentDidMount() {
    this.updateStockData()
      .then(() => {
        this.getChartData();
      })
      .catch(error => {
        // console.log('NoPE this is triggered')
        console.error(error);
        this.noValidData();
      });

    this.props.firebase.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        authUser
          ? localStorage.setItem("authUser", JSON.stringify(authUser))
          : localStorage.removeItem("authUser");

        this.setState({ currentUserId: authUser.uid });
        this.props.firebase.getUserData(authUser).then(userData => {
          this.setState({ currentUser: userData });
        });
      } else {
        console.log("user not logged in");
      }
    });
  }

  responseChecker(payload) {
    // The free version of the API allows for 5 request / min or 500 a day
    // The API returns a 200 response even when the API limit has been reached.
    // This is just a validation check if the returned payload containes the data we wanted.
    if (payload["Note"]) {
      return false;
    }
    return true;
  }

  getChartData() {
    const dataChart = {
      "last day": {
        type: "stockDetailsToday",
        interval: 5,
        symbol: this.state.stockID,
        outputsize: "compact"
      },
      "last month": {
        type: "stockDetailsLastYear",
        symbol: this.state.stockID,
        outputsize: "compact"
      },
      "last year": {
        type: "stockDetailsLastYear",
        symbol: this.state.stockID,
        outputsize: "full"
      }
    };
    console.log("Sending ", dataChart[this.state.graphPeriod]);
    alphaVantageApiCall(dataChart[this.state.graphPeriod]).then(response => {
      response.json().then(data => {
        if (this.responseChecker(data)) {
          this.setState({
            graphData: this.filterData(data),
            errorMsg: false
          });
        } else {
          // console.log('this is triggered')
          this.noValidData();
        }
      });
    });
  }

  buyStock = () => {
    // console.log("writing new stock to user:", this.state.currentUserId);
    // console.log("user data:", this.state.currentData, this.props.firebase);

    this.props.firebase.writeNewStock(
      this.state.currentUserId,
      this.state.currentUser,
      {
        stockId: this.state.stockID,
        stockName: this.state.stockName,
        currentData: this.state.currentData,
        totNumberBought: this.state.amountToBuy,
        totAmountInvested:
          parseInt(this.state.amountToBuy) *
          parseInt(this.state.currentData.open)
      }
    );
  };

  sellExistingStock = () => {
    console.log("this state", this.state.amountToBuy, this.state.priceToBuyAt);
    this.props.firebase.sellExistingStock(
      this.state.currentUserId,
      this.state.stockID,
      this.state.amountToBuy,
      this.state.priceToBuyAt
    );
  };

  updateStockData() {
    // console.log("chartData");
    return new Promise((resolve, reject) => {
      alphaVantageApiCall({
        type: "stockQuote",
        symbol: this.state.stockID
      }).then(response => {
        // console.log('update stock response: ', response.status)
        response.json().then(data => {
          if (this.responseChecker(data)) {
            const gQ = data["Global Quote"];
            this.setState({
              currentData: {
                open: gQ["02. open"],
                high: gQ["03. high"],
                low: gQ["04. low"],
                price: gQ["05. price"],
                volume: gQ["06. volume"],
                lastTraded: gQ["07. latest trading day"],
                previousClose: gQ["08. previous close"],
                change: gQ["09. change"],
                changePercent: gQ["10. change percent"]
              },
              priceToBuyAt: gQ["05. price"]
            });
            resolve();
          } else {
            reject();
          }
        });
      });
    });
  }

  filterData(data) {
    const timeSeries = {
      "last day": "Time Series (5min)",
      "last month": "Time Series (Daily)",
      "last year": "Time Series (Daily)"
    };
    const dataKey = timeSeries[this.state.graphPeriod];
    const lastTraded = this.state.currentData.lastTraded;

    const filteredTimeStamps = Object.keys(data[dataKey]).filter(timeStamp => {
      if (this.state.graphPeriod === "last day") {
        if (timeStamp.indexOf(lastTraded) > -1) {
          return timeStamp;
        } else {
          return null;
        }
      } else {
        let [year, month, day] = lastTraded.split("-");
        if (this.state.graphPeriod === "last year") {
          year -= 1;
        } else if (this.state.graphPeriod === "last month") {
          month -= 1;
        }

        const fromDate = parseInt([year, month, day].join(""));
        const toDate = parseInt(timeStamp.replace(/-/g, ""));
        if (toDate >= fromDate) {
          return timeStamp;
        } else {
          return null;
        }
      }
    });

    return filteredTimeStamps.map(timeStamp => {
      // console.log('sending ' + timeStamp + ' to plot')
      return {
        x: new Date(timeStamp),
        y: data[dataKey][timeStamp]["1. open"]
      };
    });
  }

  labelFormatter(input) {
    // console.log(input)
    const date = new Date(input);
    const dateAsString = date.toISOString();
    // console.log(dateAsString)
    // 2019-11-27T14:13:20.000Z <-- This is the format of an ISO String
    if (this.state.graphPeriod === "last day") {
      // console.log(dateAsString.substring(11, 16))
      return dateAsString.substring(11, 16);
    } else {
      // console.log(dateAsString.substring(5, 10))
      return dateAsString.substring(5, 10);
    }
  }

  noValidData() {
    this.setState({ errorMsg: true });
  }

  async changeChartView(period) {
    await this.setState({ graphPeriod: period });
    console.log("period", this.state.graphPeriod);
    this.getChartData();
  }

  computeTotPurchaseAmount = (amountToBuy, priceToBuyAt) => {
    return amountToBuy * priceToBuyAt;
  };
  render() {
    return (
      <FirebaseContext.Consumer>
        {firebase => (
          <div className="contentBody">
            <h2>{this.state.stockName}</h2>

            {this.state.errorMsg && (
              <div
                style={{
                  backgroundColor: "var(--highlight-red)",
                  color: "var(--global-text-color)",
                  fontSize: "20px",
                  fontWeight: 400,
                  padding: "10px",
                  marginTop: 10,
                  marginBottom: 10
                }}
              >
                Due to limitation in the API we could not fetch the data, please
                wait a minute and then refresh.
              </div>
            )}
            <Grid container spacing={2}>
              <Grid item>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Open</TableCell>
                      <TableCell>{this.state.currentData.open}</TableCell>
                      <TableCell>Previous Close</TableCell>
                      <TableCell>
                        {this.state.currentData.previousClose}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>High</TableCell>
                      <TableCell>{this.state.currentData.high}</TableCell>
                      <TableCell>Low</TableCell>
                      <TableCell>{this.state.currentData.low}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Change</TableCell>
                      <TableCell>{this.state.currentData.change}</TableCell>
                      <TableCell>Change %</TableCell>
                      <TableCell>
                        {this.state.currentData.changePercent}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Volume</TableCell>
                      <TableCell>{this.state.currentData.volume}</TableCell>
                      <TableCell>Last Traded</TableCell>
                      <TableCell>{this.state.currentData.lastTraded}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <div
                  style={{
                    padding: "15px",
                    marginTop: "10px",
                    fontWeight: "italic"
                  }}
                >
                  Tip: Make sure you have available funds for the purchase to go
                  through!
                </div>
                <Paper style={{ marginTop: "1.2rem" }}>
                  <TextField
                    label="Computed total purchase amount"
                    style={{ width: "100%" }}
                    value={this.state.totPurchaseAmount}
                    disabled={true}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "1.5rem"
                    }}
                  >
                    <TextField
                      label="Amount"
                      style={{ width: "45%" }}
                      value={this.state.amountToBuy || ""}
                      onChange={e =>
                        this.setState({
                          amountToBuy: e.target.value,
                          totPurchaseAmount: this.computeTotPurchaseAmount(
                            e.target.value,
                            this.state.currentData.open
                          )
                        })
                      }
                    />
                    <TextField
                      label="Price"
                      value={this.state.currentData.open}
                      style={{ width: "45%" }}
                      disabled={true}
                      // onChange={e =>
                      //     this.setState({ priceToBuyAt: e.target.value })
                      // }
                    />
                  </div>

                  <Button
                    onClick={() => {
                      this.setState({ amountToBuy: 0, priceToBuyAt: 0 });
                      this.buyStock();
                    }}
                    style={{ width: "30%" }}
                  >
                    Buy
                  </Button>

                  <Button
                    onClick={() => {
                      this.sellExistingStock();
                      this.setState({ amountToBuy: 0, priceToBuyAt: 0 });
                    }}
                    style={{ width: "50%" }}
                  >
                    Sell
                  </Button>
                </Paper>
              </Grid>
              <Grid item>
                <Paper style={{ height: "20rem", position: "relative" }}>
                  {/* Change this so it represents choosen period */}
                  <div style={{ position: "absolute", top: "0" }}>
                    <p style={{ fontSize: "10px", margin: "0px" }}>
                      Last Traded
                    </p>
                    <p style={{ margin: "0px" }}>
                      {this.state.currentData.lastTraded}
                    </p>
                  </div>
                  <FlexibleXYPlot style={{ position: "relative" }}>
                    <VerticalGridLines />
                    <HorizontalGridLines />
                    <XAxis
                      tickLabelAngle={-90}
                      tickFormat={v => this.labelFormatter(v)}
                    />
                    <YAxis />
                    <LineSeries data={this.state.graphData} />
                  </FlexibleXYPlot>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "20px"
                    }}
                  >
                    <Button
                      style={{
                        width: "20%",
                        backgroundColor: "var(--highlight-red)"
                      }}
                      onClick={() => {
                        this.changeChartView("last day");
                      }}
                    >
                      Today
                    </Button>

                    <Button
                      style={{
                        width: "20%",
                        backgroundColor: "var(--highlight-red)"
                      }}
                      onClick={() => {
                        this.changeChartView("last month");
                      }}
                    >
                      Month
                    </Button>
                    <Button
                      style={{
                        width: "20%",
                        backgroundColor: "var(--highlight-red)"
                      }}
                      onClick={() => {
                        this.changeChartView("last year");
                      }}
                    >
                      Year
                    </Button>
                  </div>
                </Paper>
              </Grid>
            </Grid>
          </div>
        )}
      </FirebaseContext.Consumer>
    );
  }
}
export default withRouter(StockDetails);