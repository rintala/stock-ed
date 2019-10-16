import React, { Component } from "react";
import "./../../App.css";
import { withRouter, Link } from "react-router-dom";
import { FirebaseContext } from "../Firebase";
import NavBar from "./../NavBar/NavBar";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      pass1: "",
      pass2: ""
    };
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  componentDidMount() {
    this.props.firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log("user logged");
      }
    });
  }

  componentDidMount() {}

  onSubmit = event => {
    const { username, email, passwordOne } = this.state;
    this.props.firebase
      .doSignInWithEmailAndPassword(email, passwordOne)
      .then(() => {
        console.log("successful login");
        this.setState({ username: "", email: "", pass1: "", pass2: "" });
      })
      .catch(error => {
        this.setState({ error });
      });
    event.preventDefault();
  };

  render() {
    return (
      <FirebaseContext.Consumer>
        {firebase => (
          <div>
            <div className="App">
              <header className="App-header">
                <Link to="/home">
                  <h1>stock-ed</h1>
                </Link>
                <h2>HOME - My Portfolio</h2>
                <NavBar />
              </header>
            </div>{" "}
            <div className="contentBody" style={{ display: "flex" }}>
              <div id="graphAndTextWrapper" style={{ width: "50%" }}>
                <div>GRAPH 1</div>
                <div>
                  Ut aliqua officia duis voluptate adipisicing cillum ut minim
                  minim tempor velit sunt esse.
                </div>
              </div>
              <div id="graphWrapper" style={{ width: "50%" }}>
                <div>GRAPH 2</div>
                <div>GRAPH 3</div>
              </div>
            </div>
          </div>
        )}
      </FirebaseContext.Consumer>
    );
  }
}
export default withRouter(Home);
