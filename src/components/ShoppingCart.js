import React from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Bar from "./Bar";

class ShoppingCart extends React.Component {
    render(){
        return (
            <div>
                <MuiThemeProvider>
                    <Bar title={this.constructor.name}></Bar>
                    <br/>
                    sign in or register
                </MuiThemeProvider>
            </div>

        )
    }
}
export default ShoppingCart;