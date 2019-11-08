export const envVar = {
  apiKey: {
    name: "REACT_APP_API_KEY",
    value: process.env.REACT_APP_API_KEY
  },
  authDomain: {
    name: "REACT_APP_AUTH_DOMAIN",
    value: process.env.REACT_APP_AUTH_DOMAIN
  },
  databaseURL: {
    name: "REACT_APP_DATABASE_URL",
    value: process.env.REACT_APP_DATABASE_URL
  },

  projectId: {
    name: "REACT_APP_PROJECT_ID",
    value: process.env.REACT_APP_PROJECT_ID
  },
  storageBucket: {
    name: "REACT_APP_STORAGE_BUCKET",
    value: process.env.REACT_APP_STORAGE_BUCKET
  },
  messagingSenderId: {
    name: "REACT_APP_MESSAGING_SENDER_ID",
    value: process.env.REACT_APP_MESSAGING_SENDER_ID
  },
  appId: {
    name: "REACT_APP_APP_ID",
    value: process.env.REACT_APP_APP_ID
  },
  measurementId: {
    name: "REACT_APP_MEASUREMENT_ID",
    value: process.env.REACT_APP_MEASUREMENT_ID
  }
};

export const setEnvVars = () => {
  return Object.keys(envVar).reduce((acc, key) => {
    if (!envVar[key].value) {
      return Object.assign(acc, { [envVar[key].name]: false });
    } else {
      if (envVar[key].value.length < 2) {
        return Object.assign(acc, { [envVar[key].name]: false });
      }
      return Object.assign(acc, { [envVar[key].name]: true });
    }
  }, {}); //Inital value as empty object
};
