import React, {Component} from 'react';
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
import {Visibility, VisibilityOff, Edit, Save, ExitToApp, Delete} from "@material-ui/icons";
import {ToastContainer, toast, Flip} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {deleteUser, logoutUser, updateUser} from "../services/UserApiUtil";
import {padding, showToast, shallowEqual, isEmail} from "../services/Utilities";
import {getSessionUser, setSessionUser} from "../services/StorageUtil";
import {useHistory} from "react-router-dom";

class Profile extends Component {
    showPassword = false;
    passwordError = false;
    passwordState = {password: "", passwordRepeat: ""};
    emailError = false;
    user = {};
    unchangedState;
    editMode = false;
    currentEdiModeToastId = 0;
    mobileView = window.innerWidth < 950;

    constructor(props) {
        super(props);
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
        this.user = getSessionUser();
        this.user.birth = this.user.birth.split("T")[0];
        this.state = this.unchangedState = {...this.state, ...this.user};
        this.passwordState = {password: this.user.password, passwordRepeat: this.user.password};
        // ToDo: pstalCode und StreetNumber sollten nicht 0 sein
        //  & userrolle wird bei createUser nicht gesetzt
        //  & loginKriterrien sind nicht erfüllt
        //  & Drawer Content richtig sizen
        window.addEventListener('resize', ev => {
            let newState = window.innerWidth < 950;
            if (this.mobileView !== newState) {
                this.mobileView = newState;
                // console.log(this.mobileView + " " + window.innerWidth);
                this.forceUpdate();
            }
        })
    }

    render() {
        // this.showToast("render")
        if (localStorage.getItem('isLoggedIn')) {
            return <div>
                <MuiThemeProvider>
                    <div>
                        <MenuDrawer/>
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
                                                        <MenuItem key={option.value}
                                                                  value={option.value}>
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
                                                                   label="Vorname"
                                                                   variant="outlined"
                                                                   onChange={event => this.changeStateItem("firstName", event)}
                                                                   value={this.state.firstName}
                                                                   disabled={!this.editMode}
                                                                   margin={"normal"}/>
                                                    </Grid>
                                                    <Grid item
                                                          style={{width: this.mobileView ? "100%" : '50%'}}>
                                                        <TextField required
                                                                   style={{width: '100%'}}
                                                                   label="Nachname"
                                                                   variant="outlined"
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
                                                <FormControl margin={"normal"}
                                                             style={{width: '100%'}}
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
                                                                    {this.showPassword ?
                                                                        <Visibility/> :
                                                                        <VisibilityOff/>}
                                                                </IconButton>
                                                            </InputAdornment>
                                                        }
                                                        labelWidth={78}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            < Grid item>
                                                <FormControl margin={"normal"}
                                                             style={{width: '100%'}}
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
                                                                    {this.showPassword ?
                                                                        <Visibility/> :
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
                                    <Grid container
                                          direction="row"
                                          justify="space-between"
                                          alignItems="center"
                                          spacing={3}>
                                        <Grid item >
                                            <LogoutAccountButton/>
                                        </Grid>
                                        <Grid item >
                                            <ModeButtons context={this}/>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <DeleteAccountButton context={this}/>
                            </Grid>
                        </Container>
                    </div>
                </MuiThemeProvider>
            </div>;
        } else {
            return (
                <div>Nicht Angemeldet</div>
            );
        }
    }

    // ---------------

    changeStateItem(key, eventOrText) {
        if (this.editMode)
            this.setState({[key]: (eventOrText instanceof String ? eventOrText : eventOrText.target.value.trim())});
        else {
            if (!toast.isActive(this.currentEdiModeToastId))
                this.currentEdiModeToastId = this.showToast('Zum Editieren in den BearbeitenModus wechseln', "warn", {toastId: ++this.currentEdiModeToastId});
            else
                toast.update(this.currentEdiModeToastId, {autoClose: 2500});
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
        return this.emailError = !(this.state.email.length === 0 || isEmail(this.state.email));
    }

    toggleEditMode(notForce) {
        this.editMode = !this.editMode;
        if (!notForce)
            this.forceUpdate()
    }
}

function LogoutAccountButton(props) {
    const history = useHistory();

    return (
        <Button endIcon={<ExitToApp/>}
                variant="contained"
                onClick={event => {
                    logoutUser(() => {
                        showToast("Abmeldung Erfolgreich", "success")
                        history.push("/");
                    }, () => {
                        showToast('Abmelden Fehlgeschlagen', "error")
                    });
                }}>Abmelden</Button>
    )
}

function DeleteAccountButton(props) {
    const history = useHistory();

    return (
        <Grid item style={{width: '100%'}}>
            <Grid
                container
                justify="flex-end"
                spacing={1}
                direction="row">
                <Grid item>
                    <Button variant="contained"
                            onClick={event => {
                                deleteUser(() => {
                                    showToast("Löschen Erfolgreich", "success")
                                    history.push("/");
                                }, () => {
                                    showToast('Benutzer Löschen Fehlgeschlagen', "error")
                                });
                            }}
                            endIcon={<Delete/>}
                            color="secondary">Account Löschen</Button>
                </Grid>
            </Grid>
        </Grid>

    )
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
                            disabled={that.getButtonState()}
                            onClick={event => {
                                console.log(that.state);
                                if (shallowEqual(that.unchangedState, that.state)) {
                                    showToast('Es wurden keine Änderungen vorgenommen', "info");
                                } else {
                                    let payload = {
                                        ...that.state,
                                        birth: (that.unchangedState.birth + "T00:00:00Z[UTC]")
                                    };
                                    debugger
                                    updateUser(payload, response => {
                                        console.log(response);
                                        that.unchangedState = that.state;
                                        debugger
                                        showToast('Die Daten wurden gespeichert', "success");
                                        setSessionUser(response.data);
                                    }, error => {
                                        console.log(error);
                                        showToast("Beim Speichern ist ein Fehler aufgetreten:\n" + error.message, "error");
                                        debugger
                                    })
                                }
                                that.toggleEditMode();
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

export default Profile;