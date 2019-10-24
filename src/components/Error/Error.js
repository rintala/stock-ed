import React, { Component } from "react";
import "./../../App.css";
import { withRouter, Link } from "react-router-dom";


class Error extends Component {
    constructor(props) {
        super(props);
        this.state = {};

    }

    componentDidMount() { }


    render() {
        const errors = this.props.errors
        return (
            <div>
                <p>Enviroment variables is set for the following:</p>
                <ul>
                    {Object.keys(errors).map((key) =>
                        <li key={key}>
                            <p>{key}</p>
                            <p>{String(errors[key])}</p>
                        </li>
                    )}
                </ul>
            </div>
        )
    }
}
export default withRouter(Error);
