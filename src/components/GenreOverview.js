import React, {Component} from 'react';
import {Link} from "react-router-dom";
import MenuDrawer from "./MenuDrawer";
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
import {base64ToDataUri} from "../Utilities/TsUtilities";

class GenreOverview extends Component {

    constructor(props, context) {
        super(props, context);
        this.loadGenre()
    }

    render() {

        return (
            <MenuDrawer>
                <div style={{marginInlineStart: (this.drawerState ? 240 : 0)}}>
                    <Genre/>
                </div>
            </MenuDrawer>
        )
    }

    loadGenre() {
        axios.get("http://localhost:8080/genre").then((response) => {
            // showToast("genre fetch ok", "success");
            genreArray = [];
            var genreresponse = response.data;
            Object.keys(genreresponse).forEach(function (key) {
                genreArray.push(genreresponse[key]);
            });
            this.forceUpdate()
        })
            .catch(function (error) {
                showToast("genre fetch failed" + error, "error");
            })
    }
}

let genreArray = [];

function Genre() {
    const classes = useStyles();
    return (
        <React.Fragment>
            <main>
                <Container className={classes.cardGrid} maxWidth="lg">
                    <Grid container spacing={4}>
                        {genreArray.map((genre) => (
                            <GenreComponent genre={genre}/>
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

function GenreComponent(props) {
    const classes = useStyles();
    let genre = props.genre;

    return (
        <Grid item /*key={article}*/ xs={12} sm={6} md={4} lg={3}>
            <CardActionArea component={Link} to={(location) => {
                location.pathname = "/albums";
                location.state = {genre: genre};
                return location;
            }}>
                <Card className={classes.card}>
                    <CardMedia
                        component='img'
                        className={classes.cardMedia}
                        src={base64ToDataUri(genre.file)}
                        title={genre.genre.name}
                    />
                    <CardContent className={classes.cardContent}>
                        <Typography gutterBottom variant="h5" component="h2">
                            {genre.genre.name}
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

export default GenreOverview;