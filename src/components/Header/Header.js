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

const HeaderTitleLink = styled.a`
  text-decoration: none;
  color: var(--global-link-color);

  &:hover {
    color: var(--on-hover);
  }
  transition: all 0.3s ease-in-out;
`;

const HeaderSubTitle = styled.div`
  font-size: 20px;
  padding: 10px;
  display: flex;
  width: 100%;
  justify-content: center;
`;

class Header extends Component {
  render() {
    return (
      <HeaderContainer>
        <HeaderTitle>
          <HeaderTitleLink to="/home">[stock-ed]</HeaderTitleLink>
        </HeaderTitle>
        <div
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <img src={moneyImg} style={{ width: "10vw" }} />
        </div>
        <NavBar />
      </HeaderContainer>
    );
  }
}

export default Header;
