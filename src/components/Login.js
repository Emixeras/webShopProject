import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import React, {Component} from 'react';
import {Link} from "react-router-dom";

import Profile from "./Profile";
import MenuDrawer from "./MenuDrawer";
import {loginUser} from "../services/UserApiUtil";
import {isUserLoggedIn} from "../services/StorageUtil";


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
        }
    }

    render() {
        if (isUserLoggedIn !== true) {
            return (
                <div>
                    <MuiThemeProvider>
                        <div>
                            <MenuDrawer/>
                            <TextField style={style}
                                       hintText="Enter your Email"
                                       floatingLabelText="Email"
                                       onChange={(event, newValue) => this.setState({email: newValue})}
                            />
                            <br/>
                            <TextField style={style}
                                       type="password"
                                       hintText="Enter your Password"
                                       floatingLabelText="Password"
                                       onChange={(event, newValue) => this.setState({password: newValue})}
                            />
                            <br/>
                            <RaisedButton label="Submit" primary={true} style={style}
                                          onClick={() => this.handleClick()}/>
                            <br/>
                            or register
                            <Link to="/register">
                                <RaisedButton label="here" style={style}/>
                            </Link>
                        </div>
                    </MuiThemeProvider>
                </div>
            );
        } else {
            return (
                <Profile/>
            );
        }
    }

    handleClick() {
        const {history} = this.props;
        loginUser(this.state.email, this.state.password, () => {
            history.push("/")
        })
    }

}

const style = {
    margin: 15,
};
export default Login;