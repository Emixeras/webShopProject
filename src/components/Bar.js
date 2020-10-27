import React from "react";
import AppBar from 'material-ui/AppBar';
import {IconButton} from "material-ui";
import HomeIcon from '@material-ui/icons/Home';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import {Link} from "react-router-dom";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import logo from '../assets/text4549.png';
import index from '../index.css'

class Bar extends React.Component{
render() {
    const title = this.props.title;
    return <div>
        <AppBar style={{ background: '#2E3B55' }}
                //title={title}
                position="static">
            <div style={{ alignSelf: 'center', flex: 3}}>
                <img style={{ alignSelf: 'center' }} height="50" src={logo} alt="fireSpot"/>
            </div>
            <Link to="/">
                <IconButton style={{margin: 5, color: "white"}} component="span">
                    <HomeIcon />
                </IconButton>
            </Link>
            <Link to="/shoppingcart">
            <IconButton style={{margin: 5, color: "white"}} component="span">
                <ShoppingCartIcon />
            </IconButton>
            </Link><Link to="/login">
            <IconButton style={{margin: 5, color: "white"}} component="span">
                <AccountCircleIcon />
            </IconButton>
            </Link>
    </AppBar>
    </div>
}
}
export default Bar;