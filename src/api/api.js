import { envVar } from "./../constants/config";


function getURL(options) {
    const urls = {
        stockSearch: `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${options.query}&apikey=${envVar.alphaVantageApiKey}`,
        stockDetails: `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&outputsize=${options.outputsize}&interval=${options.interval}min&symbol=${options.symbol}&apikey=${envVar.alphaVantageApiKey}`,
        stockQuote: `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${options.symbol}&apikey=${envVar.alphaVantageApiKey}`
    }


    return urls[options.type]
}

export function alphaVantageApiCall(options) {
    // Symbol search options = query
    // Detail search options = interval [1, 5, 15, 30, 60](min) and symbol (e.g. GOOL) outputsize = compact / full
    return fetch(getURL(options), {
        method: 'GET'
    })
}