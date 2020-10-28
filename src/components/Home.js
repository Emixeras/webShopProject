import React from 'react'
import {RaisedButton} from "material-ui";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import {Link} from "react-router-dom";
import MenuDrawer from "./MenuDrawer";


class Home extends React.Component {
    render() {
        if(localStorage.getItem('myUser')!== undefined){
            console.log('logged in');
            return (
            <div>
                <MuiThemeProvider>
                    <MenuDrawer/>
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