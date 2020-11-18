import React, {Component} from 'react';
import {Link} from "react-router-dom";
import MenuDrawer from "./MenuDrawer";
import banner1 from "../assets/1.png";
import banner2 from "../assets/2.png";
import banner3 from "../assets/3.png";
import {
    addDrawerCallback,
    isDrawerVisible,
    removeDrawerCallback,
} from "../services/StorageUtil";
import {makeStyles} from '@material-ui/core/styles';
import {showToast} from "../Utilities/Utilities";
import {
    Card,
    Grid,
    Typography,
    Container,
} from '@material-ui/core';
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import axios from "axios";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

class ArtistOverview extends Component {

    drawerState = isDrawerVisible();
    drawerCallback = state => {
        this.drawerState = state;
        this.forceUpdate()
    };

    constructor(props, context) {
        super(props, context);
        this.loadGenre()
        addDrawerCallback(this.drawerCallback)
    }

    render() {

        return (<div>
                <MenuDrawer/>
                <div style={{marginInlineStart: (this.drawerState ? 240 : 0)}}>
                    <Carousel showArrows={false} showStatus={false} infiniteLoop={true} showThumbs={false} autoPlay={true}>
                        <div>
                            <img src={banner1}/>
                        </div>
                        <div>
                            <img src={banner2}/>
                        </div>
                        <div>
                            <img src={banner3}/>
                        </div>
                    </Carousel>
                    <Artist/>
                </div>
            </div>
        )
    }

    loadGenre(){
        axios.get("http://localhost:8080/artist/range;start=1;end=50").then((response) => {
            showToast("artist fetch ok", "success");
            var artistresponse = response.data;
            Object.keys(artistresponse).forEach(function(key) {
                artistArray.push(artistresponse[key]);
            });
            this.forceUpdate()
        })
            .catch(function (error) {
                showToast("artist fetch failed" + error, "error");
            })
    }

    componentWillUnmount() {removeDrawerCallback(this.drawerCallback)}
}

let artistArray = [];

function Artist(){
    const classes = useStyles();
    return (
        <React.Fragment>
            <main>
                <Container className={classes.cardGrid} maxWidth="lg">
                    <Grid container spacing={4}>
                        {artistArray.map((artist) => (
                            <ArtistComponent artist={artist}/>
                        ))}
                    </Grid>
                </Container>
            </main>
            {/* Footer */}
            <footer className={classes.footer}>
                <Typography variant="h6" align="center" gutterBottom>
                    Footer
                </Typography>
                <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
                    Something here to give the footer a purpose!
                </Typography>

            </footer>
            {/* End footer */}
        </React.Fragment>
    );
}
function ArtistComponent(props) {
    const classes = useStyles();
    let artist = props.artist;
//todo cardmedia quadratisch anzeigen
    return (
        <Grid item /*key={article}*/ xs={12} sm={6} md={4} lg={3}>
            <CardActionArea component={Link} to={(location) => {
                location.pathname = "/article";
                return location;
            }} >
                <Card className={classes.card}>
                    <CardMedia
                        component='img'
                        className={classes.cardMedia}
                        src= {"data:image/png;base64," + artist.file}
                        title={artist.artist.name}
                    />
                    <CardContent className={classes.cardContent}>
                        <Typography gutterBottom variant="h5" component="h2">
                            {artist.artist.name}
                        </Typography>
                        <Typography>
                        </Typography>
                    </CardContent>
                </Card>
            </CardActionArea>
        </Grid>
    )
}

const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: theme.spacing(2),
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardMedia: {
        width: '100%',
        paddingTop: '100%',
        backgroundColor: '#00BCD4',
    },
    cardContent: {
        flexGrow: 1,
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
    },
}));

export default ArtistOverview;