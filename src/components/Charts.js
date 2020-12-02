import React, {Component} from 'react';
import {NavigationComponent} from "../Utilities/Utilities";
import Grid from "@material-ui/core/Grid";
import {
    Card,
    Button,
} from '@material-ui/core';
import MenuDrawer from "./MenuDrawer";
import 'react-toastify/dist/ReactToastify.css';
import {padding} from "../Utilities/Utilities";
import {
    getSessionUser, isUserLoggedIn
} from "../services/StorageUtil";
import Typography from "@material-ui/core/Typography";
import { Chart } from 'react-charts'
import {alignCenter} from "../Utilities/TsUtilities";


class Charts extends Component {

    user = {};

    constructor(props) {
        super(props);
        this.state = {
           test: 0
        };

    }
    componentDidMount() {
    }
    componentWillUnmount() {

    }

    render() {
        const data = [
                {
                    label: 'Series 1',
                    data: [[0, 1], [1, 2], [2, 4], [3, 2], [4, 7]]
                },
                {
                    label: 'Series 2',
                    data: [[0, 3], [1, 1], [2, 5], [3, 6], [4, 4]]
                }
            ]

        const axes = [
                { primary: true, type: 'linear', position: 'bottom' },
                { type: 'linear', position: 'left' }
            ]

        if (isUserLoggedIn()) {

            return this.state.redirect
                ? <NavigationComponent to={"/"}/>
                : <MenuDrawer>
                    <div style={{
                        marginTop: 8,
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <Grid container
                              style={{width: '85%', maxWidth: "800px"}}
                              spacing={3}>
                            <Grid item xs={12}>
                                <Card style={padding(18)}>
                                    <Grid
                                        container
                                        style={alignCenter(true)}
                                        direction="column">
                                        <Grid item fullWidth>
                                            <Typography> Verkäufe pro Monat </Typography>
                                            <br/>
                                            <div
                                                style={{
                                                    width: '750px',
                                                    height: '300px'
                                                }}
                                            >
                                                <Chart data={data} axes={axes} tooltip primaryCursor
                                                       secondaryCursor/>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </Card>
                            </Grid>
                            <Grid item xs={12}>
                                <Card style={padding(18)}>
                                    <Grid
                                        container
                                        style={alignCenter(true)}
                                        direction="column">
                                        <Grid item fullWidth>
                                            <Typography> Verkäufe pro Tag </Typography>
                                            <br/>
                                            <div
                                                style={{
                                                    width: '750px',
                                                    height: '300px'
                                                }}
                                            >
                                                <Chart data={data} series={{
                                                    type: 'bar'
                                                }} axes={axes} tooltip />

                                            </div>
                                        </Grid>
                                    </Grid>
                                </Card>
                            </Grid>
                            <Grid item>
                                <div style={{marginBottom: 8}}/>
                            </Grid>
                        </Grid>
                    </div>
                </MenuDrawer>

        } else {
            return <NavigationComponent to={"/login"}/>;
        }
    }
    handleChange = event => this.setState({title: event.target.value.trim()});

}

export default Charts;