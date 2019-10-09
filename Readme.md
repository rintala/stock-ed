# stock-ed

## Description

This is a web app where you can set up your own virtual stock portfolio, see overall development on the portfolio as well as overtime development on specific stocks. The stocks can be bought with fake money and will then be added to a portfolio; thus, providing the user with the educational value of learning to trade and manage their assets, but without any associated risks. In addition, the user will possibly be given some sort of score according to ROI.

## Stack

The app will be built in React, with a backend in Firebase for data storage as well as authentication. Also, some Bootstrap will most likely be used for simplifying styling.

## API

Nordnet External API will be used to access all data concerning the stock information, such as stock buy/sell price and historical data. Nordnet has a reliable and widely used test API, which is simple to register for and utilize.

Reference: https://api.test.nordnet.se/

## Data

Our app will get all the data from the API connected to the individual portfolio, such as stocks in portfolio, purchase price, stock id, date of purchase and quantity. The users and their related information will be stored in the backend, and thus not retrieved via the Nordnet API.

## Mockup

