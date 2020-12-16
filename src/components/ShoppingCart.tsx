import React, {useState} from "react";
import MenuDrawer from "./MenuDrawer";
import {Button, Card, Typography} from "@material-ui/core";
import {
    clearShoppingCart, getShoppingCartCount,
    getShoppingCartPrice,
    isShoppingCartEmpty,
    ShoppingCartList
} from "../services/ShoppingCartUtil";
import Grid from "@material-ui/core/Grid";
import {isMobile, padding} from "../Utilities/Utilities";
import PaymentIcon from '@material-ui/icons/Payment';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import {ContextType} from "../Utilities/TsUtilities";
import {DialogBuilder} from "../Utilities/DialogBuilder";
import {Link, useHistory} from "react-router-dom";

interface ShoppingCart_props {

}

interface ShoppingCart_state {
}

class ShoppingCart extends React.Component<ShoppingCart_props, ShoppingCart_state> {

    constructor(props: ShoppingCart_props, context: any) {
        super(props, context);
        window.scrollTo(0, 0);
    }


    render() {
        let isEmpty = isShoppingCartEmpty();
        return (
            <MenuDrawer>
                <div style={{
                    marginTop: 8,
                }}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography variant="h2" align="center"
                                        color="textPrimary"
                                        className={"mobile"}
                                        gutterBottom>
                                Warenkorb
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <div style={{display: 'flex', justifyContent: 'center'}}>
                                <Grid container wrap={"wrap-reverse"} spacing={4}
                                      style={{width: isMobile() ? '100%' : '95%', maxWidth: isEmpty ? "1000px" : "1500px"}}>
                                    <Grid item md={isEmpty ? 12 : 9} sm={12}>
                                        <Grid container style={{width: "100%"}}>
                                            <Grid item xs={12}>
                                                <Card style={{marginTop: +isEmpty * 50, ...padding(18)}}>
                                                    {isEmpty ?
                                                        <div style={{textAlign: "center"}} className={"mobile"}>
                                                            <Typography variant="h4" gutterBottom>
                                                                Der Einkaufswagen ist leer
                                                            </Typography>
                                                            <Typography variant="h5" gutterBottom>
                                                                Suchen Sie sich doch ein paar Alben
                                                                Ihrer Wahl aus unserem {<Link
                                                                to={"/albums"}>Sortiment</Link>} aus
                                                            </Typography>
                                                        </div>
                                                        :
                                                        <ShoppingCartList
                                                            update={() => this.forceUpdate()}
                                                            showChangeCount={true}
                                                        shoppingCart={undefined}/>
                                                    }
                                                </Card>
                                            </Grid>
                                            <Grid item>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    {!isEmpty &&
                                    <Grid item md={3}>
                                        <Card style={padding(18)}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <Typography variant="body1">
                                                        Gesamtpreis der Bestellung
                                                    </Typography>
                                                    <Typography variant="h5">
                                                        {getShoppingCartPrice()} €
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography variant="body1">
                                                        Gesamtanzahl der Bestellung
                                                    </Typography>
                                                    <Typography variant="h5">
                                                        {getShoppingCartCount()} Stück
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs>
                                                    <GoToOrder/>
                                                </Grid>
                                                <Grid item xs>
                                                    <ClearShoppingCartButton context={this}/>
                                                </Grid>
                                            </Grid>
                                        </Card>
                                    </Grid>
                                    }
                                </Grid>
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </MenuDrawer>
        )
    }
}

/**
 *
 * @return {JSX.Element} paymentButton
 */
function GoToOrder(){
    const history = useHistory();
    let continueToOrder = () => {
        history.push("/placeorder")
    };

    return (
        <Button variant="contained" color="primary"
                endIcon={<PaymentIcon/>}
                onClick={event => {
                    continueToOrder()
                }}>
            {"Zur Kasse"}
        </Button>
    )
}

/**
 *
 * @param {shoppingCart} context
 * @return {JSX.Element} emptyShoppingcartButton
 */
function ClearShoppingCartButton({context}: ContextType<ShoppingCart>) {
    const [open, setOpen] = useState(false);
    return (
        <div>
            <Button variant="contained" color="secondary" endIcon={<DeleteIcon/>}
                    onClick={event => setOpen(true)}>
                {"Leeren"}
            </Button>
            {new DialogBuilder(open, setOpen)
                .setTitle("Einkaufswagen Leeren")
                .setText("Möchten Sie wirklich den kompletten Einkaufswagen unwiederruflich leeren?")
                .addButton("Abbrechen")
                .addButton(
                    {
                        label: "Leeren",
                        icon: <DeleteIcon/>,
                        color: "secondary",
                        isActionButton: true,
                        onClick: dialogBuilder => {
                            clearShoppingCart();
                            context.forceUpdate();
                        }
                    })
                .build()}
        </div>
    )
}

export default ShoppingCart;