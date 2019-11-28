import React, { Component } from "react";
import "./../../App.css";
import { withRouter, Link } from "react-router-dom";
import { FirebaseContext } from "../Firebase";
import Header from "../Header/Header";
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
      amountToBuy: 0,
      priceToBuyAt: 0,
      currentUser: null,
      currentUserId: null,
      interval: "5",
      outputsize: "compact",
      graphPeriod: "today",
      errorMsg: false
    };
    this.courtage = 0.15; //in percent
  }

  componentDidMount() {
    this.updateStockData()
      .then(() => {
        this.getChartData().then(response => {
          response.json().then(data => {
            if (this.responseChecker(data)) {
              this.setState({ graphData: this.filterData(data) });
            } else {
              this.noValidData();
            }
          });
        });
      })
      .catch(error => {
        console.log(error);
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

  noValidData() {
    this.setState({ errorMsg: true });
  }

  getChartData() {
    const dataChart = {
      today: {
        type: "stockDetailsToday",
        interval: 5,
        symbol: this.state.stockID,
        outputsize: this.state.outputsize
      }
    };

    return alphaVantageApiCall({
      type: "stockDetailsToday",
      interval: 5,
      symbol: this.state.stockID,
      outputsize: this.state.outputsize
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
            // console.log(data); //change here
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

  filterData(data, interval) {
    //TODO add functionality to change data between Today, Last Week, Last Month and Last Year
    const today = this.state.currentData.lastTraded;
    const filteredTimeStamps = Object.keys(data["Time Series (5min)"]).filter(
      timeStamp => {
        if (timeStamp.indexOf(today) > -1) {
          return timeStamp;
        } else {
          return null;
        }
      }
    );
    return filteredTimeStamps.map(timeStamp => {
      console.log(timeStamp);
      const indexEndOfDate = timeStamp.indexOf(" ");
      const timeStampNoDate = timeStamp.substring(
        indexEndOfDate,
        timeStamp.length - 2
      ); //removes the two 0s at the end
      console.log(
        "Sendning timestamp:",
        timeStampNoDate.replace(/[: ]+/g, "").trim()
      );
      return {
        x: timeStampNoDate.replace(/[: ]+/g, "").trim(),
        y: data["Time Series (5min)"][timeStamp]["1. open"]
      };
    });
  }
  labelFormatter(input) {
    console.log(input);
    const inputString = input.toString();
    if (this.state.graphPeriod === "today") {
      if (inputString.length === 3) {
        return (
          "0" + inputString.substring(0, 1) + "." + inputString.substring(1, 3)
        );
      } else {
        return inputString.substring(0, 2) + "." + inputString.substring(2, 4);
      }
    }
    return input;
  }
  render() {
    return (
      <FirebaseContext.Consumer>
        {firebase => (
          <div className="contentBody">
            <h2>{this.state.stockName}</h2>
            <p
              style={{
                color: "red",
                display: this.state.errorMsg ? "block" : "none"
              }}
            >
              Due to limitation in the API we could not fetch the data, please
              wait a minute and then refresh
            </p>
            <Grid container spacing={2}>
              <Grid item xs={5}>
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
                <Paper style={{ marginTop: "1.2rem", padding: "0.5rem" }}>
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
                        this.setState({ amountToBuy: e.target.value })
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
                    style={{ width: "50%" }}
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
              <Grid item xs={7}>
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
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Button style={{ width: "20%", backgroundColor: "red" }}>
                      Today
                    </Button>
                    <Button style={{ width: "20%", backgroundColor: "red" }}>
                      Week
                    </Button>
                    <Button style={{ width: "20%", backgroundColor: "red" }}>
                      Month
                    </Button>
                    <Button style={{ width: "20%", backgroundColor: "red" }}>
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
