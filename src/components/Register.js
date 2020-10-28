import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import React, { Component }  from 'react';
import {Link} from "react-router-dom";
import red from "@material-ui/core/colors/red";
import Profile from "./Profile";
import MenuDrawer from "./MenuDrawer";
import {registerUser} from "../services/ApiUtil";

class Register extends Component {
    password = '';
    passwordRepeat = '';
    passwordMatch = true;
    constructor(props){
        super(props);
        this.state={
            email:'',
            username:'',
            password:'',
            firstName:'',
            lastName:''
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
                                   hintText="First Name"
                                   floatingLabelText="First Name"
                                   onChange = {(event,newValue) => this.setState({firstName:newValue})}
                        />
                        <br/>
                        <TextField style={style}
                                   hintText="Last Name"
                                   floatingLabelText="Last Name"
                                   onChange = {(event,newValue) => this.setState({lastName:newValue})}
                        />
                        <br/>
                        <TextField style={style}
                                   hintText="Enter your Username"
                                   floatingLabelText="Username"
                                   onChange = {(event,newValue) => this.setState({username:newValue})}
                        />
                        <br/>
                        <TextField style={style}
                                   hintText="Enter your Email"
                                   floatingLabelText="Email"
                                   onChange = {(event,newValue) => this.setState({email:newValue})}
                        />
                        <br/>
                        <TextField style={style}
                                   type="password"
                                   hintText="Enter your Password"
                                   floatingLabelText="Password"
                                   onChange = {(event,newValue) => {
                                       this.password = newValue;
                                       this.setState({password:newValue})
                                       this.passwordMatch = this.password === this.passwordRepeat;
                                   }}
                        />
                        <br/>
                        <TextField style={style}
                                   type="password"
                                   hintText="repeat your Password"
                                   floatingLabelText="repeat password"
                                   onChange = {(event,newValue)=>{
                                       this.passwordRepeat = newValue;
                                       this.setState({password:newValue});
                                       this.passwordMatch = this.password === this.passwordRepeat;
                                   }}
                        />
                        <br/>
                        <PasswordMatchNotification isLoggedIn={this.passwordMatch}/>
                        <RaisedButton label="Submit" primary={true} style={style} onClick={(event) => this.handleClick(event)}/>
                        <br/>
                        already registered? login
                        <Link to="/login" >
                            <RaisedButton label="here" style={style}/>
                        </Link>
                    </div>
                </MuiThemeProvider>
            </div>
        );
        }else{
            return(
                <Profile/>
            );
        }
    }

    handleClick(){
        const { history } = this.props;

        var payload={
            //"email":this.state.email,
            "username":this.state.username,
            "password":this.state.password,
            "firstName":this.state.firstName,
            "lastName":this.state.lastName,
        }

        if(this.passwordMatch){
            registerUser(payload);
            history.push("/");
        }
    }

}

function PasswordMatchNotification(props) {
    const isLoggedIn = props.isLoggedIn;
    if (isLoggedIn) {
        return (<div> </div>);
    }
    return (<div><p style={passwordmatchnotification}>passwords don't match</p></div>
    );
}

const style = {
    margin: 5,
};
const passwordmatchnotification = {
    fontsize:160,
    color:red
}
export default Register;