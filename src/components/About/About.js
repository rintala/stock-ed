import React, { Component } from "react";
import "./../../App.css";
import { withRouter, Link } from "react-router-dom";
import styled from "styled-components";

const PortfolioWrapper = styled.div`
  justify-content: center;
  padding: 30px;
  display: flex;
`;

const AboutBody = styled.div`
  width: 60vw;
  text-align: center;
  font-size: 24px;
`;

const ProfileImage = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 15px;
  border-style: solid;
  border-color: var(--global-link-color);
  margin: 20px;
  background-image: url(${props => props.imageUrl});
  background-size: contain;
`;

const ProfileImagesContainer = styled.div`
  justify-content: center;
  display: flex;
`;
const profileImages = [
  {
    github: "rintala",
    linkedin:
      "https://media.licdn.com/dms/image/C4E03AQHFg3NH9wK3tA/profile-displayphoto-shrink_200_200/0?e=1580342400&v=beta&t=1vtTgsWpi-QUBOqCDQESUf6TXaQmFAp-9OixUOUGNbo"
  },
  {
    github: "Cedervall",
    linkedin:
      "https://media.licdn.com/dms/image/C4E03AQHSBtXas4RPsg/profile-displayphoto-shrink_200_200/0?e=1580342400&v=beta&t=SIU-WYKD9ShMwjsuAzPFSOUbkVH0OXLCN48FTSFmInI"
  }
];
class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      pass1: "",
      pass2: "",
      stocks: []
    };
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  componentDidMount() {
    this.props.firebase.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        authUser
          ? localStorage.setItem("authUser", JSON.stringify(authUser))
          : localStorage.removeItem("authUser");
      }
    });
    console.log("mounted about", this.props);
  }

  render() {
    return (
      <div>
        <div className="App">
          <PortfolioWrapper>
            <AboutBody>
              Stock-ed is an educational stock application, displaying real data
              from the Alpha Vantage API. Part of course DH2642 at KTH.{" "}
              <a href="https://github.com/rintala/stock-ed">
                Check out the source code at github.
              </a>
              <ProfileImagesContainer>
                {profileImages.map((profileImage, idx) => (
                  <div key={idx}>
                    <ProfileImage imageUrl={profileImage.linkedin} />
                    <a href={"https://github.com/" + profileImage.github}>
                      @{profileImage.github}
                    </a>
                  </div>
                ))}
              </ProfileImagesContainer>
            </AboutBody>
          </PortfolioWrapper>
        </div>
      </div>
    );
  }
}
export default withRouter(About);
