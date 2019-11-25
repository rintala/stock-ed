# stock-ed

## Deployed app is live on

<a href="https://stock-ed.netlify.com/">https://stock-ed.netlify.com/</a>

Use the login username and password provided in the submission comment in Canvas or ask for them by sending a mail to jrintala@kth.se.

## Run and build project locally

### Firebase backend config

Set the following environment variables on your system, in order to succesfully connect to the Firebase backend. The config variables can be found in your Firebase dashboard under 'Project settings':

- REACT_APP_AUTH_DOMAIN
- REACT_APP_DATABASE_URL
- REACT_APP_PROJECT_ID
- REACT_APP_STORAGE_BUCKET
- REACT_APP_MEASUREMENT_ID
- REACT_APP_APP_ID
- REACT_APP_MESSAGING_SENDER_ID
- REACT_APP_API_KEY
- REACT_APP_SECRET_API_KEY

The name have to match exactly the above <br>
For the Alpha Vantage Api Key, you'll have to contact us.

---

In the project directory, you can run:

### `npm install`

This will install all the dependencies

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

# The project

## Description

This is a web app where you can set up your own virtual stock portfolio, see overall development on the portfolio as well as overtime development on specific stocks. The stocks can be bought with fake money and will then be added to a personal portfolio. Thus, providing the user with the educational value of learning to trade and manage their assets, but without any associated risks. In addition, the user will possibly be given some sort of score according to ROI.

## Stack

The app will be built in React, with a backend in Firebase for data storage as well as authentication. Also, Material UI will be used for simplifying styling.

## API

Alpha Vantage will be used to access all data concerning the stock information, such as stock buy/sell price and historical data. Alpha Vantage has a reliable and widely used test API, which is simple to register for and utilize.

Reference: https://www.alphavantage.co/documentation/

## Data

Our app will get all the data from the API connected to the individual portfolio, such as stocks in portfolio, purchase price, stock id, date of purchase and quantity. The users and their related information will be stored in the backend, and thus not retrieved via the Alpha Vantage API.

## Mockup

![login](doc/login.png)

![signup](doc/signup.png)

![dashboard](doc/dashboard.png)

![stocks-overview](doc/stocks-overview.png)

![stock-details](doc/stock-details.png)

![stock-confirm](doc/stock-confirm.png)

![profile](doc/profile.png)

## Progress

All of the different pages are created and most of them have the most basic functionality they're intended to have. The log in page and sign up page work almost correctly, there are some minor bugs such as it redirects when typing wrong password. The search page do fetch data from from Alpha Vantage API, but only get the name, more detailed information is not available yet. All of the pages need more styling, and some pages need to have more API calls to get more detailed data.

The logic for stock purchases/selling and general portfolio handeling is not done yet. This have to be implemented!

The file structure is based on the purpose of the file. For example the components and api calls are two different thing, hence exists in two different folders. The components are class based.
