import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import React, { Component }  from 'react';
import Home from "./Home";
import axios from 'axios';
import {Link} from "react-router-dom";
import Bar from "./Bar";

class Login extends Component {
    constructor(props){
        super(props);
        this.state={
            username:'',
            password:''
        }
    }
    render() {
        return (
            <div>
                <MuiThemeProvider>
                    <div>
                        <Bar title={this.constructor.name}></Bar>
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
    handleClick(event){
        var apiBaseUrl = "http://localhost:4000/api/";
        var self = this;
        var payload={
            "email":this.state.username,
            "password":this.state.password
        }
        axios.post(apiBaseUrl+'login', payload)
            .then(function (response) {
                console.log(response);
                if(response.data.code === 200){
                    console.log("Login successfull");
                    var uploadScreen=[];
                    uploadScreen.push(<Home appContext={self.props.appContext}/>)
                    self.props.appContext.setState({loginPage:[],uploadScreen:uploadScreen})
                }
                else if(response.data.code === 204){
                    console.log("Username password do not match");
                    alert("username password do not match")
                }
                else{
                    console.log("Username does not exists");
                    alert("Username does not exist");
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