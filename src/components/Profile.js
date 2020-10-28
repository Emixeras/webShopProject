import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import React, { Component }  from 'react';
import {Link} from "react-router-dom";
import MenuDrawer from "./MenuDrawer";
import axios from "axios";



class Profile extends Component {
    constructor(props){
        super(props);
        this.user = JSON.parse(localStorage.getItem('User'))
        this.state={
        }
    }
    onSignOutClick(){
        const { history } = this.props;
        console.log('you have been logged out');
        localStorage.clear();
        history.push("/login");
    }

    onDeleteUserClick(){
        const { history } = this.props;
        var apiBaseUrl = "http://localhost:8080/user/";

        axios.delete(apiBaseUrl+this.user.username, {
            auth: {
                username: this.user.username,
                password: this.user.password
            }
        })
            .then(function (response) {
                if(response.status === 200){
                    console.log("user delete successful");
                    localStorage.clear();
                    history.push("/");
                }else(
                    alert('delete failed')
                )
    })

    }
    render() {
        if (localStorage.getItem('isLoggedIn') == '1') {
            var user = JSON.parse(localStorage.getItem('User'));
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
                            user_json: {localStorage.getItem('User')}<br/>
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