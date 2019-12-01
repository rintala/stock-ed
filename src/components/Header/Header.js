import React, { Component } from "react";
import "./../../App.css";
import { Link } from "react-router-dom";
import NavBar from "./../NavBar/NavBar";
import styled from "styled-components";
import moneyImg from "./../../img/money.png";

const HeaderContainer = styled.div`
  padding-top: 25px;
  padding-bottom: 25px;
`;

const HeaderTitle = styled.div`
  font-size: 70px;
  padding-top: 30px;
  padding-bottom: 30px;
  font-weight: bold;
  display: flex;
  width: 100%;
  justify-content: center;
`;

const HeaderTitleLink = styled(Link)`
  text-decoration: none;
  color: var(--global-link-color);
  &:hover {
    color: var(--on-hover);
  }
  transition: all 0.3s ease-in-out;
`;

const LogoutButton = styled.div`
  height: 30px;
  padding-right: 10px;
  padding-left: 5px;
  cursor: pointer;
  background-color: var(--highlight-red);
  font-size: 15px;
  font-weight: 600;
  display: flex;
  justify-content: center;
  flex-direction: column;

  color: var(--global-text-color);
  &:hover {
    color: var(--global-text-hover);
    box-shadow: 0px 1px 1px #888888;
  }

  transition: all 0.6s ease;
`;
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHomeSelected: false,
      isCurrentlySelected:
        localStorage.getItem("currentPage") != null
          ? localStorage.getItem("currentPage")
          : ""
    };
  }

  render() {
    return (
      <HeaderContainer>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <LogoutButton
            onClick={() => {
              this.props.firebase.doSignOut();
              localStorage.clear();
            }}
          >
            LOGOUT
          </LogoutButton>
        </div>
        <HeaderTitle>
          <HeaderTitleLink
            onClick={() => {
              localStorage.setItem("currentPage", "home");
              this.setState({ isCurrentlySelected: "home" });
            }}
            to="/home"
          >
            [stock-ed]
          </HeaderTitleLink>
        </HeaderTitle>
        <div
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <img
            alt="money-bag"
            src={moneyImg}
            style={{ width: "10vw", height: "10vw" }}
          />
        </div>
        <NavBar
          isCurrentlySelected={this.state.isCurrentlySelected}
          setIsCurrentlySelected={subPage => {
            localStorage.setItem("currentPage", subPage);
            this.setState({
              isCurrentlySelected: subPage
            });
          }}
        />
      </HeaderContainer>
    );
  }
}

export default Header;
