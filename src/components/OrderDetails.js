import React, {Component} from 'react';
import {NavigationComponent} from "../Utilities/Utilities";
import Grid from "@material-ui/core/Grid";
import {
    Card,
    Button,
} from '@material-ui/core';
import MenuDrawer, {addDrawerCallback, setOpen_ref, removeDrawerCallback} from "./MenuDrawer";
import 'react-toastify/dist/ReactToastify.css';
import {padding} from "../Utilities/Utilities";
import {
    isDrawerVisible,
    isUserLoggedIn
} from "../services/StorageUtil";
import Typography from "@material-ui/core/Typography";
import {
    ShoppingCartList
} from "../services/ShoppingCartUtil";
import {formatDate, matchParent} from "../Utilities/TsUtilities";
import PrintIcon from '@material-ui/icons/Print';


export default class OrderDetails extends Component {
    user = {};
    shoppingCart = {}
    totalPriceWithoutShipping = 0;
    totalItemCount = 0;

    constructor(props) {
        super(props);

        let payload = this.props.location.state;

        this.state = {
            totalItemCount: 0,
            totalPriceWithoutShipping: 0,
            shoppingCart: payload.order.entries,
            orderDate: payload.order.orderDate,
            id: payload.order.id,
            user: payload.order.shopOrderUser,
            paymentMethod: payload.order.payment,
        };

        this.state.shoppingCart.map((item) =>{
                this.state.totalPriceWithoutShipping=this.state.totalPriceWithoutShipping+(parseFloat(item.count).toFixed(2)*parseFloat(item.article.price).toFixed(2))
            this.state.totalItemCount = this.state.totalItemCount + (item.count);
        }
        );

        window.scrollTo(0, 0);
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
                                            }} className={"black-on-print"}>
                                                Ihre Bestellung (id: {this.state.id}) vom {formatDate(this.state.orderDate, true)} Uhr
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
                                            }} className={"bold-on-print"}>
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
                                            }} className={"bold-on-print"}>
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
                                            }} className={"bold-on-print"}>
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
                                                    shoppingCart = {this.state.shoppingCart}
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
                                                            <b>Artikel</b> ({this.state.totalItemCount} Stk.): {this.state.totalPriceWithoutShipping.toFixed(2)} €
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
                                                            <b>Gesamtpreis</b> {(this.state.totalPriceWithoutShipping + 5.99).toFixed(2)} €
                                                        </div>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Card>
                            </Grid>
                            <Grid item xs={12}>
                                <div style={{display: "flex", justifyContent: "flex-end", ...matchParent(false, true)}}>
                                    <Button onClick={event => window.print()} variant={"contained"} color={"primary"} startIcon={<PrintIcon/>} className={"no-print"}>
                                        Drucken
                                    </Button>
                                </div>
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