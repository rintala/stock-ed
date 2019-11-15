import { createMuiTheme } from '@material-ui/core';
import { blue, grey } from '@material-ui/core/colors';

export const theme = createMuiTheme({
    palette: {
        primary: {
            main: grey[800]
        }
    },
    overrides: {
        input: {
            marginLeft: '1rem',
            flex: 1,
        },
        MuiInputBase: {
            input: {
                // borderRadius: '0.5rem'
            },
        },
        MuiTable: {
            root: {
                background: grey[700],
            },
        },
        MuiTableCell: {
            head: {
                color: grey[300],
                background: grey[800]
            },
            body: {
                color: grey[200]
            }
        },
        MuiFormLabel: {
            root: {
                color: grey[800],
                '&$focused': {
                    color: grey[800],
                }
            }
        }
    },
})