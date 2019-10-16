import React, { Component } from "react";
import "./../../App.css";
import { withRouter, Link } from "react-router-dom";

class NavBar extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    return (
      <div>
        <Link to="/home">
          <button>HOME</button>
        </Link>
        <Link to="/search">
          <button>SEARCH</button>
        </Link>
        <Link to="/my-profile">
          <button>MY PROFILE</button>
        </Link>
      </div>
    );
  }
}
export default NavBar;
