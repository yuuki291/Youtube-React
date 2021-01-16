import React from "react";
import "./App2.css";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import indigo from "@material-ui/core/colors/indigo";
import NavBar2 from "./components/NavBar2";
import ApiContextProvider from "./context/ApiContext2";
import Main from "./components/Main2";

const theme = createMuiTheme({
    palette: {
        primary: indigo,
        secondary: {
            main: "#f44336",
        },
    },
    typography: {
        fontFamily: '"Comic Neue",cursive',
    },
})


function SNS() {
    return (
        <ApiContextProvider>
            <MuiThemeProvider theme={theme}>
                <NavBar2 />
                <div className="container">
                    <Main />
                </div>
            </MuiThemeProvider>
        </ApiContextProvider>
    );
}

export default SNS;