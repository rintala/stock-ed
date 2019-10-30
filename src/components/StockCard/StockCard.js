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
class StockCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      pass1: "",
      pass2: ""
    };
  }

  render() {
    return (
      <CardWrapper>
        <Card>
          <CardContent>
            <TypographyWrapperTitle>
              <StockHeader>
                <Typography color="textSecondary" gutterBottom>
                  BUY: {this.props.stock.buyPrice}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  SELL: {this.props.stock.sellPrice}
                </Typography>
              </StockHeader>
            </TypographyWrapperTitle>
            <Typography variant="h5" component="h2">
              {this.props.stock.marker}
            </Typography>
            <TypographyWrapper>
              <Typography color="textSecondary">
                NUMBER OF STOCKS: 30
              </Typography>
            </TypographyWrapper>
            <Typography variant="body2" component="p">
              Return: +20%
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Learn More</Button>
          </CardActions>
        </Card>
      </CardWrapper>
    );
  }
}
export default StockCard;
