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
import HorizontalLabelPositionBelowStepper from "./Stepper";
import {useHistory} from "react-router-dom";
import Typography from "@material-ui/core/Typography";


class OrderComplete extends Component {

    user = {};

    constructor(props) {
        super(props);
        this.state = {
            user: getSessionUser(),
            paymentMethod: -1,
        };

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
                              style={{width: '85%', maxWidth: "800px"}}
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
                                                Vielen Dank für ihre Bestellung!
                                            </div>
                                        </Grid>
                                        <Grid item>
                                            <Typography> </Typography>
                                        </Grid>
                                    </Grid>
                                </Card>
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
    handleChange = event => this.setState({title: event.target.value.trim()});

}

export default OrderComplete;