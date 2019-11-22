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

const HeaderSubTitle = styled.div`
  font-size: 20px;
  padding: 10px;
  display: flex;
  width: 100%;
  justify-content: center;
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
        <HeaderTitle>
          <HeaderTitleLink
            onClick={() => this.setState({ isHomeSelected: true })}
            to="/home"
          >
            [stock-ed]
          </HeaderTitleLink>
        </HeaderTitle>
        <div
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <img src={moneyImg} style={{ width: "10vw" }} />
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
