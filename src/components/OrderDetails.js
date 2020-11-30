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
    getSessionUser, isUserLoggedIn
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


class OrderDetails extends Component {

    user = {};
    shoppingcart = {}
    totalpricewithoutshipping = 0;
    totalitemcount = 0;

    constructor(props) {
        super(props);

        this.state = {
            totalitemcount: 0,
            totalpricewithoutshipping: 0,
            shoppingcart: [
                {
                    "article": {
                        "artists": {
                            "id": 28,
                            "name": "Led Zeppelin"
                        },
                        "description": "Nullam molestie nibh in lectus.",
                        "ean": 94095533,
                        "genre": {
                            "id": 2,
                            "name": "Country"
                        },
                        "id": 153,
                        "price": "15.11",
                        "title": "Abshire-Thiel"
                    },
                    "count": 99
                },
                {
                    "article": {
                        "artists": {
                            "id": 8,
                            "name": "Barbra Streisand"
                        },
                        "description": "In quis justo.",
                        "ean": 1862514,
                        "genre": {
                            "id": 14,
                            "name": "Techno"
                        },
                        "id": 377,
                        "price": "6.92",
                        "title": "Abbott, Torphy and Gusikowski"
                    },
                    "count": 88
                }
            ],
            user: {
                "birth": "2020-01-26T00:00:00Z[UTC]",
                "email": "employee@employee.de",
                "firstName": "tttt",
                "id": 3,
                "lastName": "tttt",
                "password": "tttt",
                "postalCode": 111,
                "role": "EMPLOYEE",
                "street": "street",
                "streetNumber": 111,
                "title": "FRAU",
                "town": "town"
            },
            paymentMethod: -1,
        };
        this.state.shoppingcart.map((item) =>{
                this.state.totalpricewithoutshipping=this.state.totalpricewithoutshipping+(parseFloat(item.count).toFixed(2)*parseFloat(item.article.price).toFixed(2))
            this.state.totalitemcount = this.state.totalitemcount + (item.count);
        }
        );

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
                                <Card style={{
                                    ...padding(18),
                                    backgroundColor: "rgba(46,59,85,1)"
                                }}>
                                    <Grid
                                        container
                                        direction="column">
                                        <Grid item fullWidth>
                                            <div style={{
                                                fontWeight: "bold",
                                                textAlign: "center",
                                                fontSize: 22,
                                                marginBottom: 3,
                                                color: "white"
                                            }}>
                                                Ihre Bestellung (id: 123) vom 12.12.2020
                                            </div>
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
                                                Lieferadresse
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
                                                Bezahlmethode
                                            </div>
                                        </Grid>
                                        <Grid item>
                                            <Typography> </Typography>
                                            <Typography>Vorkasse</Typography>
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
                                                marginBottom: 10
                                            }}>
                                                Ihre Bestellung
                                            </div>
                                        </Grid>
                                        <Grid item>
                                        </Grid>
                                        <Grid item fullWidth>
                                            <Grid item fullWidth>
                                                <ShoppingCartList
                                                    update={() => this.forceUpdate()}
                                                    showChangeCount={false}
                                                    shoppingcart = {this.state.shoppingcart}
                                                />
                                                <hr/>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Grid container
                                                      wrap={"wrap-reverse"}
                                                      direction="row"
                                                      justify="flex-end"
                                                      spacing={3}>
                                                    <Grid item>
                                                        <div style={padding(0,90,0,0)}>
                                                            <b>Artikel</b> ({this.state.totalitemcount} Stk.): {this.state.totalpricewithoutshipping.toFixed(2)} €
                                                        </div>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Grid container
                                                      wrap={"wrap-reverse"}
                                                      direction="row"
                                                      justify="flex-end"
                                                      spacing={3}>
                                                    <Grid item>
                                                        <div style={padding(0,90,0,0)}>
                                                            zzgl. Versand 5.99 €
                                                        </div>
                                                    </Grid>
                                                </Grid>
                                                <Grid item fullWidth>
                                                    <hr/>
                                                </Grid>
                                                <Grid container
                                                      wrap={"wrap-reverse"}
                                                      direction="row"
                                                      justify="flex-end"
                                                      spacing={3}>
                                                    <Grid item>
                                                        <div style={padding(0,90,0,0)}>
                                                            <b>Gesamtpreis</b> {(this.state.totalpricewithoutshipping + 5.99).toFixed(2)} €
                                                        </div>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
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

export default OrderDetails;