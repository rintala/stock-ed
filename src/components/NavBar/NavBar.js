import React, { Component } from "react";
import "./../../App.css";
import { withRouter, Link } from "react-router-dom";
import styled from "styled-components";

const Button = styled.div`
  background-color: var(--highlight);
  cursor: pointer;
  margin: 3px;
  padding: 5px
  width: 30vw;
  &:hover {
    background-color: var(--on-hover);
    color: white;
  }
`;

const NavBarWrapper = styled.div`
  display: flex;
  justify-content: center;
`;
class NavBar extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    return (
      <NavBarWrapper>
        <Link to="/home">
          <Button>MY PORTFOLIO</Button>
        </Link>
        <Link to="/search">
          <Button>SEARCH</Button>
        </Link>
        <Link to="/my-profile">
          <Button>MY PROFILE</Button>
        </Link>
      </NavBarWrapper>
    );
  }
}
export default NavBar;
