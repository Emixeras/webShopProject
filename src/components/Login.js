import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import React, { Component }  from 'react';
import {Link} from "react-router-dom";
import Profile from "./Profile";
import MenuDrawer from "./MenuDrawer";
import {loginUser} from "../services/ApiUtil";


class Login extends Component {
    constructor(props){
        super(props);
        this.state={
            username:'',
            password:'',
        }
    }
    render() {
        if(localStorage.getItem('isLoggedIn')!=='1'){
            return (
                <div>
                    <MuiThemeProvider>
                        <div>
                            <MenuDrawer/>
                            <TextField style={style}
                                       hintText="Enter your Username"
                                       floatingLabelText="Username"
                                       onChange = {(event,newValue) => this.setState({username:newValue})}
                            />
                            <br/>
                            <TextField style={style}
                                       type="password"
                                       hintText="Enter your Password"
                                       floatingLabelText="Password"
                                       onChange = {(event,newValue) => this.setState({password:newValue})}
                            />
                            <br/>
                            <RaisedButton label="Submit" primary={true} style={style} onClick={() => this.handleClick()}/>
                            <br/>
                            or register
                            <Link to="/register" >
                                <RaisedButton label="here" style={style}/>
                            </Link>
                        </div>
                    </MuiThemeProvider>

                </div>
            );
        }
        else{
            return(
            <Profile/>
            );
        }
    }

    handleClick(){
        loginUser(this.state.username, this.state.password, this.props)
    }

}
const style = {
    margin: 15,
};
export default Login;