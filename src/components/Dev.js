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
import {addDrawerCallback, removeDrawerCallback} from "../services/StorageUtil";

class Dev extends React.Component {

    buttonColors = {
        "GET": "#61affe",
        "PUT": "#fca130",
        "POST": "#49cc90",
        "DELETE": "#f93e3e"
    };
    drawerCallback = state => {
        this.drawerState = state;
        this.forceUpdate()
    };

    constructor(props) {
        super(props);
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
                          spacing={3}>
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
                            {this.generateContent(category.content)}
                        </Grid>
                    </Grid>
                )
            })
        )
    }

    generateContent(content) {
        return (
            content.map(call => {
                if (!this.callResultMap[call.name])
                    this.callResultMap[call.name] = {result: "", completeResponse: "", showCompleteResponse: false};
                return (
                    <Grid item>
                        <Card style={{
                            ...padding(18),
                            backgroundColor: hexToRgbA((this.buttonColors[call.type]), 0.2)
                        }} fullWidth>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Grid container
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
                                                this.callResultMap[call.name] = {
                                                    result: "Wird geladen...",
                                                    completeResponse: "",
                                                    showCompleteResponse: false
                                                };
                                                this.forceUpdate();
                                                call.callback((result, completeResponse) => {
                                                    this.callResultMap[call.name] = {
                                                        result: result,
                                                        completeResponse: completeResponse,
                                                        showCompleteResponse: false
                                                    };
                                                    this.forceUpdate();
                                                    showToast("Anfrage Erfolgreich", "success");
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
                                            <Typography component="h1" variant="h6" align={"right"}>
                                                {this.callResultMap[call.name].result}
                                            </Typography>
                                        </Grid>
                                        {this.showCompleteResultButton(this.callResultMap[call.name])}
                                    </Grid>
                                </Grid>
                                {this.showCompleteResult(this.callResultMap[call.name])}

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
                    <Typography align={"left"} style={{whiteSpace: 'pre-wrap',marginTop: 5}}>
                        {object.completeResponse}
                    </Typography>
                </Grid>
            )
        }
    }

    apiRequestUser(resultCallback) {
        var xmlhttp = new XMLHttpRequest();
        var url = "http://localhost:8080/test/userTestData";

        xmlhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                var myArr = JSON.parse(this.responseText);
                myFunction(myArr, this.responseText);
            }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send();

        function myFunction(arr, response) {
            var out = "";
            var i = arr.length;
            out = "Es sind " + i + " Benutzer initialisiert";
            resultCallback(out, JSON.stringify(JSON.parse(response), null, 2));
            // document.getElementById("id01").innerHTML = out;
        }
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
                    callback: func => this.apiRequestUser(func)
                },
                {
                    type: "POST",
                    name: "/articleTestData",
                    description: "provides basic test Functions and example Data",
                    callback: func => func("articleTestData", "a\nb\na\nb\na\nb\na\nb\na\nb\na\nb\na\nb\na\nb\na\nb\na\nb\n")
                }
            ]
        }
    ]

}

/*function getColor(name){
return buttonColors[name];
}*/

export default Dev;
