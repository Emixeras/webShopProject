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
import {
    artistOrGenre_comparator,
    base64ToDataUri,
    LazyImage,
    loadSingleImage, name_comparator,
    RETURN_MODE
} from "../Utilities/TsUtilities";

class ArtistOverview extends Component {

    constructor(props, context) {
        super(props, context);
        this.loadArtists()
        window.scrollTo(0,0);
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

    loadArtists() {
        artistResponseArray = [];
        axios.get(`http://${window.location.hostname}:8080/artist`).then((response) => {
            var artistResponse = response.data;
            Object.keys(artistResponse).forEach(key => {
                artistResponseArray.push({file: "", artistOrGenre: artistResponse[key]});
            });
            artistResponseArray.sort((a, b) => name_comparator(a.artistOrGenre.name, b.artistOrGenre.name))
            this.forceUpdate()
        })
            .catch(function (error) {
                // showToast("artist fetch failed" + error, "error");
            })
    }
}

let artistResponseArray = [];

function Artist() {
    const classes = useStyles();
    return (
        <React.Fragment>
            <main>
                <Container className={classes.cardGrid} maxWidth="lg">
                    <Grid container spacing={4}>
                        {artistResponseArray.map((artistResponse) => (
                            <ArtistComponent artistResponse={artistResponse}/>
                        ))}
                    </Grid>
                </Container>
            </main>
        </React.Fragment>
    );
}

function ArtistComponent({artistResponse}) {
    const classes = useStyles();

    // if (artistResponse.artistOrGenre.id === 1)
    //     debugger

    return (
        <Grid item className={"mobile gridItem"} xs={6} md={4} lg={3}>
            <CardActionArea component={Link} to={(location) => {
                // if (artistResponse.artistOrGenre.id === 2)
                //     debugger
                location.pathname = "/albums";
                location.state = {filter: artistResponse, type: 'a'};
                return location;
            }}>
                <Card className={classes.card}>
                    <LazyImage
                        returnMode={RETURN_MODE.CARD_MEDIA}
                        alt={artistResponse.artistOrGenre.name}
                        className={classes.cardMedia}
                        // payload={artistResponse}
                        getSrc={setImgSrc => {
                            loadSingleImage("artist", artistResponse.artistOrGenre.id, imageResponse => {
                                // if (artistResponse.artistOrGenre.id === 2)
                                //     debugger
                                // if (artistResponse.artistOrGenre.id === 54)
                                //     debugger
                                if (imageResponse) {
                                    let file = imageResponse.file;
                                    artistResponse.file = file;
                                    setImgSrc(base64ToDataUri(file))
                                    // if (artistResponse.artistOrGenre.id === 51)
                                    //     debugger

                                }
                            })
                        }}
                    />
                    <CardContent className={classes.cardContent}>
                        <Typography gutterBottom variant="h5" component="h2">
                            {artistResponse.artistOrGenre.name}
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
        paddingTop: '100%',
        backgroundColor: 'lightgrey',
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