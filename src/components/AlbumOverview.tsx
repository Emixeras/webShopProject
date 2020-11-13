import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CardActionArea from "@material-ui/core/CardActionArea";
import {showToast} from "../Utilities/Utilities";
import {Link} from "react-router-dom";
import MenuDrawer from "./MenuDrawer";
import {addDrawerCallback, isDrawerVisible, removeDrawerCallback} from "../services/StorageUtil";



interface IProps {
}

interface IState {
}

interface Article {
    id: number;
    title: string;
    description: string;
    ean: number;
    price: string;
    artists: ArtistOrGenre;
    genre: ArtistOrGenre;
}

interface ArtistOrGenre {
    id: number;
    name: string;
}

export default class AlbumOverview extends React.Component<IProps, IState> {
    drawerState = isDrawerVisible();
    drawerCallback = (state: boolean) => {
        this.drawerState = state;
        this.forceUpdate()
    };

    constructor(props: IProps, context: any) {
        super(props, context);
        this.loadArticles()
        addDrawerCallback(this.drawerCallback)
    }

    render() {
        return (<div>
                <MenuDrawer/>
                <div style={{marginInlineStart: (this.drawerState ? 240 : 0)}}>
                    <Album/>
                </div>
            </div>
        )
    }
    componentWillUnmount() {
        removeDrawerCallback(this.drawerCallback)
    }

    loadArticles() {
        fetch(new Request("http://localhost:8080/article", {method: 'GET'}))
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error(`Fehler bei der Anfrage: ${response.status} ${response.statusText}`);
                }
            })
            .then((response) => {
                articleArray = response;
                this.forceUpdate()
            })
            .catch(reason => {
                showToast(reason.message, "error")
            })
    }
}

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" to="https://material-ui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
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
        paddingTop: '56.25%', // 16:9
    },
    cardContent: {
        flexGrow: 1,
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
    },
}));

let articleArray: Array<Article> = [];

function Album() {
    const classes = useStyles();
    return (
        <React.Fragment>
            <main>
                {/* Hero unit */}
                <div className={classes.heroContent}>
                    <Container maxWidth="sm">
                        <Typography component="h1" variant="h2" align="center" color="textPrimary"
                                    gutterBottom>
                            Unsere Alben
                        </Typography>
                        <Typography variant="h5" align="center" color="textSecondary" paragraph>
                            Auf dieser Seite können Sie durch unsere Angebote stöbern
                        </Typography>
                    </Container>
                </div>
                <Container className={classes.cardGrid} maxWidth="lg">
                    <Grid container spacing={4}>
                        {articleArray.map((article) => (
                            <ArticleComponent article={article}/>
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
                <Copyright/>
            </footer>
            {/* End footer */}
        </React.Fragment>
    );
}


function ArticleComponent(props: any) {
    const classes = useStyles();
    let article: Article = props.article;
    return (
        <Grid item /*key={article}*/ xs={12} sm={6} md={4} lg={3}>
            <CardActionArea component={Link} to={(location: any) => {

                location.pathname = "/article";

                location.state = {article: article};

                return location;

            }} >
                <Card className={classes.card}>
                    <CardMedia
                        className={classes.cardMedia}
                        image="https://source.unsplash.com/random"
                        title="Image title"
                    />
                    <CardContent className={classes.cardContent}>
                        <Typography gutterBottom variant="h5" component="h2">
                            {article.title}
                        </Typography>
                        <Typography>
                            {article.description}
                        </Typography>
                    </CardContent>
                </Card>
            </CardActionArea>
        </Grid>
    )
}
