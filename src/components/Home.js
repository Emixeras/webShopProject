import React from 'react'
import {RaisedButton} from "material-ui";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import {Link} from "react-router-dom";
import MenuDrawer from "./MenuDrawer";
import {Typography} from "@material-ui/core";
import {isUserLoggedIn} from "../services/StorageUtil";


class Home extends React.Component {
    render() {
        if(isUserLoggedIn() !== undefined){
            return (
            <div>
                <MuiThemeProvider>
                    <MenuDrawer/>
                    <Typography variant = "h3" align="center">Herzlich Willkommen im Studiotranics Shop :-)</Typography>
                    <Link to="/login" >
                        <RaisedButton label="login" primary={true} style={style}/>
                    </Link>
                    <Link to="/register">
                        <RaisedButton label="register" primary={true} style={style}/>
                    </Link>
                    <Link to="/profile" >
                        <RaisedButton label="profile" primary={true} style={style}/>
                    </Link>
                </MuiThemeProvider>
            </div>

        )}else{
            return <div>pls log in</div>
        }

    }
}
const style = {
    margin: 15,
};
export default Home;