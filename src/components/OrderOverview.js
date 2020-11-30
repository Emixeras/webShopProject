import Typography from "@material-ui/core/Typography";
import React from "react";
import MenuDrawer from "./MenuDrawer";
import {
    getSessionUser, isUserLoggedIn
} from "../services/StorageUtil";
import {NavigationComponent, padding} from "../Utilities/Utilities";
import Grid from "@material-ui/core/Grid";
import {Card} from "@material-ui/core";
import {Link, useHistory} from "react-router-dom";
import {isShoppingCartEmpty, ShoppingCartList, ShoppingCartObject} from "../services/ShoppingCartUtil";
import axios from "axios";
import {callIfExists, name_comparator} from "../Utilities/TsUtilities";
import Button from "@material-ui/core/Button";

function isOrderHistoryEmpty() {
    return false
}


export default class OrderOverview extends React.Component {
    emptyOrderHistory = {entries: []};
    user = {};
    orders = [];

    constructor(props) {
        super(props);
        this.state = {
            user: getSessionUser(),
        };
        this.loadOrders();
        debugger

    }

    loadOrders() {
        axios.get(`http://${window.location.hostname}:8080/order`, {
            auth: {
                username: this.state.user.email,
                password: this.state.user.password,
            }
        }).then((response) => {
            let orderResponseArray = [];
            let orderResponse = response.data;

            Object.keys(orderResponse).forEach(key => {
                orderResponseArray.push({order: orderResponse[key]});
            });

            orderResponseArray.reverse();
            orderResponseArray.forEach(function (orderElement) {
                let fullPrice = 0;
                orderElement.order.shopOrderEntries.forEach(function (positionElement) {
                    fullPrice = fullPrice + positionElement.quantity * positionElement.shopOrderArticle.price;
                })
                orderElement.fullPrice = fullPrice;
            })
            this.orders = orderResponseArray;
            this.forceUpdate()
            debugger
        })
    }


    render() {
        let isEmpty = isOrderHistoryEmpty();
        if (isUserLoggedIn())
            return (
                <div>
                    <MenuDrawer>
                        <Typography component="h1" variant="h2" align="center"
                                    color="textPrimary"
                                    gutterBottom>
                            Ihre Bestellungen
                        </Typography>
                        <Grid item xs={12}>
                            <div style={{display: 'flex', justifyContent: 'center'}}>
                                <Grid container wrap={"wrap-reverse"} spacing={4}
                                      style={{width: '95%', maxWidth: isEmpty ? "1000px" : "1500px"}}>
                                    <Grid item md={isEmpty ? 12 : 9} sm={12}>
                                        <Grid container style={{width: "100%"}}>
                                            <Grid item xs={12}>
                                                <div style={{marginTop: +isEmpty * 50,}}>
                                                    {isEmpty ?
                                                        <div style={{textAlign: "center"}}>
                                                            <Typography variant="h4" gutterBottom>
                                                                Sie haben noch keine Bestellungen aufgegeben.
                                                            </Typography>
                                                            <Typography variant="h5" gutterBottom>
                                                                Suchen Sie sich doch ein paar Alben
                                                                Ihrer Wahl aus unserem {<Link
                                                                to={"/albums"}>Sortiment</Link>} aus
                                                            </Typography>
                                                        </div>
                                                        :
                                                        <OrderList orderArray={this.orders}></OrderList>
                                                    }
                                                </div>
                                            </Grid>
                                            <Grid item>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </div>
                        </Grid>
                    </MenuDrawer>
                </div>
            )
        else {
            return <NavigationComponent to={"/login"}/>;
        }
    }
}


function OrderList({orderArray}) {
    debugger
    const history = useHistory()
    return (
        <Grid container spacing={2}>
            {orderArray.map((entry) => {
                return (
                    <Grid item xs={12}>
                        <Card style={padding(18)}>
                            <Grid container spacing={2}>
                                <Grid item>
                                    <b>Datum:</b> {entry.order.orderDate}
                                </Grid>
                                <Grid item xs>
                                    <b>Gesamtpreis:</b> {entry.fullPrice} €
                                </Grid>
                                <Grid item>
                                    <Button variant="contained" color="primary" onClick={event => {
                                        history.push("/orderdetails", entry)
                                    }}>Details</Button>
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                )
            })}
        </Grid>
    )


}

