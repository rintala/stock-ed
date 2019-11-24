import React, { useState, useEffect } from "react";

export const withAuthProtection = redirectPath => WrappedComponent => {
  class WithAuthProtection extends React.Component {
    componentDidMount() {
      // use history from parent.
      console.log("mouted with auth protection", this.props);
      const { history } = this.props;
      if (!this.props.firebase.auth.currentUser) {
        // no auth at the beginning of the app, redirect them to login.
        return history.push(redirectPath);
      }
    }
    componentWillReceiveProps(nextProps) {
      console.log("this props", this.props);
      console.log("next props", nextProps);
      const { me, history } = this.props;
      const { me: nextMe } = nextProps;
      if (me && !nextMe) {
        // this case is a must,
        // if user stay at auth route while they signing out
        // we must take them to login again immediately.
        history.push(redirectPath);
      }
    }
    render() {
      const { me } = this.props;
      console.log("render wrapped component");
      if (!me) {
        // don't render anything if no auth
        return null;
      }
      return <WrappedComponent {...this.props} />;
    }
  }

  return WithAuthProtection;
};
