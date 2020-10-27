import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import React, { Component }  from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";
import Bar from "./Bar";
import Profile from "./Profile";


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
                            <Bar title={this.constructor.name}/>
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
                            <RaisedButton label="Submit" primary={true} style={style} onClick={(event) => this.handleClick(event)}/>
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
        var apiBaseUrl = "http://localhost:8080/api/user/login";
        const { history } = this.props;

        axios.get(apiBaseUrl, {
            auth: {
                username: this.state.username,
                password: this.state.password
            }
        })
            .then(function (response) {
                console.log(response);
                if(response.status === 200){
                    console.log("Login successfull");
                    console.log(response.data.password);
                    localStorage.setItem('isLoggedIn', '1');
                    localStorage.setItem('UserPass', response.data.password);
                    localStorage.setItem('UserName', response.data.username);
                    localStorage.setItem('UserAdresses', response.data.addresses);
                    localStorage.setItem('UserRole', response.data.role);
                    localStorage.setItem('UserId', response.data.id);
                    history.push("/");
                }
                else if(response.status === 204){
                    console.log("Username password do not match");
                    alert("username password do not match")
                }
                else{
                    console.log("Username does not exists");
                    alert("Username does not exists");
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

}
const style = {
    margin: 15,
};
export default Login;