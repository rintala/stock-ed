import React, { useState, useEffect } from "react";
import { Route, Link, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      console.log("props inside privateroute", props, Component);
      return rest.authUser != null ? (
        <Component {...props} />
      ) : (
        <Redirect to="/signin" />
      );
    }}
  />
);

export default PrivateRoute;
