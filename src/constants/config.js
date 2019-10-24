export const envVar = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID
};

export const setEnvVars = () => {
    return Object.keys(envVar).reduce((acc, key) => {
        if (!envVar[key]) {
            return Object.assign(acc, { [key]: false })
        } else {
            return Object.assign(acc, { [key]: true })
        }
    }, {}) //Inital value as empty object
}
