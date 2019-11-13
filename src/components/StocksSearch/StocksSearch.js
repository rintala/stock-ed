import React, { Component, createElement } from "react";
import "./../../App.css";
import { withRouter, Link } from "react-router-dom";
import { FirebaseContext } from "../Firebase";
import NavBar from "./../NavBar/NavBar";
import Header from "./../Header/Header";
import styled from "styled-components";
import { TextField } from '@material-ui/core';
import { Paper } from '@material-ui/core';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { alphaVantageApiCall } from '../../api/api'


class StocksSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      pass1: "",
      pass2: "",
      showMenu: false,
      searchQuery: 'Search query',
      searchDone: false,
      searchResults: {
        "bestMatches": [
          {
            "1. symbol": "BA",
            "2. name": "The Boeing Company",
            "3. type": "Equity",
            "4. region": "United States",
            "5. marketOpen": "09:30",
            "6. marketClose": "16:00",
            "7. timezone": "UTC-05",
            "8. currency": "USD",
            "9. matchScore": "1.0000"
          },
          {
            "1. symbol": "BABA",
            "2. name": "Alibaba Group Holding Limited",
            "3. type": "Equity",
            "4. region": "United States",
            "5. marketOpen": "09:30",
            "6. marketClose": "16:00",
            "7. timezone": "UTC-05",
            "8. currency": "USD",
            "9. matchScore": "0.8000"
          },
          {
            "1. symbol": "BSVN",
            "2. name": "Bank7 Corp.",
            "3. type": "Equity",
            "4. region": "United States",
            "5. marketOpen": "09:30",
            "6. marketClose": "16:00",
            "7. timezone": "UTC-05",
            "8. currency": "USD",
            "9. matchScore": "0.8000"
          },
          {
            "1. symbol": "BHC",
            "2. name": "Bausch Health Companies Inc.",
            "3. type": "Equity",
            "4. region": "United States",
            "5. marketOpen": "09:30",
            "6. marketClose": "16:00",
            "7. timezone": "UTC-05",
            "8. currency": "USD",
            "9. matchScore": "0.6667"
          },
          {
            "1. symbol": "BAC",
            "2. name": "Bank of America Corporation",
            "3. type": "Equity",
            "4. region": "United States",
            "5. marketOpen": "09:30",
            "6. marketClose": "16:00",
            "7. timezone": "UTC-05",
            "8. currency": "USD",
            "9. matchScore": "0.4000"
          },
          {
            "1. symbol": "BIDU",
            "2. name": "Baidu Inc.",
            "3. type": "Equity",
            "4. region": "United States",
            "5. marketOpen": "09:30",
            "6. marketClose": "16:00",
            "7. timezone": "UTC-05",
            "8. currency": "USD",
            "9. matchScore": "0.3333"
          },
          {
            "1. symbol": "BAX",
            "2. name": "Baxter International Inc.",
            "3. type": "Equity",
            "4. region": "United States",
            "5. marketOpen": "09:30",
            "6. marketClose": "16:00",
            "7. timezone": "UTC-05",
            "8. currency": "USD",
            "9. matchScore": "0.3333"
          },
          {
            "1. symbol": "GOLD",
            "2. name": "Barrick Gold Corporation",
            "3. type": "Equity",
            "4. region": "United States",
            "5. marketOpen": "09:30",
            "6. marketClose": "16:00",
            "7. timezone": "UTC-05",
            "8. currency": "USD",
            "9. matchScore": "0.3333"
          },
          {
            "1. symbol": "BLDP",
            "2. name": "Ballard Power Systems Inc.",
            "3. type": "Equity",
            "4. region": "United States",
            "5. marketOpen": "09:30",
            "6. marketClose": "16:00",
            "7. timezone": "UTC-05",
            "8. currency": "USD",
            "9. matchScore": "0.1538"
          }
        ]
      }
    };

    this.debounceCounter = 0;

    //Need to bind "this" due to the delayed call. 
    this.apiCall = this.apiCall.bind(this);
  }

  // onChange = event => {
  //   this.setState({ [event.target.name]: event.target.value });
  // };

  // componentDidMount() {
  //   this.props.firebase.auth().onAuthStateChanged(user => {
  //     if (user) {
  //       console.log("user logged");
  //     }
  //   });
  // }

  menu() {
    console.log('Menu moved to separate function.')

  }

  searchOnChangeEvent(event) {
    const target = event.target
    this.setState({ searchQuery: target.value })
    if (target.value.length > 0) {
      this.setState({ showMenu: true, searchDone: false })
    } else {
      this.setState({ showMenu: false })
    }
    this.debounce(this.apiCall, 500)
  }

  debounce(event, wait) {
    this.debounceCounter++;
    console.log('Waiting: ', this.debounceCounter)
    setTimeout(() => {
      this.debounceCounter--;
      console.log('Checking: ', this.debounceCounter)
      if (this.debounceCounter <= 0) {
        console.log('fireing request')
        event()
      }

    }, wait)
  };

  apiCall() {
    console.log('this is an api call', this.state.searchQuery)
    // TODO: On callback from api disable search header
    this.setState({ searchDone: true })
    alphaVantageApiCall.stockSearch('BA').then((response) => {
      console.log(response.json())
    })
  }

  render() {
    return (
      <FirebaseContext.Consumer>
        {firebase => (
          <div>
            <div className="App">
              <Header currentPage={"Search view"} />
            </div>
            <div className="contentBody">
              <TextField onChange={(event) => this.searchOnChangeEvent(event)} fullWidth={true} placeholder="Search here" style={{ maring: 'auto' }}>TextField</TextField>
              <Paper style={{ display: this.state.showMenu ? 'block' : 'none', position: 'absolute' }}>
                <Table>
                  <TableHead style={{ display: this.state.searchDone ? 'none' : 'block' }}>Searching for:{this.state.searchQuery}...</TableHead>
                  <TableBody>
                    {this.state.searchResults["bestMatches"].map((searchResult) => {
                      return (
                        <TableRow key={searchResult["1. symbol"]}>
                          <TableCell>{searchResult["1. symbol"]}</TableCell>
                          <TableCell>{searchResult["2. name"]}</TableCell>
                        </TableRow>
                      )
                    }
                    )}
                  </TableBody>
                </Table>
              </Paper>

            </div>
          </div>
        )}
      </FirebaseContext.Consumer>
    );
  }
}
export default withRouter(StocksSearch);
