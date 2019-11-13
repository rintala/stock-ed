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
      searchResults: []
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
    if (this.state.searchQuery.length !== 0) {
      alphaVantageApiCall.stockSearch(this.state.searchQuery).then((response) => {
        response.json().then((data) => {
          this.setState({ searchResults: data['bestMatches'], searchDone: true })
        })
      })
    }
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
                    {this.state.searchResults.map((searchResult) => {
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
