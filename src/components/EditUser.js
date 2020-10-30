import React, {Component, useRef, useState} from 'react';
import axios from 'axios';
import Grid from "@material-ui/core/Grid";
import {
    Card,
    Container,
    TextField,
    MenuItem,
    Button,
    MuiThemeProvider,
    FormControl,
    InputLabel,
    OutlinedInput,
    InputAdornment,
    IconButton,
    FormHelperText
} from '@material-ui/core';
import MenuDrawer from "./MenuDrawer";
import {Visibility, VisibilityOff} from "@material-ui/icons";

const propState = {
    title: '',
    firstName: '',
    lastName: '',
    birthday: '',
    username: '',
    email: '',
    password: '',
    addresses: []
};
let buttonEnabled = false;
let saveButton;

class Register extends Component {
    showPassword = false;
    passwordError = false;
    passwordState = {password: "", passwordRepeat: ""};
    emailError = false;
    emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


    constructor(props, context) {
        super(props, context);
        this.state = {
            title: 'none',
            firstName: '',
            lastName: '',
            birthday: require('dateformat')(new Date(), "yyyy-mm-dd"),
            username: '',
            email: '',
            password: '',
            addresses: []
        };
        this.user = JSON.parse(localStorage.getItem('User'));
    }


    render() {
        if (localStorage.getItem('isLoggedIn')) {
            return <div>
                {/*<MuiThemeProvider>*/}
                {/*    <div>*/}
                {/*        <MenuDrawer/>*/}
                <Container style={{
                    marginTop: 10,
                    display: 'flex', justifyContent: 'center'
                }}
                >
                    <Grid
                        style={{width: '58%'}}
                        container
                        direction="column"
                        justify="center"
                        alignItems="center"
                        spacing={3}>
                        <Grid item style={{width: '100%'}}>
                            <Card style={padding(18)}>
                                <Grid
                                    container
                                    direction="column">
                                    <Grid item style={{width: '100%'}}>
                                        <div style={{
                                            textAlign: "start",
                                            fontSize: 22,
                                            marginBottom: 3
                                        }}>
                                            Personen Daten
                                        </div>
                                    </Grid>
                                    <Grid item style={{width: '100%'}}>
                                        <TextField
                                            select
                                            style={{width: '100%'}}
                                            margin={"normal"}
                                            label="Anrede"
                                            value={this.state.title}
                                            helperText="Eine gewünschte Anrede auswählen"
                                            variant="outlined"
                                            onChange={this.handleChange}
                                        >
                                            {titles.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>

                                    </Grid>
                                    <Grid item style={{width: '100%'}}>
                                        <Grid
                                            container
                                            direction={"row"}
                                            justify="space-between"
                                            spacing={2}>
                                            <Grid item style={{width: '50%'}}>
                                                <TextField style={{width: '100%'}}
                                                           label="Vorname" variant="outlined"
                                                           onChange={event => this.setState({firstName: event.target.value.trim()})}
                                                           margin={"normal"}/>
                                            </Grid>
                                            <Grid item style={{width: '50%'}}>
                                                <TextField style={{width: '100%'}}
                                                           label="Nachname" variant="outlined"
                                                           onChange={event => this.setState({lastName: event.target.value.trim()})}
                                                           margin={"normal"}/>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item
                                          style={{width: '100%'}}>
                                        <TextField
                                            label="Geburtsdatum"
                                            type="date"
                                            variant="outlined"
                                            margin={"normal"}
                                            style={{width: '100%'}}
                                            onChange={event => this.setState({birthday: event.target.value.trim()})}
                                            defaultValue={this.state.birthday}
                                        />
                                    </Grid>
                                </Grid>
                            </Card>
                        </Grid>
                        <Grid item style={{width: '100%'}}>
                            <Card style={padding(18)}>
                                <Grid
                                    container
                                    direction="column">
                                    <Grid item style={{width: '100%'}}>
                                        <div style={{
                                            textAlign: "start",
                                            fontSize: 22,
                                            marginBottom: 3
                                        }}>
                                            Account Daten
                                        </div>
                                    </Grid>
                                    <Grid item>
                                        <TextField label="Benutzername" variant="outlined"
                                                   onChange={event => this.setState({userName: event.target.value.trim()})}
                                                   margin={"normal"} style={{width: '100%'}}/>
                                    </Grid>
                                    <Grid item>
                                        <TextField type="email" label="E-MailAdresse"
                                                   variant="outlined" margin={"normal"}
                                                   onChange={event => this.setState({email: event.target.value.trim()})}
                                                   error={this.checkEmail()}
                                                   helperText={this.emailError ? "Bitte eine Korrekte E-MailAdresse eingeben" : ""}
                                                   style={{width: '100%'}}/>
                                    </Grid>
                                    < Grid item>
                                        <FormControl margin={"normal"} style={{width: '100%'}}
                                                     variant="outlined">
                                            <InputLabel>Passwort</InputLabel>
                                            <OutlinedInput
                                                type={this.showPassword ? 'text' : 'password'}
                                                value={this.passwordState.password}
                                                onChange={this.handlePasswordChange("password")}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={event => {
                                                                this.showPassword = !this.showPassword;
                                                                this.forceUpdate()
                                                            }}
                                                            onMouseDown={(event) => {
                                                                event.preventDefault();
                                                            }}
                                                            edge="end">
                                                            {this.showPassword ? <Visibility/> :
                                                                <VisibilityOff/>}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                labelWidth={68}
                                            />
                                        </FormControl>
                                    </Grid>
                                    < Grid item>
                                        <FormControl margin={"normal"} style={{width: '100%'}} variant="outlined">
                                            <InputLabel error={this.passwordError}>Passwort Wiederholen</InputLabel>
                                            <OutlinedInput
                                                type={this.showPassword ? 'text' : 'password'}
                                                value={this.passwordState.passwordRepeat}
                                                error={this.passwordError}
                                                onChange={this.handlePasswordChange("passwordRepeat")}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={event => {
                                                                this.showPassword = !this.showPassword;
                                                                this.forceUpdate()
                                                            }}
                                                            onMouseDown={(event) => {
                                                                event.preventDefault();
                                                            }}
                                                            edge="end">
                                                            {this.showPassword ? <Visibility/> : <VisibilityOff/>}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                labelWidth={165}
                                            />
                                            <FormHelperText error={this.passwordError}> {this.passwordError ? "Die Passwörter müssen übereinstimmen" : ""}</FormHelperText>
                                        </FormControl>
                                    </Grid>

                                </Grid>
                            </Card>
                        </Grid>
                        <Grid item style={{width: '100%'}}>
                            <Card style={padding(18)}>
                                <Grid
                                    container
                                    direction="column">
                                    <Grid item style={{width: '100%'}}>
                                        <div style={{
                                            textAlign: "start",
                                            fontSize: 22,
                                            marginBottom: 3
                                        }}>
                                            Adressen
                                        </div>
                                    </Grid>
                                    <Grid item style={{width: '100%'}}>
                                        <Grid
                                            container
                                            direction={"row"}
                                            spacing={2}
                                            justify="space-between">
                                            <Grid item style={{width: '80%'}}>
                                                <TextField style={{width: '100%'}}
                                                           label="Straße" variant="outlined"
                                                           margin={"normal"}/>
                                            </Grid>
                                            <Grid item style={{width: '20%'}}>
                                                <TextField style={{width: '100%'}} label="Nr."
                                                           variant="outlined"
                                                           margin={"normal"}/>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item style={{width: '100%'}}>
                                        <Grid
                                            container
                                            direction={"row"}
                                            spacing={2}
                                            justify="space-between">
                                            <Grid item style={{width: '20%'}}>
                                                <TextField style={{width: '100%'}} label="PLZ"
                                                           variant="outlined"
                                                           margin={"normal"}/>
                                            </Grid>
                                            <Grid item style={{width: '80%'}}>
                                                <TextField style={{width: '100%'}} label="Ort"
                                                           variant="outlined"
                                                           margin={"normal"}/>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Card>
                        </Grid>
                        <Grid item style={{width: '100%'}}>
                            <Grid
                                container
                                justify="flex-end"
                                spacing={1}
                                direction="row">
                                <Grid item>
                                    <Button>Abbrechen</Button>
                                </Grid>
                                <Grid item>
                                    <Button variant="contained"
                                            ref={ref => saveButton = ref}
                                            disabled={this.getButtonState()}
                                            onClick={event => {
                                                debugger
                                                console.log(propState)
                                            }}
                                            color="primary">Speichern</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
                {/*        </div>*/}
                {/*    </MuiThemeProvider>*/}
            </div>;
        } else {
            return (
                <div>Nicht Angemeldet</div>
            );
        }
    }

    handleClick() {
        var apiBaseUrl = "http://localhost:8080/user";
        const {history} = this.props;

        var payload = {
            //"email":propState.email,
            "username": propState.username,
            "password": propState.password,
            "firstname": propState.firstName,
            "lastname": propState.lastName,
        };

        if (this.passwordMatch) {
            axios.post(apiBaseUrl, payload)
                .then(function (response) {
                    console.log(response);
                    if (response.status === 200) {
                        console.log("Register successfull");
                        console.log(response.data);
                        localStorage.setItem('User', JSON.stringify(response.data));
                        localStorage.setItem('isLoggedIn', '1');
                        history.push("/");
                    } else {
                        console.log("register failed");
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }

    handleChange = event => this.setState({title: event.target.value.trim()});

    handlePasswordChange = name => event => {
        let currentPasswordChange = event.target.value;
        this.setState({password: currentPasswordChange});
        this.passwordState = {...this.passwordState, [name]: currentPasswordChange};
        this.passwordError = this.passwordState.password !== this.passwordState.passwordRepeat;
    };

    getButtonState() {
        return !(
            this.state.title &&
            this.state.firstName &&
            this.state.lastName &&
            this.state.birthday &&
            this.state.userName &&
            this.state.email &&
            !this.emailError &&
            this.state.password &&
            !this.passwordError
        );
    }

    checkEmail() {
        return this.emailError = !(this.state.email.length === 0 || this.emailRegEx.test(this.state.email));
    }
}

function ValidatedPasswordPair() {
    const [values, setValues] = useState({password: "", passwordRepeat: ""});
    const [error, setError] = useState(false);
    const [helper, setHelper] = useState("");

    const handleChange = name => event => {
        let tempValues = {...values, [name]: propState.password = event.target.value};
        setValues(tempValues);
        let tempError = tempValues.password !== tempValues.passwordRepeat;
        setError(tempError);
        setHelper(tempError ? "Die Passwörter müssen übereinstimmen" : "");
    };

    return (
        <div>
            <Grid item>
                <TextField type="password"
                           label="Passwort"
                           variant="outlined"
                           margin={"normal"}
                           onChange={handleChange("password")}
                           style={{width: '100%'}}/>
            </Grid>
            < Grid
                item>
                < TextField type="password"
                            label="Passwort Wiederholen"
                            variant="outlined"
                            margin={"normal"}
                            helperText={helper}
                            error={error}
                            onChange={handleChange("passwordRepeat")}
                            style={{width: '100%'}}
                />
            </Grid>
        </div>
    )
}

function padding_extend(obj, a, b, c, d) {
    debugger
    return {
        ...obj,
        paddingTop: a,
        paddingRight: b ? b : a,
        paddingBottom: c ? c : a,
        paddingLeft: d ? d : (b ? b : a)
    }
}

function padding(a, b, c, d) {
    return {
        paddingTop: a,
        paddingRight: b ? b : a,
        paddingBottom: c ? c : a,
        paddingLeft: d ? d : (b ? b : a)
    }
}

function TitleSelection() {
    const [title, setTitle] = useState('none');
    const handleChange = event => {
        setTitle(propState.title = event.target.value.trim());
        debugger
        applyButtonState(this);
    };

    return (
        <TextField
            style={{width: '100%'}}
            id="test2"
            margin={"normal"}
            select
            label="Anrede"
            value={title}
            helperText="Eine gewünschte Anrede auswählen"
            variant="outlined"
            onChange={handleChange.bind(this)}
        >
            {titles.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                </MenuItem>
            ))}
        </TextField>
    )
}

const titles = [
    {
        value: 'none',
        label: 'Nicht Ausgewählt',
    },
    {
        value: 'Herr',
        label: 'Herr',
    },
    {
        value: 'Frau',
        label: 'Frau',
    }
];


function applyButtonState(context) {
    buttonEnabled = propState.firstName && propState.lastName && propState.title;
    debugger
    console.log(this.name);
    if (saveButton)
        console.log(saveButton.forceUpdate);
    // if (context)
    //     context.setState({})
}

export default Register;