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
import axios from "axios";
import {alignCenter, subString} from "../Utilities/TsUtilities";
import Button from "@material-ui/core/Button";
import SearchIcon from '@material-ui/icons/Search';

function isOrderHistoryEmpty() {
    return false
}


export default class OrderOverview extends React.Component {
    emptyOrderHistory = {entries: []};
    user = {};
    orders = [];
    dateFormat = require('dateformat')

    constructor(props) {
        super(props);
        this.state = {
            user: getSessionUser(),
        };
        this.loadOrders();

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
                orderElement.order.entries.forEach(function (positionElement) {
                    fullPrice = fullPrice + positionElement.count * positionElement.article.price;
                })
                orderElement.fullPrice = fullPrice;
            })
            this.orders = orderResponseArray;
            this.forceUpdate()
        })
    }


    render() {
        let isEmpty = isOrderHistoryEmpty();
        if (isUserLoggedIn())
            return (
                <MenuDrawer>
                    <Typography component="h1" variant="h2" align="center"
                                color="textPrimary"
                                gutterBottom>
                        Ihre Bestellungen
                    </Typography>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <div style={{width: '95%', maxWidth: isEmpty ? "1000px" : "800px"}}>
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
                                    <OrderList orderArray={this.orders} context={this}/>
                                }
                            </div>
                        </div>
                    </div>
                </MenuDrawer>
            )
        else {
            return <NavigationComponent to={"/login"}/>;
        }
    }
}

function OrderList({orderArray, context}) {
    const history = useHistory()

    return (
        <Grid container spacing={2}>
            {orderArray.map((entry, index) => {
                let dateString = subString(entry.order.orderDate, 0, -5);
                const date = Date.parse(dateString)
                return (
                    <Grid item xs={12}>
                        <Card style={{...padding(18), ...(index % 2 === 1 ? {backgroundColor: "rgba(0,0,0,0.05)"} : {})}}>
                            <Grid container spacing={2} style={alignCenter(true)}>
                                <Grid item>
                                    <div>
                                        <b>Datum:</b> {context.dateFormat(date, "dd.mm.yyyy HH:MM")} Uhr
                                    </div>
                                </Grid>
                                <Grid item xs>
                                    <b>Gesamtpreis:</b> {entry.fullPrice.toFixed(2)} €
                                </Grid>
                                <Grid item>
                                    <Button variant="contained" color="primary" onClick={event => {
                                        history.push("/orderdetails", entry)
                                    }} startIcon={<SearchIcon/>}>Details</Button>
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                )
            })}
        </Grid>
    )
}

