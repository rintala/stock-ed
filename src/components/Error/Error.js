import React, { Component } from "react";
import "./../../App.css";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import { green, red } from "@material-ui/core/colors";
import styled from "styled-components";

const Header = styled.div`
  font-size: 24px;
  padding-top: 20px;
  padding-bottom: 20px;
  text-align: left;
`;

class Error extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    const errors = this.props.errors;
    return (
      <Container maxWidth="sm" style={{ color: "white" }}>
        <Header>We are missing the following environment vars:</Header>
        <List>
          {Object.keys(errors).map(key => {
            return (
              <ListItem key={key}>
                <ListItemText primary={key} />
                <ListItemIcon>
                  {errors[key] ? (
                    <CheckIcon htmlColor={green[400]} />
                  ) : (
                    <ClearIcon htmlColor={red[400]} />
                  )}
                </ListItemIcon>
              </ListItem>
            );
          })}
        </List>
      </Container>
    );
  }
}
export default Error;
