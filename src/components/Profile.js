import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import React, { Component }  from 'react';
import {Link} from "react-router-dom";
import MenuDrawer from "./MenuDrawer";
import {getSessionUser} from "../services/StorageUtil";
import {deleteUser, logoutUser} from "../services/UserApiUtil";



class Profile extends Component {
    constructor(props){
        super(props);
        this.user = getSessionUser();
        this.state={
        }
    }
    onSignOutClick(){
        console.log('you have been logged out');
        logoutUser(this.props);
    }

    onDeleteUserClick(){
        deleteUser(this.props);
    }

    render() {
        if (localStorage.getItem('isLoggedIn') === '1') {
            var user = getSessionUser();
            return (
                <div>
                    <MuiThemeProvider>
                        <div>
                            <MenuDrawer/>
                            you're logged in
                            <br/>
                            <br/>
                            username: {user.username}<br/>
                            role: {user.role}<br/>
                            pass: {user.password}<br/>
                            address: {user.addresses}<br/>
                            id: {user.id}<br/>
                            user_json: {JSON.stringify(user)}<br/>
                            <RaisedButton onClick={() => this.onSignOutClick()} label="log out" primary={true} style={style}/>
                            <RaisedButton onClick={() => this.onDeleteUserClick()} label="delete user" primary={true} style={style}/>
                        </div>
                    </MuiThemeProvider>
                </div>
            );
        }else{
            return(
                <div>
                    <MuiThemeProvider>
                        <div>
                            <MenuDrawer/>
                            pls log in
                            <Link to="/login" >
                            <RaisedButton label="here" primary={true} style={style}/>
                        </Link>
                        </div>
                    </MuiThemeProvider>
                </div>
            );
        }
    }
}

const style = {
    margin: 15,
};
export default Profile;