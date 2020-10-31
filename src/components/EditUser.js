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
    FormHelperText,
    Icon, fade
} from '@material-ui/core';
import MenuDrawer from "./MenuDrawer";
import {Visibility, VisibilityOff, Edit, Save} from "@material-ui/icons";
import {ToastContainer, toast, Flip} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const propState = {
    title: '',
    firstName: '',
    lastName: '',
    birth: '',
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
    user = {};
    unchangedState;
    editMode = false;
    currentEdiModeToastId = 0;
    mobileView = window.innerWidth < 950;

    constructor(props, context) {
        super(props, context);
        this.state = {
            id: -1,
            title: 'none',
            firstName: '',
            lastName: '',
            birth: require('dateformat')(new Date(), "yyyy-mm-dd"),
            email: '',
            password: '',
            street: '',
            streetNumber: '',
            postalCode: '',
            town: ''
        };
        this.user = JSON.parse(localStorage.getItem('User'));
        this.user.birth = this.user.birth.split("T")[0];
        this.state = this.unchangedState = {...this.state, ...this.user};
        this.passwordState = {password: this.user.password, passwordRepeat: this.user.password}

        window.addEventListener('resize', ev => {
            let newState = window.innerWidth < 950;
            if (this.mobileView !== newState) {
                this.mobileView = newState;
                console.log(this.mobileView + " " + window.innerWidth);
                this.forceUpdate();
            }
        })
    }

    render() {
        // this.showToast("render")
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
                                            disabled={!this.editMode}
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
                                            direction={this.mobileView ? "column" : "row"}
                                            justify="space-between"
                                            wrap={'wrap'}
                                            spacing={2}>
                                            <Grid item
                                                  style={{width: this.mobileView ? "100%" : '50%'}}>
                                                <TextField required
                                                           style={{width: '100%'}}
                                                           label="Vorname" variant="outlined"
                                                           onChange={event => this.changeStateItem("firstName", event)}
                                                           value={this.state.firstName}
                                                           disabled={!this.editMode}
                                                           margin={"normal"}/>
                                            </Grid>
                                            <Grid item
                                                  style={{width: this.mobileView ? "100%" : '50%'}}>
                                                <TextField required
                                                           style={{width: '100%'}}
                                                           label="Nachname" variant="outlined"
                                                           onChange={event => this.changeStateItem("lastName", event)}
                                                           value={this.state.lastName}
                                                           disabled={!this.editMode}
                                                           margin={"normal"}/>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item
                                          style={{width: '100%'}}>
                                        <TextField required
                                                   label="Geburtsdatum"
                                                   type="date"
                                                   variant="outlined"
                                                   margin={"normal"}
                                                   style={{width: '100%'}}
                                                   value={this.state.birth}
                                            // defaultValue={this.state.birth}
                                                   disabled={!this.editMode}
                                                   onChange={event => this.changeStateItem("birth", event)}
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
                                        <TextField required
                                                   type="email" label="E-MailAdresse"
                                                   variant="outlined" margin={"normal"}
                                                   onChange={event => this.setState({email: event.target.value.trim()})}
                                                   error={this.checkEmail()}
                                                   value={this.state.email}
                                                   disabled={!this.editMode}
                                                   helperText={this.emailError ? "Bitte eine Korrekte E-MailAdresse eingeben" : ""}
                                                   style={{width: '100%'}}/>
                                    </Grid>
                                    < Grid item>
                                        <FormControl margin={"normal"} style={{width: '100%'}}
                                                     variant="outlined">
                                            <InputLabel required>Passwort</InputLabel>
                                            <OutlinedInput
                                                type={this.showPassword ? 'text' : 'password'}
                                                value={this.passwordState.password}
                                                disabled={!this.editMode}
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
                                                labelWidth={78}
                                            />
                                        </FormControl>
                                    </Grid>
                                    < Grid item>
                                        <FormControl margin={"normal"} style={{width: '100%'}}
                                                     variant="outlined">
                                            <InputLabel required error={this.passwordError}>Passwort
                                                Wiederholen</InputLabel>
                                            <OutlinedInput
                                                type={this.showPassword ? 'text' : 'password'}
                                                value={this.passwordState.passwordRepeat}
                                                error={this.passwordError}
                                                disabled={!this.editMode}
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
                                                            {this.showPassword ? <Visibility/> :
                                                                <VisibilityOff/>}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                labelWidth={175}
                                            />
                                            <FormHelperText
                                                error={this.passwordError}> {this.passwordError ? "Die Passwörter müssen übereinstimmen" : ""}</FormHelperText>
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
                                            direction={this.mobileView ? "column" : "row"}
                                            spacing={2}
                                            justify="space-between">
                                            <Grid item
                                                  style={{width: this.mobileView ? "100%" : '80%'}}>
                                                <TextField style={{width: '100%'}}
                                                           label="Straße"
                                                           variant="outlined"
                                                           value={this.state.street}
                                                           disabled={!this.editMode}
                                                           onChange={event => this.setState({street: event.target.value.trim()})}
                                                           margin={"normal"}/>
                                            </Grid>
                                            <Grid item
                                                  style={{width: this.mobileView ? "100%" : '20%'}}>
                                                <TextField style={{width: '100%'}}
                                                           label="Nr."
                                                           variant="outlined"
                                                           value={this.state.streetNumber}
                                                           disabled={!this.editMode}
                                                           onChange={event => this.setState({streetNumber: event.target.value.trim()})}
                                                           margin={"normal"}/>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item style={{width: '100%'}}>
                                        <Grid
                                            container
                                            direction={this.mobileView ? "column" : "row"}
                                            spacing={2}
                                            justify="space-between">
                                            <Grid item
                                                  style={{width: this.mobileView ? "100%" : '20%'}}>
                                                <TextField style={{width: '100%'}}
                                                           label="PLZ"
                                                           variant="outlined"
                                                           value={this.state.postalCode}
                                                           disabled={!this.editMode}
                                                           onChange={event => this.setState({postalCode: event.target.value.trim()})}
                                                           margin={"normal"}/>
                                            </Grid>
                                            <Grid item
                                                  style={{width: this.mobileView ? "100%" : '80%'}}>
                                                <TextField style={{width: '100%'}}
                                                           label="Ort"
                                                           variant="outlined"
                                                           value={this.state.town}
                                                           disabled={!this.editMode}
                                                           onChange={event => this.setState({town: event.target.value.trim()})}
                                                           margin={"normal"}/>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Card>
                        </Grid>
                        <Grid item style={{width: '100%'}}>
                            <ModeButtons context={this}/>
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

    TestBlock() {
        return <div>Test</div>
    }

    changeStateItem(key, eventOrText) {
        if (this.editMode)
            this.setState({[key]: (eventOrText instanceof String ? eventOrText : eventOrText.target.value.trim())});
        else {
            if (!toast.isActive(this.currentEdiModeToastId))
                this.currentEdiModeToastId = this.showToast('Zum Editieren in den BearbeitenModus wechseln', "warn", {toastId: ++this.currentEdiModeToastId});
            else
                toast.update(this.currentEdiModeToastId, {autoClose: 2500});
        }
        // ToDo: Eventuell durch klick auf Toast edit aktivieren
    }

    /**
     * @param {string} text Den anzuzeigenen Text
     * @param {(''|'info'|'success'|'warn'|'error'|'dark')} [type] Leer für 'Default', der eines der folgenden typen: 'info', 'success', 'warn', 'error', 'dark'
     * @param {object} [customOptions] Ein Objekt mit überschriebenen Optionen
     * @param func
     * @returns {number} Gibt die Toast-ID zurück
     */
    showToast(text, type, customOptions, func) {
        let options = {
            position: "bottom-right",
            autoClose: 2500,
            hideProgressBar: true,
            transition: Flip,
            ...customOptions
        };
        if (type)
            return toast[type](text, options);
        else
            return toast(text, options);
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
            this.state.birth &&
            this.state.email &&
            !this.emailError &&
            this.state.password &&
            !this.passwordError
        );
    }

    checkEmail() {
        return this.emailError = !(this.state.email.length === 0 || this.emailRegEx.test(this.state.email));
    }

    toggleEditMode(notForce) {
        this.editMode = !this.editMode;
        if (!notForce)
            this.forceUpdate()
    }
}

function ModeButtons(props) {
    let that = props.context;
    if (that.editMode) {
        return (
            <Grid
                container
                justify="flex-end"
                spacing={1}
                direction="row">
                <Grid item>
                    <Button onClick={event => {
                        if (!shallowEqual(that.state, that.unchangedState)) {
                            if (window.confirm('Alle ungespeicherten Änderungen werden verworfen')) {
                                that.setState(that.unchangedState);
                                that.toggleEditMode(true);
                            }
                        } else
                            that.toggleEditMode();
                    }}>Abbrechen</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained"
                            ref={ref => saveButton = ref}
                            disabled={that.getButtonState()}
                            onClick={event => {
                                console.log(that.state);
                                if (shallowEqual(that.unchangedState, that.state)) {
                                    toast.info('Es wurden keine Änderungen vorgenommen', {
                                        position: "bottom-right",
                                        autoClose: 2500,
                                        hideProgressBar: true,
                                        transition: Flip
                                    });
                                } else {
                                    that.unchangedState = that.state;
                                    toast.success('Die Daten wurden gespeichert', {
                                        position: "bottom-right",
                                        autoClose: 2500,
                                        hideProgressBar: true,
                                        transition: Flip
                                    });
                                }
                                that.toggleEditMode();
                                // toast(<TestButton/>, {
                                //     position: "top-right",
                                //     autoClose: false,
                                //     hideProgressBar: true,
                                //     closeOnClick: false,
                                //     pauseOnHover: true,
                                //     draggable: false,
                                //     progress: undefined,
                                // })
                                //TODO: confirmation mit https://github.com/fkhadra/react-toastify
                                // ToDo: test
                            }}
                            endIcon={<Save/>}
                            color="primary">Speichern</Button>
                </Grid>
            </Grid>
        )
    } else {
        return (
            <Grid
                container
                justify="flex-end"
                spacing={1}
                direction="row">
                <Grid item/>
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={event => that.toggleEditMode()}
                        endIcon={<Edit/>}>
                        Bearbeiten
                    </Button>
                </Grid>
            </Grid>

        )
    }
}

function TestButton() {
    return <button>Nur ein Test</button>
}


const titles = [
    {
        value: 'none',
        label: 'Nicht Ausgewählt',
    },
    {
        value: 'Hr',
        label: 'Herr',
    },
    {
        value: 'Fr',
        label: 'Frau',
    },
    {
        value: 'Prof',
        label: 'Professor',
    },
    {
        value: 'Dr',
        label: 'Doktor',
    },
    {
        value: 'Div',
        label: 'Divers',
    },
];


//  ------------------------- Utilities ------------------------->
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

// ---------------

function shallowEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (let key of keys1) {
        if (object1[key] !== object2[key]) {
            return false;
        }
    }

    return true;
}

function deepEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (const key of keys1) {
        const val1 = object1[key];
        const val2 = object2[key];
        const areObjects = isObject(val1) && isObject(val2);
        if (
            areObjects && !deepEqual(val1, val2) ||
            !areObjects && val1 !== val2
        ) {
            return false;
        }
    }

    return true;
}

function isObject(object) {
    return object != null && typeof object === 'object';
}

//  <------------------------- Utilities -------------------------


export default Register;