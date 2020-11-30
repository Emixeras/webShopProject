import Typography from "@material-ui/core/Typography";
import React from "react";
import MenuDrawer from "./MenuDrawer";


export default class OrderOverview extends React.Component {

    render() {
    return(

    <div>
        <MenuDrawer>
        <Typography component="h1" variant="h2" align="center"
                    color="textPrimary"
                    gutterBottom>
            Ihre Bestellungen
        </Typography>
        </MenuDrawer>
    </div>
    )
    }
}