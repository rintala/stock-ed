import React, { Component } from "react";
import "./../../App.css";
import { withRouter, Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { sizes } from "./../../constants/sizes";

const Button = styled.div`  
  background-color: ${props =>
    props.isSelected ? "var(--highlight-red)" : "var(--highlight)"};
  text-align: center;
  cursor: pointer;
  margin: 3px;
  padding: 5px
  text-align: center;
  width: 20vw;
  color: var(--global-text-color);
  font-size:20px;
  font-weight: 700;
  
  &:hover {
    /* background-color: var(--on-hover); */
    color: white;
    box-shadow: 0px 1px 1px #888888;
  }

  @media (max-width: ${sizes.mobileDevice}) {
    width: auto;
  }
  
  transition: all 0.6s ease;
`;

const NavBarWrapper = styled.div`
  display: flex;
  justify-content: center;
  @media (max-width: ${sizes.mobileDevice}) {
    flex-wrap: wrap;
    flex-direction: row;
  }
`;

class NavBar extends Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    this.props.isHomeSelected && this.props.setIsCurrentlySelected("home");
  }

  render() {
    return (
      <NavBarWrapper>
        <Link
          to="/home"
          onClick={() => this.props.setIsCurrentlySelected("home")}
        >
          <Button isSelected={this.props.isCurrentlySelected === "home"}>
            MY PORTFOLIO
          </Button>
        </Link>

        <Link
          to="/search"
          onClick={() => this.props.setIsCurrentlySelected("search")}
        >
          <Button isSelected={this.props.isCurrentlySelected === "search"}>
            SEARCH
          </Button>
        </Link>

        <Link
          to="/my-profile"
          onClick={() => this.props.setIsCurrentlySelected("my-profile")}
        >
          <Button isSelected={this.props.isCurrentlySelected === "my-profile"}>
            MY PROFILE
          </Button>
        </Link>
        <Link
          to="/about"
          onClick={() => this.props.setIsCurrentlySelected("about")}
        >
          <Button isSelected={this.props.isCurrentlySelected === "about"}>
            ABOUT
          </Button>
        </Link>
      </NavBarWrapper>
    );
  }
}
export default NavBar;
