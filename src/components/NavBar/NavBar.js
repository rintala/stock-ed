import React, { Component } from "react";
import "./../../App.css";
import { withRouter, Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";

const Button = styled.div`
  background-color: var(--highlight);
  text-align: center;
  cursor: pointer;
  margin: 3px;
  padding: 5px
  text-align: center;
  width: 20vw;
  
  &:hover {
    /* background-color: var(--on-hover); */
    color: white;
    box-shadow: 0px 1px 1px #888888;
  }
  transition: all 0.6s ease;
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
        <Link to="/about">
          <Button>ABOUT</Button>
        </Link>
      </NavBarWrapper>
    );
  }
}
export default NavBar;
