import React, { Component } from "react";
import "./../../App.css";
import { withRouter } from "react-router-dom";
import { FirebaseContext } from "../Firebase";
// import NavBar from "./../NavBar/NavBar";
import Header from "./../Header/Header";
// import styled from "styled-components";
import SearchIcon from "@material-ui/icons/Search";
import { TextField } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import { Paper } from "@material-ui/core";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";
import { alphaVantageApiCall } from "../../api/api";

class StocksSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      pass1: "",
      pass2: "",
      showMenu: false,
      searchQuery: "",
      searchDone: false,
      searchResults: []
    };
    this.debounceCounter = 0;

    //Need to bind "this" due to the delayed call.
    this.apiCall = this.apiCall.bind(this);
  }

  searchOnChangeEvent(event) {
    const target = event.target;
    this.setState({ searchQuery: target.value });
    if (target.value.length > 0) {
      this.setState({ showMenu: true, searchDone: false });
    } else {
      this.setState({ showMenu: false });
    }
    this.debounce(this.apiCall, 1500);
  }

  debounce(event, wait) {
    this.debounceCounter++;
    console.log("Waiting: ", this.debounceCounter);
    setTimeout(() => {
      this.debounceCounter--;
      console.log("Checking: ", this.debounceCounter);
      if (this.debounceCounter <= 0) {
        console.log("fireing request");
        event();
      }
    }, wait);
  }

  apiCall() {
    if (this.state.searchQuery.length !== 0) {
      alphaVantageApiCall.stockSearch(this.state.searchQuery).then(response => {
        response.json().then(data => {
          this.setState({
            searchResults: data["bestMatches"],
            searchDone: true
          });
        });
      });
    }
  }

  tableOnClick(event, symbol) {
    event.stopPropagation();
    // console.log(event)
    if (event.ctrlKey || event.metaKey) {
      console.log("cmd click, opening in tab");
      window.open("/stockDetails/" + symbol);
    } else {
      this.props.history.push("/stockDetails/" + symbol);
    }
  }
  getSearchResults() {
    // console.log('getting search results', this.state.searchDone, this.state.searchQuery.length)
    if (this.state.searchResults.length > 0 && this.state.searchQuery.length > 0 && this.state.searchDone) {
      return this.state.searchResults.map(searchResult => {
        return (
          <TableRow
            className="tableRow"
            onClick={event => {
              this.tableOnClick(event, searchResult["1. symbol"]);
            }}
            key={searchResult["1. symbol"]}
          >
            <TableCell>{searchResult["1. symbol"]}</TableCell>
            <TableCell align="left">
              {searchResult["2. name"]}
            </TableCell>
            <TableCell align="left">
              {searchResult["4. region"]}
            </TableCell>
          </TableRow>
        );
      })
    } else {
      if (this.state.searchQuery.length > 0 && !this.state.searchDone) {
        // console.log('searching')
        return (
          <TableRow>
            <TableCell>Searching..</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        )
      } else if (this.state.searchDone && this.state.searchQuery.length > 0) {
        // console.log('no mathce')
        return (
          <TableRow>
            <TableCell>No matches</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        )
      }
    }
  }

  render() {
    return (
      <FirebaseContext.Consumer>
        {firebase => (
          <div>
            <div className="contentBody">
              <Paper
                style={{
                  width: "80%",
                  padding: "0.5rem 1rem 1rem",
                  margin: "auto",
                  marginBottom: "1rem",
                  background: "rgba(255, 255, 255, 0.7)"
                }}
              >
                <Grid container spacing={1}>
                  <Grid
                    item
                    xs={1}
                    style={{ alignItems: "center", textAlign: "center" }}
                  >
                    <SearchIcon
                      style={{ marginTop: "1.2rem" }}
                      color="primary"
                    />
                  </Grid>
                  <Grid item xs={11}>
                    <TextField
                      fullWidth={true}
                      onChange={event => this.searchOnChangeEvent(event)}
                      label="Search"
                      margin="none"
                      style={{ marginRight: "1rem" }}
                    />
                  </Grid>
                </Grid>
              </Paper>
              <Table style={{ width: "80%", margin: "auto" }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Symbol</TableCell>
                    <TableCell align="left">Name</TableCell>
                    <TableCell align="left">Region</TableCell>
                  </TableRow>
                </TableHead>
                {/* style={{ display: this.state.showMenu ? 'block' : 'none' }} */}
                <TableBody>
                  {this.getSearchResults()}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </FirebaseContext.Consumer>
    );
  }
}
export default withRouter(StocksSearch);
