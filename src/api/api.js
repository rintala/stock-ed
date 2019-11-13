import { envVar } from "./../constants/config";


function getURL(query, searchType) {
    return `https://www.alphavantage.co/query?function=${searchType}&keywords=${query}&apikey=${envVar.alphaVantageApiKey}`
}
export const alphaVantageApiCall = {
    stockSearch: (query) => {
        return fetch(getURL(query, 'SYMBOL_SEARCH'), {
            method: 'GET'
        })
    }
}