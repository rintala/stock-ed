import React, { Component } from "react";
import "./../../App.css";
import { withRouter, Link } from "react-router-dom";
import { FirebaseContext } from "../Firebase";
import Header from "../Header/Header";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Table, TableBody, TableCell, TableHead, TableRow, Button } from '@material-ui/core';
import { XYPlot, LineSeries } from "react-vis";

import red from '@material-ui/core/colors/red';





class StockDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            stockID: this.props.match.params.stockID
        };
        console.log('stock details constructor')
    }

    componentDidMount() {
        console.log('stockDetails:')
    };


    render() {


        return (
            <FirebaseContext.Consumer>
                {firebase => (
                    <div>
                        <Header currentPage="" />
                        <Button className="">Button</Button>
                        <Grid container>
                            <Grid item xs={4}>
                                <Paper>
                                    <Table >
                                        <TableHead>Table Head</TableHead>
                                        <TableBody>
                                            <TableRow >
                                                <TableCell>Buy</TableCell>
                                                <TableCell>10</TableCell>

                                                <TableCell>Sell</TableCell>
                                                <TableCell>15</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Cell 1</TableCell>
                                                <TableCell>Cell 2</TableCell>
                                                <TableCell>Cell 3</TableCell>
                                                <TableCell>Cell 4</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Cell 1</TableCell>
                                                <TableCell>Cell 2</TableCell>
                                                <TableCell>Cell 3</TableCell>
                                                <TableCell>Cell 4</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </Paper>
                            </Grid>
                            <Grid item xs={8} >
                                <Paper centered>
                                    {/* <XYPlot height={300} width={300}>
                                        <LineSeries data={stockMock[this.state.stockID].historyData} />
                                    </XYPlot> */}

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
