import React from "react";
import MenuDrawer from "./MenuDrawer";
import {Button, Card, Typography} from "@material-ui/core";
import {
    clearShoppingCart, getAllShoppingCartArticles,
    getShoppingCartCount,
    getShoppingCartPrice
} from "../services/ShoppingCartUtil";
import Grid from "@material-ui/core/Grid";
import {padding} from "../Utilities/Utilities";

class ShoppingCart extends React.Component {

    constructor(props, context) {
        super(props, context);
        window.scrollTo(0,0);
    }

    render() {
        return (
            <MenuDrawer>
                <Button variant="contained" color="primary" onClick={event => {
                    clearShoppingCart();
                    this.forceUpdate();
                }}>Leeren</Button>
                <Typography>
                    Count: {getShoppingCartCount()}, Price: {getShoppingCartPrice()} €
                </Typography>
                <Grid container spacing={2}>
                    {getAllShoppingCartArticles().map((article, index) => {
                        return (
                            <Grid item xs={12}>
                                <Card style={padding(8)}>
                                    <Typography>
                                        <b>{index + 1}. {article.title}</b>     PE: {article.price} €     Count: {getShoppingCartCount(article)}      PG: {getShoppingCartPrice(article)} €
                                    </Typography>
                                </Card>
                            </Grid>
                        )
                    })}
                </Grid>
                {/*<Typography align={"left"} style={{whiteSpace: 'pre-wrap',}}>*/}
                {/*    {JSON.stringify(JSON.parse(localStorage.getItem("SHOPPING_CART")), null, 2)}*/}
                {/*</Typography>*/}
            </MenuDrawer>
        )
    }
}

export default ShoppingCart;