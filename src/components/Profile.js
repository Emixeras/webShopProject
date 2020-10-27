import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import React, { Component }  from 'react';
import {Link} from "react-router-dom";
import Bar from "./Bar";



class Profile extends Component {
    constructor(props){
        super(props);
        this.state={
        }
    }
    onSignOutClick(){
        const { history } = this.props;
        console.log('you have been logged out');
        localStorage.clear();
        history.push("/login");
    }

    render() {
        if (localStorage.getItem('isLoggedIn') == '1') {
            return (
                <div>
                    <MuiThemeProvider>
                        <div>
                            <Bar title={this.constructor.name}/>
                            you're logged in
                            <br/>
                            <br/>
                            username: {localStorage.getItem('UserName')}<br/>
                            role: {localStorage.getItem('UserRole')}<br/>
                            pass: {localStorage.getItem('UserPass')}<br/>
                            address: {localStorage.getItem('UserAdresses')}<br/>
                            id: {localStorage.getItem('UserId')};<br/>
                            <RaisedButton onClick={() => this.onSignOutClick()} label="log out" primary={true} style={style}/>
                        </div>
                    </MuiThemeProvider>
                </div>
            );
        }else{
            return(
                <div>
                    <MuiThemeProvider>
                        <div>
                            <Bar title={this.constructor.name}/>
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