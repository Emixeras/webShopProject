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
        axios.get("http://localhost:8080/artist").then((response) => {
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
                        src={"data:image/png;base64," + "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"}
                        title={artist.name}
                    />
                    <CardContent className={classes.cardContent}>
                        <Typography gutterBottom variant="h5" component="h2">
                            {artist.name}
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
        backgroundColor: '#00BCD4',
        paddingTop: '0%', // 16:9
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