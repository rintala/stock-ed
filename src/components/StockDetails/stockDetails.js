import React, { Component } from "react";
import "./../../App.css";
import { withRouter, Link } from "react-router-dom";
import { FirebaseContext } from "../Firebase";
import Header from "../Header/Header";
import { Paper, Grid } from '@material-ui/core';
import { Table, TableBody, TableCell, TableHead, TableRow, Button } from '@material-ui/core';
import { XYPlot, LineSeries } from "react-vis";
import { alphaVantageApiCall } from "../../api/api";






class StockDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            stockID: this.props.match.params.stockID,
            graphData: []

        };
        console.log('stock details constructor')
    }

    componentDidMount() {
        console.log('stockDetails mounted:')
        alphaVantageApiCall({ type: 'stockDetails', interval: '5', symbol: 'GOOG', outputsize: 'compact' })
            .then(response => {
                response.json().then(data => {
                    this.setState({ graphData: this.filterData(data) })
                    console.log(this.state)
                })
            })
    };

    filterData(data) {
        // const today = new Date();
        // const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        console.log(data['Time Series (5min)'])
        return Object.keys(data['Time Series (5min)']).map((timeStamp) => {
            return (
                { x: (timeStamp.replace(/[-:\s ]+/g, "").trim()), y: data['Time Series (5min)'][timeStamp]['1. open'] }
            )
        })
    }

    render() {
        return (
            <FirebaseContext.Consumer>
                {firebase => (
                    <div>
                        <Button className="">Button</Button>
                        <Grid container>
                            <Grid item xs={4}>

                                <Table style={{ width: "100%" }}>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Symbol</TableCell>
                                            <TableCell align="left">Name</TableCell>
                                            <TableCell align="left">Region</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Symbol</TableCell>
                                            <TableCell align="left">Name</TableCell>
                                            <TableCell align="left">Region</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Symbol</TableCell>
                                            <TableCell align="left">Name</TableCell>
                                            <TableCell align="left">Region</TableCell>
                                        </TableRow>

                                    </TableBody>
                                </Table>
                            </Grid>
                            <Grid item xs={8} >
                                <Paper >
                                    <XYPlot height={300} width={300}>
                                        <LineSeries data={this.state.graphData} />
                                    </XYPlot>

                                </Paper>
                            </Grid>
                        </Grid>
                    </div>
                )
                }
            </FirebaseContext.Consumer>
        );
    }
}
export default withRouter(StockDetails);
