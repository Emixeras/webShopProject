import React from 'react';
import clsx from 'clsx';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {Link} from "react-router-dom";
import HomeIcon from "@material-ui/icons/Home";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import DescriptionIcon from '@material-ui/icons/Description';
import logo from "../assets/text4549.png";
import AlbumIcon from '@material-ui/icons/Album';
import LibraryMusicIcon from '@material-ui/icons/LibraryMusic';
import RadioIcon from '@material-ui/icons/Radio';

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: 0,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: drawerWidth,
    },
}));

function ListItemLink(props) {
    const {icon, primary, to} = props;

    const renderLink = React.useMemo(
        () =>
            React.forwardRef((itemProps, ref) => (
                <Link to={to} ref={ref} {...itemProps} />
            )),
        [to]
    );

    return (
        <li>
            <ListItem button component={renderLink}>
                {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
                <ListItemText primary={primary}/>
            </ListItem>
        </li>
    );
}


export default function MenuDrawer() {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(true);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };


    return (


        <div>
            <AppBar
                position="fixed"
                style={{background: '#2E3B55'}}
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar
                >
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        style={{alignSelf: 'center'}}
                        className={clsx(classes.menuButton, open && classes.hide)}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <div style={{alignSelf: 'center', flex: 3}}>
                        <img style={{alignSelf: 'center'}} height="50" src={logo} alt="fireSpot"/>
                    </div>
                    <Link to="/">
                        <IconButton style={{margin: 5, color: "white"}} component="span" edge="start">
                            <HomeIcon/>
                        </IconButton>
                    </Link>
                    <Link to="/shoppingcart">
                        <IconButton style={{margin: 5, color: "white"}} component="span">
                            <ShoppingCartIcon/>
                        </IconButton>
                    </Link><Link to="/login">
                    <IconButton style={{margin: 5, color: "white"}} component="span">
                        <AccountCircleIcon/>
                    </IconButton>
                </Link>
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
                    </IconButton>
                </div>
                <Divider/>
                <List>
                    <ListItemLink
                        to="/artists"
                        primary="Künstler"
                        icon={<LibraryMusicIcon/>}
                    />
                    <ListItemLink
                        to="/albums"
                        primary="Alben"
                        icon={<AlbumIcon/>}
                    />
                    <ListItemLink
                        to="/genres"
                        primary="Genre"
                        icon={<RadioIcon/>}
                    />
                </List>
                <Divider/>
                <List>
                    <ListItemLink
                        to="/shoppingcart"
                        primary="Warenkorb"
                        icon={<ShoppingCartIcon/>}
                    />
                    <ListItemLink
                        to="/profile"
                        primary="Benutzer"
                        icon={<AccountCircleIcon/>}
                    />
                    <ListItemLink
                        to="/Impressum"
                        primary="Impressum"
                        icon={<DescriptionIcon/>}
                    />
                </List>
            </Drawer>
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}
            >
                <div className={classes.drawerHeader}/>
            </main>
        </div>
    );
}