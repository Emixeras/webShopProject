import Typography from "@material-ui/core/Typography";
import React from "react";
import MenuDrawer from "./MenuDrawer";
import {
    getSessionUser, isUserLoggedIn
} from "../services/StorageUtil";
import {margin, NavigationComponent, padding} from "../Utilities/Utilities";
import Grid from "@material-ui/core/Grid";
import {Card} from "@material-ui/core";
import {Link, useHistory} from "react-router-dom";
import axios from "axios";
import {alignCenter, formatDate, ImageGrid} from "../Utilities/TsUtilities";
import Button from "@material-ui/core/Button";
import SearchIcon from '@material-ui/icons/Search';


/**
 * The main Component of OrderOverview.js
 */
export default class OrderOverview extends React.Component {
    user = {};
    orders = [-1];

    constructor(props) {
        super(props);
        let sessionUser = getSessionUser();
        this.state = {
            user: sessionUser,
        };
        if (sessionUser)
            this.loadOrders();

    }


    /**
     * Lädt alle Kundenbestellungen aus Backend,
     * füllt sie in Array,
     * berechnet Gesamtpreis der Bestellung und hängt diese an.
     * Reversed das array, damit Sortierung für Darstellung aktuellste Bestellung zuerst passt.
     */
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
        let isEmpty = this.orders.length === 0;
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
                                    <Card style={{textAlign: "center", ...padding(18)}}>
                                        <Typography variant="h4" gutterBottom>
                                            Sie haben noch keine Bestellungen aufgegeben.
                                        </Typography>
                                        <Typography variant="h5" gutterBottom>
                                            Suchen Sie sich doch ein paar Alben
                                            Ihrer Wahl aus unserem {<Link
                                            to={"/albums"}>Sortiment</Link>} aus
                                        </Typography>
                                    </Card>
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

/**
 * Stellt alle Kundenbestellungen dar
 * @param {Order} orderArray
 * @param context
 * @returns {JSX.Element|null}
 */
function OrderList({orderArray, context}) {
    const history = useHistory()

    if (orderArray[0] === -1)
        return null

    return (
        <Grid container spacing={2}>
            {orderArray.map((entry, index) => {
                return (
                    <Grid item xs={12}>
                        <Card style={{...padding(18), ...(index % 2 === 1 ? {backgroundColor: "rgba(0,0,0,0.05)"} : {})}}>
                            <Grid container spacing={2} style={alignCenter(true)}>
                                <Grid item>
                                    <ImageGrid rounded style={{width: "100px", height: "100px"}} articleList={entry.order.entries.map(value => value.article)}/>
                                </Grid>
                                <Grid item>
                                    <Grid container spacing={2} direction={"column"} >
                                        <Grid item>
                                            <b>Datum:</b> {formatDate(entry.order.orderDate)}
                                        </Grid>
                                        <Grid item>
                                            <b>ID:</b> {entry.order.id}
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs>
                                    <Grid container style={margin(0, 15, 0, 0)} spacing={2} direction={"column"}>
                                        <Grid item>
                                            <b>Gesamtpreis:</b> {(entry.fullPrice + entry.order.shipping).toFixed(2)} €
                                        </Grid>
                                        <Grid item>
                                            <b>Artikel:</b> {entry.order.entries.map(obj => obj.count).reduce((res, curr) => res + curr)}
                                        </Grid>
                                    </Grid>
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

