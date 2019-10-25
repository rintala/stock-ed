import React, { Component } from "react";
import "./../../App.css";
import { withRouter, Link } from "react-router-dom";
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import { green, red } from "@material-ui/core/colors";



class Error extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() { }




    render() {
        const errors = this.props.errors
        return (
            <Container maxWidth="sm">
                <List subheader="Enviroment variables is set for the following:">

                    {Object.keys(errors).map((key) => {
                        return (
                            <ListItem key={key}>
                                <ListItemText primary={key} />
                                <ListItemIcon >
                                    {errors[key] ? <CheckIcon color={red[400]} /> : <ClearIcon color="error" />}
                                </ListItemIcon>

                            </ListItem>

                        )
                    }
                    )}

                </List>
            </Container>
        )
    }
}
export default withRouter(Error);
