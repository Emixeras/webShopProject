import React, {Component} from 'react';
import {Link} from "react-router-dom";
import MenuDrawer from "./MenuDrawer";
import banner1 from "../assets/1.png";
import banner2 from "../assets/2.png";
import banner3 from "../assets/3.png";
import {makeStyles} from '@material-ui/core/styles';
import {showToast} from "../Utilities/Utilities";
import {
    Card,
    Grid,
    Typography,
    Container,
} from '@material-ui/core';
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import axios from "axios";
import {Carousel} from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {base64ToDataUri, LazyImage, RETURN_MODE} from "../Utilities/TsUtilities";

class ArtistOverview extends Component {

    constructor(props, context) {
        super(props, context);
        this.loadGenre()
    }

    render() {

        return (
            <MenuDrawer>
                <div style={{marginInlineStart: (this.drawerState ? 240 : 0)}}>
                    <Carousel showArrows={false} showStatus={false} infiniteLoop={true}
                              showThumbs={false} autoPlay={true}>
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
            </MenuDrawer>
        )
    }

    loadGenre() {
        axios.get("http://localhost:8080/artist/range;start=1;end=50").then((response) => {
            showToast("artist fetch ok", "success");
            var artistresponse = response.data;
            Object.keys(artistresponse).forEach(function (key) {
                artistArray.push(artistresponse[key]);
            });
            this.forceUpdate()
        })
            .catch(function (error) {
                showToast("artist fetch failed" + error, "error");
            })
    }
}

let artistArray = [];

function Artist() {
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
    let artistResponse = props.artist;

    return (
        <Grid item /*key={article}*/ xs={12} sm={6} md={4} lg={3}>
            <CardActionArea component={Link} to={(location) => {
                location.pathname = "/albums";
                //location.state = {artist: artistResponse};
                return location;
            }}>
                <Card className={classes.card}>
                    <LazyImage
                        returnMode={RETURN_MODE.CARD_MEDIA}
                        alt={artistResponse.artist.name}
                        className={classes.cardMedia}
                        // payload={artistResponse}
                        getSrc={setImgSrc => {
                            if (artistResponse.file)
                                setImgSrc(base64ToDataUri(artistResponse.file));
                        }}
                    />
                    <CardContent className={classes.cardContent}>
                        <Typography gutterBottom variant="h5" component="h2">
                            {artistResponse.artist.name}
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