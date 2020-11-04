import React from 'react'
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import RaisedButton from 'material-ui/RaisedButton';
import {Grid, Card, TextField, Button, Typography, hexToRgb, IconButton} from "@material-ui/core";
import {
    padding,
    showToast,
    shallowEqual,
    isEmail,
    addAlphaToHexColor,
    hexToRgbA,
} from "../services/Utilities";
import MenuDrawer from "./MenuDrawer";
import Box from "@material-ui/core/Box";
import {Visibility, VisibilityOff} from "@material-ui/icons";
import {addDrawerCallback, isDrawerVisible, removeDrawerCallback} from "../services/StorageUtil";

class Dev extends React.Component {

    buttonColors = {
        "GET": "#61affe",
        "PUT": "#fca130",
        "POST": "#49cc90",
        "DELETE": "#f93e3e"
    };

    drawerState = isDrawerVisible();

    drawerCallback = state => {
        this.drawerState = state;
        this.forceUpdate()
    };

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
        };
        addDrawerCallback(this.drawerCallback)
    }


    render() {
        return (
            <div>
                <MenuDrawer/>
                <div style={{
                    marginTop: 8,
                    marginInlineStart: (this.drawerState ? 240 : 0),
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <Grid container
                          style={{width: '85%', maxWidth: "800px"}}
                          spacing={5}>
                        {this.generateComponents()}
                    </Grid>
                </div>
            </div>
        )
    }

    componentWillUnmount() {removeDrawerCallback(this.drawerCallback)}

    // ---------------

    generateComponents() {
        return (

            this.allComponents.map(category => {
                return (
                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            <Grid item>
                                <Typography component="h1" variant="h10" align={"left"}>
                                    {category.title}
                                </Typography>
                            </Grid>
                            <Grid item alignContent={"center"} justify="center">
                                <Box display="flex"
                                     alignItems="flex-end"
                                     style={{height: "100%"}}>
                                    <Box>
                                        <Typography component="h1" variant="h6">
                                            {category.description}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} style={{marginTop: 5}}
                              direction="column">
                            {this.generateContent(category)}
                        </Grid>
                    </Grid>
                )
            })
        )
    }

    generateContent(category) {
        return (
            category.content.map(call => {
                var key = category.title + "/" + call.name;
                if (!this.callResultMap[key])
                    this.callResultMap[key] = {
                        result: "",
                        completeResponse: "",
                        showCompleteResponse: false
                    };
                const currentCallResponse = this.callResultMap[key]
                return (
                    <Grid item>
                        <Card style={{
                            ...padding(18),
                            backgroundColor: hexToRgbA((this.buttonColors[call.type]), 0.2)
                        }} fullWidth>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Grid container
                                          style={{maxHeight: 52}}
                                          alignContent={"center"}
                                          alignItems={"center"}
                                          justify={"center"}
                                          spacing={2}>
                                        <Grid item>
                                            <Button style={{
                                                backgroundColor: (this.buttonColors[call.type]),
                                                fontWeight: "bold",
                                                color: "#FFFFFF"
                                            }} onClick={(event) => {
                                                this.callResultMap[key] = {
                                                    result: "Wird geladen...",
                                                    completeResponse: "",
                                                    showCompleteResponse: false
                                                };
                                                this.forceUpdate();
                                                call.callback((result, completeResponse) => {
                                                    if (result !== undefined) {
                                                        this.callResultMap[key] = {
                                                            result: result,
                                                            completeResponse: completeResponse,
                                                            showCompleteResponse: false
                                                        };
                                                        showToast("Anfrage Erfolgreich", "success");
                                                    } else {
                                                        showToast("Ein Fehler ist aufgetreten" + (completeResponse ? ": " + completeResponse : ""), "error");
                                                        this.callResultMap[key] = {
                                                            result: result,
                                                            completeResponse: completeResponse,
                                                            showCompleteResponse: false
                                                        };
                                                    }
                                                    this.forceUpdate();
                                                });
                                            }}>
                                                {call.type}
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <Typography component="h1" variant="h6" allign="left">
                                                {call.name}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs>
                                            <Typography
                                                style={currentCallResponse.result === undefined ? {color: "red"} : {}}
                                                component="h1" variant="h6" align={"right"}>
                                                {currentCallResponse.result !== undefined ? currentCallResponse.result : "Error"}
                                            </Typography>
                                        </Grid>
                                        {this.showCompleteResultButton(currentCallResponse)}
                                    </Grid>
                                </Grid>
                                {this.showCompleteResult(currentCallResponse)}
                            </Grid>
                        </Card>
                    </Grid>
                )
            })
        )
    }

    showCompleteResultButton(object) {
        if (object.completeResponse) {
            return (
                <Grid item>
                    <IconButton
                        onClick={event => {
                            object.showCompleteResponse = (!object.showCompleteResponse);
                            this.forceUpdate()
                        }}
                        onMouseDown={(event) => {
                            event.preventDefault();
                        }}>
                        {object.showCompleteResponse ?
                            <VisibilityOff/> :
                            <Visibility/>}
                    </IconButton>
                </Grid>

            )
        }
    }

    showCompleteResult(object) {
        if (object.showCompleteResponse && object.completeResponse) {
            return (
                <Grid item xs={12}>
                    <Typography align={"left"} style={{whiteSpace: 'pre-wrap', marginTop: 5}}>
                        {object.completeResponse}
                    </Typography>
                </Grid>
            )
        }
    }

    apiTestData(resultCallback, endpoint, label) {
        fetch(new Request("http://localhost:8080/test/" + endpoint, {method: 'GET'}))
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error('Fehler bei der Anfrage: ' + response.status + " " + response.statusText);
                }
            })
            .then(response => {
                resultCallback("Es sind " + response.length + " " + label + " initialisiert", JSON.stringify(response, null, 2));
            })
            .catch(reason => {
                resultCallback(undefined, reason.message);
            })
    }

    callResultMap = {};

    allComponents = [
        {
            title: "test",
            description: "test Api - provides basic test Functions and example Data",
            content: [
                {
                    type: "GET",
                    name: "/userTestData",
                    description: "provides basic test Functions and example Data",
                    callback: func => this.apiTestData(func, "userTestData", "Benutzer")
                },
                {
                    type: "GET",
                    name: "/articleTestData",
                    description: "provides basic test Functions and example Data",
                    callback: func => this.apiTestData(func, "articleTestData", "Artikel")
                }
            ]
        },
        {
            title: "Beispiele",
            description: "Beispiel Api Calls",
            content: [
                {
                    type: "DELETE",
                    name: "/errorExampleWithMessage",
                    description: "provides basic test Functions and example Data",
                    callback: func => func(undefined, "Es ist ein Fehler aufgetreten: 1234 AAAAAHH!")
                },
                {
                    type: "POST",
                    name: "/errorExample",
                    description: "provides basic test Functions and example Data",
                    callback: func => func(undefined, undefined)
                }
            ]
        }
    ]

}

/*function getColor(name){
return buttonColors[name];
}*/

export default Dev;
