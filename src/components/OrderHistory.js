import React, {Component} from 'react';
import {hexToRgbA, NavigationComponent, showToast} from "../Utilities/Utilities";
import Grid from "@material-ui/core/Grid";
import {
    Card,
    Button,
} from '@material-ui/core';
import MenuDrawer from "./MenuDrawer";
import 'react-toastify/dist/ReactToastify.css';
import {padding} from "../Utilities/Utilities";
import {
    getSessionUser, isUserLoggedIn, setSessionUser, setUserLoggedIn
} from "../services/StorageUtil";
import HorizontalLabelPositionBelowStepper from "./Stepper";
import {useHistory} from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import {
    clearShoppingCart,
    getShoppingCartCount,
    getShoppingCartObject,
    getShoppingCartPrice,
    ShoppingCartList
} from "../services/ShoppingCartUtil";
import {placeOrder} from "../services/OrderApiUtil";
import axios from "axios";


class OrderHistory extends Component {
    orderhistory = []
    user = {};
    shoppingcart = {}
    totalpricewithoutshipping = 0;
    totalitemcount = 0;

    constructor(props) {
        super(props);
        this.loadHistory()
        this.state = {
        };
    }

    loadHistory() {
        let orderhistory = [];
        axios.get(`http://${window.location.hostname}:8080/order`, {
            auth: {
                username: "admin@admin.de",
                password: "Test1234"
            }
        })
            .then(function (response) {
                let historyarray = []
                if (response.status === 200) {
                    Object.keys(response.data).map((order) => {
                        historyarray.push(order);
                    });
                } else {
                    showToast("fetch failed", "error");
                }
            })
            .catch(function (error) {
                showToast("fetch failed: " + error.message, "error");
            });
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
                            test
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

}
function OrderComponent(props){

    return(
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
                            Bestellung vom asd
                        </div>
                    </Grid>
                    <Grid item>
                        <Typography> </Typography>
                        <Typography>Vorkasse</Typography>
                    </Grid>
                </Grid>
            </Card>
        </Grid>
    )
}

export default OrderHistory;