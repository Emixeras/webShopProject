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
import {LazyImage, base64ToDataUri, ContextType} from "../Utilities/TsUtilities";
import {Link} from "react-router-dom";
import MenuDrawer from "./MenuDrawer";
import {
    addDrawerCallback,
    getDrawerState,
    removeDrawerCallback
} from "../services/StorageUtil";


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
    picture?: { id: number, data: string };
}

interface ArtistOrGenre {
    id: number;
    name: string;
}

interface ImageResponseType {
    article: Article;
    file: string;
}

export default class AlbumOverview extends React.Component<IProps, IState> {
    drawerState = getDrawerState();
    drawerCallback = (state: boolean) => {
        this.drawerState = state;
        this.forceUpdate()
    };

    constructor(props: IProps, context: any) {
        super(props, context);
        this.loadArticles(this);
        addDrawerCallback(this.drawerCallback)
    }

    render() {
        return (<div>
                <MenuDrawer/>
                <div style={{marginInlineStart: (this.drawerState ? 240 : 0)}}>
                    <Album context={this}/>
                </div>
            </div>
        )
    }

    componentWillUnmount() {
        removeDrawerCallback(this.drawerCallback)
    }

    loadArticles(context: AlbumOverview) {
        fetch(new Request("http://localhost:8080/article", {method: 'GET'}))
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error(`Fehler bei der Anfrage: ${response.status} ${response.statusText}`);
                }
            })
            .then((response : Article[]) => {
                response.sort((a, b) => a.id - b.id);
                articleArray = response;
                this.forceUpdate();
                // this.performanceTest(context);
            })
            .catch(reason => {
                showToast(reason.message, "error")
            })
    }

    loadSingleImage(id: number, onFinish: (imageResponse?: ImageResponseType) => void) {
        fetch(new Request(`http://localhost:8080/article/range;start=${id};end=${id}`, {method: 'GET'}))
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error(`Fehler bei der Anfrage: ${response.status} ${response.statusText}`);
                }
            })
            .then((response: ImageResponseType[]) => onFinish(response[0]))
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
        paddingTop: '100%', // 16:9
        backgroundColor: "lightgrey"
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

function Album(props: ContextType<AlbumOverview>) {
    const classes = useStyles();
    if (articleArray.length === 0)
        buildDummyData();
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
                            <ArticleComponent context={props.context} article={article}/>
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
    let context: AlbumOverview = props.context;
    let isDummy: boolean = article.id === -1;
    // if (article.id === 100)
    //     debugger
    if (isDummy) {
        return (
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <Card className={classes.card}>
                    <CardMedia className={classes.cardMedia}/>
                    <CardContent className={classes.cardContent}>
                        <Typography gutterBottom variant="h5" component="h2"
                                    style={{backgroundColor: "lightgrey"}}>
                            {article.title}
                        </Typography>
                        <Typography style={{backgroundColor: "lightgrey"}}>
                            {article.description}
                        </Typography>
                        <Typography
                            style={{backgroundColor: "lightgrey", width: "40%", marginTop: 5}}>
                            {article.description}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        )
    } else {
        return (
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <CardActionArea component={Link} to={(location: any) => {
                    location.pathname = "/article";

                    location.state = {article: article};

                    return location;

                }}>
                    <Card className={classes.card}>
                        <LazyImage
                            alt={article.title}
                            getSrc={onResult => {
                                if (article.picture && article.picture.data) {
                                    onResult(base64ToDataUri(article.picture.data))
                                } else {
                                    context.loadSingleImage(article.id, imageResponse => {
                                        if (imageResponse)
                                            onResult(base64ToDataUri(imageResponse.file));
                                    });
                                }
                            }}
                        />
                        <CardContent className={classes.cardContent}>
                            <Typography gutterBottom variant="h5" component="h2">
                                {article.title}
                            </Typography>
                            <Typography>
                                {article.artists.name}
                            </Typography>
                            <Typography>
                                {article.genre.name}
                            </Typography>
                            <Typography>
                                {article.price + " €"}
                            </Typography>
                        </CardContent>
                    </Card>
                </CardActionArea>
            </Grid>
        )
    }
}


function buildDummyData() {
    for (let i = 0; i < 12; i++) {
        articleArray.push({
            id: -1,
            title: "⠀",
            description: "⠀",
            price: "",
            ean: -1,
            genre: {id: -1, name: ""},
            artists: {id: -1, name: ""},
            picture: undefined
        })
    }
}