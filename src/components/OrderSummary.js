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


class OrderSummary extends Component {

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
                    <HorizontalLabelPositionBelowStepper index={2}/>
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
                                                Anschrift
                                            </div>
                                        </Grid>
                                        <Grid item>
                                            <Typography> </Typography>
                                            <Typography>{this.state.user.title.charAt(0).toUpperCase()}{this.state.user.title.slice(1).toLowerCase()} {this.state.user.firstName} {this.state.user.lastName}</Typography>
                                            <Typography>{this.state.user.street} {this.state.user.streetNumber}</Typography>
                                            <Typography>{this.state.user.postalCode} {this.state.user.town}</Typography>
                                        </Grid>
                                    </Grid>
                                </Card>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container
                                      wrap={"wrap-reverse"}
                                      direction="row"
                                      justify="space-between"
                                      spacing={3}>
                                    <Grid item>
                                        <BackButton context={this}/>
                                    </Grid>
                                    <Grid item>
                                        <ContinueButton context={this}/>
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
    handleChange = event => this.setState({title: event.target.value.trim()});

}
function BackButton(){
    const history = useHistory();
    let backToShoppingCart = () => {
        history.push("/payment")
    };

    return (
        <Button
            variant="contained"
            color="secondary"
            onClick={() => {
                backToShoppingCart()
            }
            }>
            Zurück
        </Button>
    )
}
function ContinueButton(){
    const history = useHistory();
    let continueToSummary = () => {
        history.push("/genres")
    };

    return (
        <Button
            style={{backgroundColor: "green"}}
            variant="contained"
            color="primary"
            onClick={() => {
                continueToSummary()
            }
            }>
            Bestellung aufgeben
        </Button>
    )
}

export default OrderSummary;