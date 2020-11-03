import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import React, {Component, useState} from 'react';
import {Link} from "react-router-dom";

import Profile from "./Profile";
import MenuDrawer from "./MenuDrawer";
import {loginUser} from "../services/UserApiUtil";
import {addDrawerCallback, isDrawerVisible, isUserLoggedIn} from "../services/StorageUtil";
import {makeStyles} from '@material-ui/core/styles';
import {isEmail, padding} from "../services/Utilities";
import {
    Card,
    Avatar,
    Button,
    Grid,
    Checkbox,
    TextField,
    FormControlLabel,
    Typography,
    Container, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton,
} from '@material-ui/core';
import Box from '@material-ui/core/Box';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {useHistory} from "react-router-dom";
import CssBaseline from '@material-ui/core/CssBaseline';
import {Visibility, VisibilityOff} from "@material-ui/icons";


class Login extends Component {
    showPassword = false;
    passwordError = false;
    passwordState = {password: "", passwordRepeat: ""};
    emailError = false;
    drawerState = isDrawerVisible();


    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
        };
        addDrawerCallback(state => {
            this.drawerState = state;
            this.forceUpdate()
        })

    }

    render() {
        if (!isUserLoggedIn()) {
            return <LogInForm context={this}/>
        } else {
            {/*<NavigateToProfile/>*/
            }
            return (
                <Profile/>
            );
        }
    }

}

function NavigateToProfile() {
    const history = useHistory();
    history.push("/Profile")
}


const useStyles = makeStyles((theme) => ({
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

function LogInForm(props) {
    const that = props.context;
    const classes = useStyles();
    const history = useHistory();
    const [showPassword, setShowPassword] = useState(false);
    const validEmail = that.state.email.length === 0 || isEmail(that.state.email);
    return (
        <div>
            <MenuDrawer/>
            <div style={{
                marginTop: 8,
                marginInlineStart: (that.drawerState ? 240 : 0),
                display: 'flex',
                justifyContent: 'center'
            }}>
                <div style={{width: '85%', maxWidth: "450px"}}>
                    <Card style={padding(25)}>
                        <div className={classes.paper}>
                            <Avatar className={classes.avatar}>
                                <LockOutlinedIcon/>
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Anmelden
                            </Typography>
                            <TextField required
                                       fullWidth
                                       label="E-MailAdresse"
                                       variant="outlined"
                                       margin="normal"
                                       error={!validEmail}
                                       helperText={validEmail ? "" : "Eine valide E-MailAdresse eingeben"}
                                       value={that.state.email}
                                       name="email"
                                       onChange={event => that.setState({email: event.target.value})}/>
                            <FormControl margin={"normal"}
                                         fullWidth
                                         variant="outlined">
                                <InputLabel required>Passwort</InputLabel>
                                <OutlinedInput
                                    type={showPassword ? 'text' : 'password'}
                                    value={that.state.password}
                                    onChange={event => that.setState({password: event.target.value})}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={event => setShowPassword(!showPassword)}
                                                onMouseDown={(event) => {
                                                    event.preventDefault();
                                                }}
                                                edge="end">
                                                {showPassword ?
                                                    <VisibilityOff/> :
                                                    <Visibility/>}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    labelWidth={78}
                                />
                            </FormControl>

                            <FormControlLabel style={{alignSelf: "start"}}
                                              control={<Checkbox value="remember" color="primary"/>}
                                              label="Angemeldet bleiben"
                            />
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    loginUser(that.state.email, that.state.password, () => {
                                        history.push("/")
                                    })
                                }}
                                disabled={!(validEmail && that.state.email && that.state.password)}
                                style={{marginBottom: 12, marginTop: 12}}
                            >Anmelden</Button>
                            <Grid container justify={"flex-end"}>
                                {/*    <Grid item>*/}
                                {/*        <Link href="#" variant="body2" >*/}
                                {/*            Forgot password?*/}
                                {/*        </Link>*/}
                                {/*    </Grid>*/}
                                <Grid item>
                                    <Link href="#" variant="body2" to={"register"}>
                                        {"Noch keinen Account? Hier Registrieren"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </div>
                    </Card>

                    <Typography style={{marginTop: 50, marginBottom: 15}} variant="body2" color="textSecondary"
                                align="center">
                        {'Copyright © Studiotranics '}
                        {new Date().getFullYear()}
                    </Typography>
                </div>
            </div>
        </div>
    )
}


const style = {
    margin: 15,
};
export default Login;