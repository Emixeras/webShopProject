import {NavigationComponent, titles} from "../Utilities/Utilities";
import {
    Card,
    Avatar,
    Button,
    Grid,
    Checkbox,
    TextField,
    FormControlLabel,
    Typography,
    FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, MenuItem, FormHelperText,
} from '@material-ui/core';
import React, {Component} from 'react';
import {Link} from "react-router-dom";
import MenuDrawer from "./MenuDrawer";
import {registerUser} from "../services/UserApiUtil";
import {isEmail, padding, showToast} from "../Utilities/Utilities";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import {Visibility, VisibilityOff} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";
import {useHistory} from "react-router-dom";
import {isUserLoggedIn} from "../services/StorageUtil";
import {setRememberMe} from "../services/RememberMeUtil";

class Register extends Component {

    showPassword = false;
    passwordError = false;
    passwordState = {password: "", passwordRepeat: ""};
    emailError = false;
    user = {};
    editMode = false;

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            birthdayDate: '1980-01-01',
            title: 'none',
            showPassword: false,
        };
        window.scrollTo(0,0);
    }

    render() {
        if (!isUserLoggedIn()) {
            return <RegisterForm context={this}/>
        } else {
            return (<NavigationComponent to={"/profile"}/>);
        }
    }

    // ---------------

    handlePasswordChange = name => event => {
        let currentPasswordChange = event.target.value;
        this.setState({password: currentPasswordChange});
        this.passwordState = {...this.passwordState, [name]: currentPasswordChange};
        this.passwordError = this.passwordState.password !== this.passwordState.passwordRepeat;
    };

    getButtonState() {
        return !(
            //this.state.title!=='none' &&
            this.state.firstName &&
            this.state.lastName &&
            this.state.birthdayDate &&
            this.state.email &&
            !this.emailError &&
            this.state.password &&
            !this.passwordError
        );
    }

    checkEmail() {
        return this.emailError = !(this.state.email.length === 0 || isEmail(this.state.email));
    }
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

function RegisterForm(props) {
    const that = props.context;
    const classes = useStyles();
    const history = useHistory();
    let register = () => {
        var payload = {
            "title": that.state.title,
            "birth": that.state.birthdayDate + "T00:00:00Z[UTC]",
            "email": that.state.email,
            "password": that.state.password,
            "firstName": that.state.firstName,
            "lastName": that.state.lastName,
        };
        console.log(payload);
        registerUser(payload, () => {
                showToast('Registrieren erfolgreich', "success");
                history.push("/");
            },
            (error) => {
                showToast("Beim Registrieren ist ein Fehler aufgetreten:\n" + error.message, "error");
            })
    };
    let onKeyPress = (event) => {
        if (event.key === 'Enter' && !that.getButtonState()) {
            register()
        }
    };
    return (
        <MenuDrawer>
            <div style={{
                marginTop: 8,
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
                                Registrieren
                            </Typography>
                            <TextField
                                select
                                margin={"normal"}
                                fullWidth
                                label="Anrede"
                                value={that.title}
                                helperText="Eine gewünschte Anrede auswählen"
                                variant="outlined"
                                onChange={event => that.setState({title: event.target.value.trim()})}
                            >
                                {titles().map((option) => (
                                    <MenuItem key={option.value}
                                              value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <Grid
                                container
                                spacing={2}>
                                <Grid item md sm={12} xs={12}>
                                    <TextField required
                                               fullWidth
                                               label="Vorname"
                                               variant="outlined"
                                               onKeyPress={onKeyPress}
                                               onChange={event => that.setState({firstName: event.target.value})}
                                               value={that.state.firstName}
                                               margin={"normal"}/>
                                </Grid>
                                <Grid item md sm={12} xs={12}>
                                    <TextField required
                                               fullWidth
                                               label="Nachname"
                                               variant="outlined"
                                               onKeyPress={onKeyPress}
                                               onChange={event => that.setState({lastName: event.target.value})}
                                               value={that.state.lastName}
                                               margin={"normal"}/>
                                </Grid>
                            </Grid>
                            <TextField required
                                       label="Geburtsdatum"
                                       type="date"
                                       variant="outlined"
                                       margin={"normal"}
                                       fullWidth
                                       value={that.state.birthdayDate}
                                       onKeyPress={onKeyPress}
                                       onChange={event => that.setState({"birthdayDate": event.target.value})}
                            />
                            <TextField required
                                       fullWidth
                                       label="E-Mail Adresse"
                                       variant="outlined"
                                       margin="normal"
                                       error={that.checkEmail()}
                                       value={that.state.email}
                                       helperText={that.emailError ? "Bitte eine Korrekte E-MailAdresse eingeben" : ""}
                                       name="email"
                                       onKeyPress={onKeyPress}
                                       onChange={event => that.setState({email: event.target.value})}/>
                            <FormControl margin={"normal"}
                                         fullWidth
                                         variant="outlined">
                                <InputLabel required>Passwort</InputLabel>
                                <OutlinedInput
                                    type={that.state.showPassword ? 'text' : 'password'}
                                    value={that.passwordState.password}
                                    onChange={that.handlePasswordChange("password")}
                                    onKeyPress={onKeyPress}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => {
                                                    that.state.showPassword = !that.state.showPassword;
                                                    that.forceUpdate()
                                                }}
                                                onMouseDown={(event) => {
                                                    event.preventDefault();
                                                }}
                                                edge="end">
                                                {that.state.showPassword ?
                                                    <VisibilityOff/> :
                                                    <Visibility/>}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    labelWidth={78}
                                />
                            </FormControl>
                            <FormControl margin={"normal"}
                                         fullWidth
                                         variant="outlined">
                                <InputLabel required error={that.passwordError}>Passwort
                                    Wiederholen</InputLabel>
                                <OutlinedInput
                                    type={that.state.showPassword ? 'text' : 'password'}
                                    value={that.passwordState.passwordRepeat}
                                    error={that.passwordError}
                                    onChange={that.handlePasswordChange("passwordRepeat")}
                                    onKeyPress={onKeyPress}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => {
                                                    that.state.showPassword = !that.state.showPassword;
                                                    that.forceUpdate()
                                                }}
                                                onMouseDown={(event) => {
                                                    event.preventDefault();
                                                }}
                                                edge="end">
                                                {that.state.showPassword ?
                                                    <VisibilityOff/> :
                                                    <Visibility/>}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    labelWidth={175}
                                />
                                <FormHelperText
                                    error={that.passwordError}> {that.passwordError ? "Die Passwörter müssen übereinstimmen" : ""}</FormHelperText>
                            </FormControl>
                            <FormControlLabel style={{alignSelf: "start"}}
                                              control={<Checkbox value="remember" color="primary" onClick={event => setRememberMe(event.target.checked)}/>}
                                              label="Angemeldet bleiben"
                            />
                            <Button
                                disabled={that.getButtonState()}
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={register}
                                //disabled={!(validEmail && this.state.email && this.state.password)}
                                style={{marginBottom: 12, marginTop: 12}}
                            >Registrieren</Button>
                            <Grid container justify={"flex-end"}>
                                {/*    <Grid item>*/}
                                {/*        <Link href="#" variant="body2" >*/}
                                {/*            Forgot password?*/}
                                {/*        </Link>*/}
                                {/*    </Grid>*/}
                                <Grid item>
                                    <Link href="#" variant="body2" to={"login"}>
                                        {"bereits registriert? Hier einloggen"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </div>
                    </Card>

                    <Typography style={{marginTop: 50, marginBottom: 15}} variant="body2"
                                color="textSecondary"
                                align="center">
                        {'Copyright © Studiotranics '}
                        {new Date().getFullYear()}
                    </Typography>
                </div>
            </div>
        </MenuDrawer>
    )
}

export default Register;
