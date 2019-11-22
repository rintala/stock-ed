import React, { Component } from "react";
import "./../../App.css";
import { withRouter, Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";

const Button = styled.div`  
  background-color: ${props =>
    props.isSelected ? "palevioletred" : "var(--highlight)"};
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
    this.state = {
      isSelected: "home"
    };
  }

  componentWillReceiveProps(nextProps) {
    this.props.isHomeSelected && this.props.setIsCurrentlySelected("home");
  }

  render() {
    return (
      <NavBarWrapper>
        <Link to="/home">
          <Button
            onClick={() => this.props.setIsCurrentlySelected("home")}
            isSelected={this.props.isCurrentlySelected === "home"}
          >
            MY PORTFOLIO
          </Button>
        </Link>
        <Link to="/search">
          <Button
            onClick={() => this.props.setIsCurrentlySelected("search")}
            isSelected={this.props.isCurrentlySelected === "search"}
          >
            SEARCH
          </Button>
        </Link>
        <Link to="/my-profile">
          <Button
            onClick={() => this.props.setIsCurrentlySelected("my-profile")}
            isSelected={this.props.isCurrentlySelected === "my-profile"}
          >
            MY PROFILE
          </Button>
        </Link>
        <Link to="/about">
          <Button
            onClick={() => this.props.setIsCurrentlySelected("about")}
            isSelected={this.props.isCurrentlySelected === "about"}
          >
            ABOUT
          </Button>
        </Link>
      </NavBarWrapper>
    );
  }
}
export default NavBar;
