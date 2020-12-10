import React, {Component, useState} from 'react';
import {isMobile, NavigationComponent, titles} from "../Utilities/Utilities";
import Grid from "@material-ui/core/Grid";
import {
    Card,
    TextField,
    MenuItem,
    Button,
    FormControl,
    InputLabel,
    OutlinedInput,
    InputAdornment,
    IconButton,
    FormHelperText,
} from '@material-ui/core';
import MenuDrawer from "./MenuDrawer";
import {Visibility, VisibilityOff, Edit, Save, ExitToApp, Delete} from "@material-ui/icons";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {deleteUser, logoutUser, updateUser} from "../services/UserApiUtil";
import {padding, showToast, shallowEqual, isEmail} from "../Utilities/Utilities";
import {
    getDrawerState,
    getSessionUser, isUserLoggedIn
} from "../services/StorageUtil";
import {useHistory} from "react-router-dom";
import Login from "./Login";
import {DialogBuilder} from "../Utilities/DialogBuilder";
import {Pair, Triple} from "../Utilities/TsUtilities";

class Profile extends Component {
    showPassword = false;
    passwordError = false;
    passwordState = {password: "", passwordRepeat: ""};
    emailError = false;
    user = {};
    unchangedState;
    editMode = false;
    currentEdiModeToastId = 0;
    scrollHelper = Triple.make(this.editMode, 0, undefined);

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
        // eslint-disable-next-line no-cond-assign
        if (this.user = getSessionUser()) {
            this.user.birth = this.user.birth.split("T")[0];
            this.state = this.unchangedState = {...this.state, ...this.user};
            this.passwordState = {password: this.user.password, passwordRepeat: this.user.password};
        }
        window.scrollTo(0,0);
    }

    render() {
        if (isUserLoggedIn()) {
            return (
                <MenuDrawer>
                    <div style={{
                        marginTop: 8,
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <Grid container
                              style={{width: isMobile() ? '100%' : '85%', maxWidth: "800px"}}
                              spacing={3}>
                            <Grid item xs={12}>
                                <Card style={padding(18)}>
                                    <Grid
                                        container
                                        direction="column">
                                        <Grid item fullWidth>
                                            <div style={{
                                                textAlign: "start",
                                                fontSize: 22,
                                                marginBottom: 3
                                            }}>
                                                Personen Daten
                                            </div>
                                        </Grid>
                                        <Grid item>
                                            <TextField
                                                select
                                                margin={"normal"}
                                                fullWidth
                                                label="Anrede"
                                                value={this.state.title}
                                                helperText="Eine gewünschte Anrede auswählen"
                                                variant="outlined"
                                                disabled={!this.editMode}
                                                onChange={this.handleChange}
                                            >
                                                {titles().map((option) => (
                                                    <MenuItem key={option.value}
                                                              value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </TextField>

                                        </Grid>
                                        <Grid item fullWidth>
                                            <Grid
                                                container
                                                spacing={2}>
                                                <Grid item md sm={12} xs={12}>
                                                    <TextField required
                                                               fullWidth
                                                               label="Vorname"
                                                               variant="outlined"
                                                               onChange={event => this.changeStateItem("firstName", event)}
                                                               value={this.state.firstName}
                                                               disabled={!this.editMode}
                                                               margin={"normal"}/>
                                                </Grid>
                                                <Grid item md sm={12} xs={12}>
                                                    <TextField required
                                                               fullWidth
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
                                              fullWidth>
                                            <TextField required
                                                       label="Geburtsdatum"
                                                       type="date"
                                                       variant="outlined"
                                                       margin={"normal"}
                                                       fullWidth
                                                       value={this.state.birth}
                                                       disabled={!this.editMode}
                                                       onChange={event => this.changeStateItem("birth", event)}
                                            />
                                        </Grid>
                                    </Grid>
                                </Card>
                            </Grid>
                            <Grid item xs={12}>
                                <Card style={padding(18)}>
                                    <Grid
                                        container
                                        direction="column">
                                        <Grid item fullWidth>
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
                                                       fullWidth/>
                                        </Grid>
                                        < Grid item>
                                            <FormControl margin={"normal"}
                                                         fullWidth
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
                                                                onClick={() => {
                                                                    this.showPassword = !this.showPassword;
                                                                    this.forceUpdate()
                                                                }}
                                                                onMouseDown={(event) => {
                                                                    event.preventDefault();
                                                                }}
                                                                edge="end">
                                                                {this.showPassword ?
                                                                    <VisibilityOff/> :
                                                                    <Visibility/>}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                    labelWidth={78}
                                                />
                                            </FormControl>
                                        </Grid>
                                        {this.editMode && < Grid item>
                                            <FormControl margin={"normal"}
                                                         fullWidth
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
                                                                onClick={() => {
                                                                    this.showPassword = !this.showPassword;
                                                                    this.forceUpdate()
                                                                }}
                                                                onMouseDown={(event) => {
                                                                    event.preventDefault();
                                                                }}
                                                                edge="end">
                                                                {this.showPassword ?
                                                                    <VisibilityOff/> :
                                                                    <Visibility/>}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                    labelWidth={175}
                                                />
                                                <FormHelperText
                                                    error={this.passwordError}> {this.passwordError ? "Die Passwörter müssen übereinstimmen" : ""}</FormHelperText>
                                            </FormControl>
                                        </Grid>}

                                    </Grid>
                                </Card>
                            </Grid>
                            <Grid item xs={12}>
                                <Card style={padding(18)}>
                                    <Grid
                                        container
                                        direction="column">
                                        <Grid item fullWidth>
                                            <div style={{
                                                textAlign: "start",
                                                fontSize: 22,
                                                marginBottom: 3
                                            }}>
                                                Adressen
                                            </div>
                                        </Grid>
                                        <Grid item fullWidth>
                                            <Grid
                                                container
                                                spacing={2}>
                                                <Grid item md={10} sm={12} xs={12}>
                                                    <TextField fullWidth
                                                               label="Straße"
                                                               variant="outlined"
                                                               value={this.state.street}
                                                               disabled={!this.editMode}
                                                               onChange={event => this.setState({street: event.target.value.trim()})}
                                                               margin={"normal"}/>
                                                </Grid>
                                                <Grid item md={2} sm={12} xs={12}>
                                                    <TextField fullWidth
                                                               label="Nr."
                                                               variant="outlined"
                                                               value={this.state.streetNumber}
                                                               disabled={!this.editMode}
                                                               onChange={event => this.setState({streetNumber: event.target.value.trim()})}
                                                               margin={"normal"}/>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item fullWidth>
                                            <Grid
                                                container
                                                spacing={2}>
                                                <Grid item md={3} sm={12} xs={12}>
                                                    <TextField fullWidth
                                                               label="PLZ"
                                                               variant="outlined"
                                                               value={this.state.postalCode}
                                                               disabled={!this.editMode}
                                                               onChange={event => this.setState({postalCode: event.target.value.trim()})}
                                                               margin={"normal"}/>
                                                </Grid>
                                                <Grid item md={9} sm={12} xs={12}>
                                                    <TextField fullWidth
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
                            <Grid item xs={12}>
                                <Grid container ref={element => this.scrollHelper.third = element}
                                      wrap={"wrap-reverse"}
                                      direction="row"
                                      justify="flex-end"
                                      spacing={3}>
                                    <Grid item>
                                        <DeleteAccountButton/>
                                    </Grid>
                                    <Grid item xs>
                                        <ModeButtons context={this}/>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <div style={{marginBottom: 8}}/>
                            </Grid>
                            {/*<LogoutAccountButton context={this}/>*/}
                        </Grid>
                    </div>
                </MenuDrawer>
            )
        } else {
            return <NavigationComponent to={"/login"}/>;
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.scrollHelper.first !== this.editMode) {
            this.scrollHelper.first = this.editMode;
            if (this.scrollHelper.third)
                window.scrollBy(0, this.scrollHelper.third.getBoundingClientRect().top - this.scrollHelper.second)
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
        this.scrollHelper.second = this.scrollHelper.third.getBoundingClientRect().top;
        if (!notForce)
            this.forceUpdate()
    }
}

function DeleteAccountButton() {
    const history = useHistory();
    const [open, setOpen] = useState(false);

    return (
        <div>
            <Button variant="contained"
                    onClick={() => setOpen(true)}
                    endIcon={<Delete/>}
                    color="secondary">Account Löschen</Button>
            {new DialogBuilder(open, setOpen)
                .setTitle("Account Löschen")
                .setText("Möchten sie wirklich den Account unwiederruflich löschen?")
                .addButton("Abbrechen")
                .addButton({
                    label: "Löschen",
                    color: "secondary",
                    dismissOnClick: false,
                    onClick: dialogBuilder => {
                        deleteUser(() => {
                            showToast("Löschen Erfolgreich", "success")
                            dialogBuilder.dismiss()
                            history.push("/");
                        }, () => {
                            showToast('Benutzer Löschen Fehlgeschlagen', "error")
                        });
                    },
                    icon: <Delete/>,
                    iconAtStart: true,
                    isActionButton: true
                })
                .build()}
        </div>
    )
}

function LogoutAccountButton() {
    const history = useHistory();

    return (
        <Grid item xs>
            <Grid
                container
                justify="flex-end"
                spacing={1}
                direction="row">
                <Grid item>
                    <Button endIcon={<ExitToApp/>}
                            variant="contained"
                            onClick={() => {
                                logoutUser(() => {
                                    showToast("Abmeldung Erfolgreich", "success")
                                    history.push("/");
                                }, () => {
                                    showToast('Abmelden Fehlgeschlagen', "error")
                                });
                            }}>Abmelden</Button>
                </Grid>
            </Grid>
        </Grid>

    )
}

function ModeButtons(props) {
    let that = props.context;
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

    if (that.editMode) {
        return (
            <Grid
                container
                wrap={"wrap-reverse"}
                justify="flex-end"
                spacing={1}
                direction="row">
                <Grid item>
                    <Button onClick={() => {
                        if (!shallowEqual(that.state, that.unchangedState))
                            setCancelDialogOpen(true);
                        else
                            that.toggleEditMode();
                    }}>Abbrechen</Button>
                    {new DialogBuilder(cancelDialogOpen, setCancelDialogOpen)
                        .setTitle("Änderungen Verwerfen?")
                        .setText("Sollen alle ungespeicherten Änderungen verworfen werden?")
                        .addButton("Nein")
                        .addButton({
                            label: "Ja", color: "primary", onClick: dialogBuilder => {
                                that.passwordState = {
                                    password: that.unchangedState.password,
                                    passwordRepeat: that.unchangedState.password
                                };
                                that.passwordError = false;
                                that.setState(that.unchangedState);
                                that.toggleEditMode(true);
                            }
                        })
                        .build()}
                </Grid>
                <Grid item>
                    <Button variant="contained"
                            disabled={that.getButtonState()}
                            onClick={() => {
                                console.log(that.state);
                                if (shallowEqual(that.unchangedState, that.state)) {
                                    showToast('Es wurden keine Änderungen vorgenommen', "info");
                                    that.toggleEditMode();
                                } else {
                                    let payload = {
                                        ...that.state,
                                        birth: (that.state.birth + "T00:00:00Z[UTC]")
                                    };
                                    updateUser(payload, response => {
                                        console.log(response);
                                        that.unchangedState = that.state;
                                        showToast('Die Daten wurden gespeichert', "success");
                                        that.toggleEditMode();
                                    }, error => {
                                        console.log(error);
                                        showToast("Beim Speichern ist ein Fehler aufgetreten:\n" + error.message, "error");
                                    })
                                }
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
                direction="row">
                <Grid item/>
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => that.toggleEditMode()}
                        endIcon={<Edit/>}>
                        Bearbeiten
                    </Button>
                </Grid>
            </Grid>
        )
    }
}

export default Profile;