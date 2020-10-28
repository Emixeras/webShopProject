import React from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import MenuDrawer from "./MenuDrawer";

class ShoppingCart extends React.Component {
    render(){
        return (
            <div>
                <MuiThemeProvider>
                    <MenuDrawer/>
                    <br/>
                    sign in or register
                </MuiThemeProvider>
            </div>

        )
    }
}
export default ShoppingCart;