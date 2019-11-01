import React, { Component } from "react";
import "./../../App.css";
import { withRouter, Link } from "react-router-dom";
import { FirebaseContext } from "../Firebase";
import Header from "../Header/Header";

class StockDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            email: "",
            pass1: "",
            pass2: ""
        };
        console.log('stock details constructor')
    }

    componentDidMount() {
        console.log('stockDetails:')
    }



    render() {
        return (
            <FirebaseContext.Consumer>
                {firebase => (
                    <div>Andreas</div>
                )}
            </FirebaseContext.Consumer>
        );
    }
}
export default withRouter(StockDetails);
