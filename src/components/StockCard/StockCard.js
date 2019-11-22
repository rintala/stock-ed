import React, { Component } from "react";
import "./../../App.css";
import { withRouter, Link } from "react-router-dom";
import { FirebaseContext } from "../Firebase";

import CheckIcon from "@material-ui/icons/Check";
import NavBar from "./../NavBar/NavBar";
import styled from "styled-components";

import {
  Card,
  Typography,
  CardContent,
  Button,
  CardActions
} from "@material-ui/core";

const StockHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;
const TypographyWrapper = styled.div`
  font-size: 14;
`;
const TypographyWrapperTitle = styled.div`
  font-size: 24;
`;
const CardWrapper = styled.div`
  min-width: 275;
  margin: 10px;
`;

const LearnMoreContainer = styled.div`
  color: black;
  paddingtop: 10px;
  paddingbottom: 10px;
`;

const CardActionsInside = styled.div`
  height: ${props => !props.learnMore && "40px"};
`;

class StockCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      pass1: "",
      pass2: "",
      learnMore: false
    };
  }

  render() {
    console.log("stock card", this.props.stock);
    return (
      <CardWrapper>
        <Card style={{ backgroundColor: "var(--global-link-color)" }}>
          <CardContent>
            <TypographyWrapperTitle>
              <StockHeader>
                <Typography color="textSecondary" gutterBottom>
                  Last traded: {this.props.stock.currentData.lastTraded}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {/* SELL: {this.props.stock.sell} */}
                </Typography>
              </StockHeader>
            </TypographyWrapperTitle>
            <Typography variant="h5" component="h2">
              {this.props.stock.stockId}
            </Typography>
            <Typography variant="h7" component="h2">
              {this.props.stock.stockName}
            </Typography>
            <TypographyWrapper style={{ paddingTop: "10px" }}>
              <Typography color="textSecondary">
                NUMBER OF STOCKS: {this.props.stock.totNumberBought}
              </Typography>
            </TypographyWrapper>
            <TypographyWrapper style={{ paddingTop: "10px" }}>
              <Typography color="textSecondary">
                TOTAL VALUE: {this.props.stock.totAmountInvested}
              </Typography>
            </TypographyWrapper>
            <TypographyWrapper style={{ paddingTop: "10px" }}>
              <Typography color="textSecondary">
                AVG PRICE:{" "}
                {parseInt(this.props.stock.totAmountInvested) /
                  parseInt(this.props.stock.totNumberBought)}
              </Typography>
            </TypographyWrapper>
          </CardContent>

          <CardActions>
            <CardActionsInside learnMore={this.state.learnMore}>
              {this.props.stock.about && (
                <div>
                  <Button
                    size="small"
                    onClick={() =>
                      this.setState(prevState => ({
                        learnMore: !prevState.learnMore
                      }))
                    }
                  >
                    {this.state.learnMore ? "Show less" : "Learn More"}
                  </Button>
                  {this.state.learnMore && (
                    <LearnMoreContainer>
                      {this.props.stock.about}
                    </LearnMoreContainer>
                  )}
                </div>
              )}
            </CardActionsInside>
          </CardActions>
        </Card>
      </CardWrapper>
    );
  }
}
export default StockCard;
