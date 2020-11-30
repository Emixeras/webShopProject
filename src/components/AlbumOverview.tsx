import React, {useEffect, useState} from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid, {GridDirection} from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CardActionArea from "@material-ui/core/CardActionArea";
import {margin, NavigationComponent, padding, showToast} from "../Utilities/Utilities";
import {
    article_comparator,
    base64ToDataUri,
    ContextType,
    filterArticle,
    ifExistsReturnOrElse, ifValueReturnOrElse,
    LazyImage, name_comparator,
    Pair,
    RETURN_MODE, Article, loadSingleImage
} from "../Utilities/TsUtilities";
import {Link} from "react-router-dom";
import MenuDrawer, {addDrawerCallback, removeDrawerCallback} from "./MenuDrawer";
import {
    Button,
    FormControl,
    FormControlLabel,
    IconButton,
    InputAdornment,
    InputLabel, Menu, MenuItem,
    OutlinedInput,
    Slider,
    Switch, TextField
} from "@material-ui/core";
import {DialogBuilder} from "../Utilities/DialogBuilder";
import SettingsIcon from '@material-ui/icons/Settings';
import SearchIcon from '@material-ui/icons/Search';
import SortIcon from '@material-ui/icons/Sort';
import InfiniteScroll from "react-infinite-scroll-component";
import ResizeObserver from 'resize-observer-polyfill';

interface IProps {
    // @ts-ignore
    location: History.Location;
}

interface IState {
}

interface ArtistOrGenre {
    id: number;
    name: string;
}

interface FilterPayload {
    file: string;
    artistOrGenre: ArtistOrGenre;
}

interface ImageResponseType {
    article: Article;
    file: string;
}

enum SORT_TYPE {
    TITLE, TITLE_REVERSED, TIME, TIME_REVERSED,
}

const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: theme.spacing(2),
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(3, 0, 2),
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

export default class AlbumOverview extends React.Component<IProps, IState> {
    IMAGE_RESOLUTION: string = "IMAGE_RESOLUTION";
    imageResolution: number = +(localStorage.getItem(this.IMAGE_RESOLUTION) as string);
    STEP_DISTANCE: string = "STEP_DISTANCE";
    stepDistance: number = ifValueReturnOrElse(+(localStorage.getItem(this.STEP_DISTANCE) as string), 0, undefined, 48, true);
    UNLOAD_IMAGES: string = "UNLOAD_IMAGES";
    unloadImages: boolean = (localStorage.getItem(this.UNLOAD_IMAGES) as string) == 'true';
    SORT_TYPE: string = "SORT_TYPE"
    sortType: SORT_TYPE = (+(localStorage.getItem(this.SORT_TYPE) as string))
    imageReloadArray: Array<() => void> = [];
    query: Pair<string, boolean> = Pair.make("", false);
    filter?: Pair<FilterPayload, string>;
    maxVisible: number = this.stepDistance;
    hasMore: boolean = true;

    constructor(props: IProps, context: any) {
        super(props, context);

        let state = this.props.location.state;
        if (state) {
            this.filter = Pair.make(state.filter, state.type)
        }
        this.loadArticles(this);
        window.scrollTo(0, 0);
    }

    render() {
        if (!this.props.location.state || this.props.location.state.home) {
            this.filter = undefined;
            this.query = Pair.make("", false);
        }
        if (window.location.pathname === "/") {
            return <NavigationComponent to={"/albums"}/>;
        }
        return (
            <MenuDrawer>
                <Album context={this}/>
            </MenuDrawer>
        )
    }

    loadArticles(context: AlbumOverview) {
        fetch(new Request(`http://${window.location.hostname}:8080/article`, {method: 'GET'}))
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error(`Fehler bei der Anfrage: ${response.status} ${response.statusText}`);
                }
            })
            .then((response: Article[]) => {
                // debugger
                articleArray = response;
                this.sortList();
                this.forceUpdate();
                // this.performanceTest(context);
            })
            .catch(reason => {
                showToast(reason.message, "error")
            })
    }

    sortList() {
        let idSorter = (a: Article, b: Article) => a.id - b.id;
        switch (this.sortType) {
            case SORT_TYPE.TIME:
                articleArray.sort(idSorter);
                break;
            case SORT_TYPE.TIME_REVERSED:
                articleArray.sort((a, b) => idSorter(a, b) * -1);
                break;
            case SORT_TYPE.TITLE:
                articleArray.sort(article_comparator);
                break;
            case SORT_TYPE.TITLE_REVERSED:
                articleArray.sort((a, b) => article_comparator(a, b) * -1);
                break;


        }
    }

    componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any): void {
        if (this.query.second)
            reloadImages(this);
    }
}

function Album(props: ContextType<AlbumOverview>) {
    const classes = useStyles();
    let context = props.context;
    let filteredArticleArray: Array<Article>;
    context.maxVisible = context.stepDistance;
    context.hasMore = true;

    if (articleArray.length === 0)
        buildDummyData();

    let queryText = context.query.first + ifExistsReturnOrElse(context.filter, input => ifExistsReturnOrElse(context.query.first, input1 => " & ", "") + input.second + ": " + input.first.artistOrGenre.name.toLowerCase(), "");
    if (queryText && articleArray[0].id !== -2) {
        console.log(context.query)
        filteredArticleArray = articleArray.filter(article => filterArticle(queryText, article))
    } else
        filteredArticleArray = articleArray;

    return (
        <React.Fragment>
            <main>
                <div className={classes.heroContent}>
                    <Container maxWidth="sm">
                        {!context.filter ?
                            <div>
                                <Typography component="h1" variant="h2" align="center"
                                            color="textPrimary"
                                            gutterBottom>
                                    Unsere Alben
                                </Typography>
                                < Typography variant="h5" align="center" color="textSecondary"
                                             paragraph>
                                    Auf dieser Seite können Sie durch unsere Angebote stöbern
                                </Typography>
                            </div>
                            :
                            /*<FilterCard context={context}/>*/
                            <FilterCard context={context}/>
                        }
                    </Container>
                    <Container maxWidth={"md"} style={{marginTop: 40}}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel htmlFor="albums-search">Suche</InputLabel>
                            <OutlinedInput
                                id="albums-search"
                                onChange={event => context.query.first = event.target.value.toLowerCase()}
                                onKeyUp={(event) => {
                                    if (event.key === 'Enter') {
                                        context.forceUpdate();
                                        context.query.second = true;
                                    }
                                }}
                                placeholder={"Titel: t, Künstler: a, Genre; g, Beschreibung: d, Preis: p (x-x), EAN: e"}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={event => {
                                                context.forceUpdate();
                                                context.query.second = true;
                                            }}
                                            edge="end"
                                        >
                                            {<SearchIcon/>}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                labelWidth={45}
                            />
                        </FormControl>
                        <UiSettings context={context}/>
                    </Container>
                </div>
                <Container className={classes.cardGrid} maxWidth="lg">
                    {filteredArticleArray.length > 0 ?
                        <GridList context={context} filteredArticleArray={filteredArticleArray}/>
                        :
                        <Typography style={{marginTop: 50}} variant="h6" align="center"
                                    gutterBottom>
                            Keine Alben gefunden
                        </Typography>
                    }
                </Container>
            </main>
        </React.Fragment>
    );
}

let setDummy: ((next: number) => void);
let direction: GridDirection = "row";
let dummy: number = 0;

export function FilterCard({context}: ContextType<AlbumOverview>) {
    setDummy = useState(0)[1];

    function getNewDirection(): GridDirection {
        // debugger
        let filterCard_root = document.getElementById("filterCard_root");
        let filterCard_text = document.getElementById("filterCard_text");
        if (filterCard_root && filterCard_text) {
            if (direction === "row" && filterCard_root.offsetHeight > 250) {
                return "column";
            } else if (direction === "column" && (filterCard_text.offsetWidth + 250) <= filterCard_root.offsetWidth) {
                return "row";
            }
        }
        return direction;
    }

    function testAndApply() {
        let newDirection = getNewDirection();
        if (direction !== newDirection) {
            direction = newDirection;
            setDummy(++dummy);
        }
    }

    useEffect(() => {
        direction = getNewDirection();
        setDummy(++dummy);

        let card = document.getElementById("filterCard_card");

        if (card) {
            new ResizeObserver((entries: any) => {
                testAndApply();
            }).observe(card);
        }

        let listener = (ev: any) => {
            testAndApply();
        };

        let drawerCallback = (state: boolean) => {
            testAndApply();
        };

        window.addEventListener('resize', listener);
        addDrawerCallback(drawerCallback)

        return () => {
            window.removeEventListener('resize', listener);
            removeDrawerCallback(drawerCallback)
        }
    }, []);

    return (
        <div style={{display: 'flex', justifyContent: 'center'}} id={"filterCard_root"}>
            <Card style={{minHeight: "250px"}} id={"filterCard_card"}>
                <Grid container alignItems={direction === "row" ? "flex-end" : "flex-start"}
                      direction={direction}>
                    <Grid item>
                        {/*<div>*/}
                        <LazyImage
                            getSrc={setImgSrc => {
                                // @ts-ignore
                                setImgSrc(base64ToDataUri(context.filter.first.file));
                            }}
                            returnMode={RETURN_MODE.CARD_MEDIA}
                            style={{
                                width: "250px",
                                height: "250px",
                                backgroundColor: (context.filter && context.filter.second === "g" ? '#00BCD4' : "lightgrey")
                            }}
                            shouldImageUpdate={oldPayload => false}
                        />
                        {/*</div>*/}
                    </Grid>
                    <Grid item>
                        <Typography component="h1" variant="h2" id={"filterCard_text"}
                                    style={{
                                        width: "250px",
                                        display: "inline-table", ...padding(16, 16, 0, 16)
                                    }}
                                    color="textPrimary"
                        >
                            {
                                // @ts-ignore
                                context.filter.first.artistOrGenre.name
                            }
                        </Typography>
                    </Grid>
                </Grid>
            </Card>
        </div>
    )
        ;
}

function UiSettings({context}: ContextType<AlbumOverview>) {
    const [open, setOpen] = useState(false);
    const [checked, setChecked] = useState(context.unloadImages);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    let resolution = context.imageResolution;
    let stepDistance = context.stepDistance;
    const handleClose = () => {
        setAnchorEl(null);
    };

    function setSortType(sortType: SORT_TYPE) {
        handleClose();
        context.sortType = sortType;
        localStorage.setItem(context.SORT_TYPE, `${sortType}`);
        context.sortList();
        context.forceUpdate();
        reloadImages(context);
    }
    function listItem(text: string, sortType: SORT_TYPE, divider?: boolean): JSX.Element {
        return <MenuItem divider={divider} style={context.sortType === sortType ?  {backgroundColor: "rgba(0,0,0,0.1)"} : undefined} onClick={event => setSortType(sortType)}>{text}</MenuItem>
    }
    return (
        <div style={{float: "right"}}>
            <Button style={{marginTop: 15, marginRight: 15}} onClick={event => {
                setAnchorEl(event.currentTarget);
            }} endIcon={<SortIcon/>}>Sortierung</Button>
            <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {listItem("Titel - Aufsteigend", SORT_TYPE.TITLE)}
                {listItem("Titel - Absteigend", SORT_TYPE.TITLE_REVERSED, true)}
                {listItem("Hinzugefügt - Aufsteigend", SORT_TYPE.TIME)}
                {listItem("Hinzugefügt - Absteigend", SORT_TYPE.TIME_REVERSED)}
            </Menu>
            <Button style={{marginTop: 15}} onClick={event => {
                setOpen(true)
            }} endIcon={<SettingsIcon/>}>Einstellungen</Button>
            {new DialogBuilder(open, setOpen)
                .setTitle("UI Einstellungen")
                .setText("Die Qualität der Vorschaubilder und die Schrittweite der zu ladenen Bilder")
                .setContent(dialogBuilder => {
                    return (
                        <div>
                            <Slider
                                style={{width: "95%", ...margin(30, 15, 15)}}
                                defaultValue={context.imageResolution}
                                getAriaValueText={value => `${value} Pixel`}
                                aria-labelledby="discrete-slider-small-steps"
                                step={50}
                                min={50}
                                max={500}
                                onChange={(event, value) => resolution = (value as number)}
                                marks={[
                                    {
                                        value: 50,
                                        label: 'Klein',
                                    },
                                    {
                                        value: 200,
                                        label: 'Mittel',
                                    },
                                    {
                                        value: 400,
                                        label: 'Groß',
                                    },
                                    {
                                        value: 500,
                                        label: 'Full',
                                    },
                                ]}
                                valueLabelDisplay="on"
                            />
                            <Typography>Auflösung</Typography>
                            <Slider
                                style={{width: "95%", ...margin(50, 15, 15)}}
                                defaultValue={context.stepDistance}
                                getAriaValueText={value => `${value} Elemente`}
                                aria-labelledby="discrete-slider-small-steps"
                                step={12}
                                min={12}
                                max={96}
                                onChange={(event, value) => stepDistance = (value as number)}
                                marks={[
                                    {
                                        value: 12,
                                        label: 'Min',
                                    },
                                    {
                                        value: 24,
                                        label: 'Klein',
                                    },
                                    {
                                        value: 48,
                                        label: 'Mittel',
                                    },
                                    {
                                        value: 72,
                                        label: 'Groß',
                                    },
                                    {
                                        value: 96,
                                        label: 'Max',
                                    },
                                ]}
                                valueLabelDisplay="on"
                            />
                            <Typography>Schrittweite</Typography>
                            {/*<FormControlLabel*/}
                            {/*    control={*/}
                            {/*        <Switch*/}
                            {/*            checked={checked}*/}
                            {/*            onChange={(event, checked) => {*/}
                            {/*                context.unloadImages = checked;*/}
                            {/*                setChecked(checked);*/}
                            {/*                localStorage.setItem(context.UNLOAD_IMAGES, `${checked}`)*/}
                            {/*            }}*/}
                            {/*            name="checkedB"*/}
                            {/*            color="primary"*/}
                            {/*        />*/}
                            {/*    }*/}
                            {/*    label="Bilder automatisch entladen"*/}
                            {/*/>*/}
                        </div>
                    )
                })
                .addButton("Abbrechen")
                .addButton({
                    label: "Ok",
                    isActionButton: true, onClick: dialogBuilder => {
                        if (context.imageResolution !== resolution) {
                            context.imageResolution = resolution;
                            localStorage.setItem(context.IMAGE_RESOLUTION, `${resolution}`);
                            reloadImages(context);
                        }
                        if (context.stepDistance !== stepDistance) {
                            context.stepDistance = stepDistance;
                            localStorage.setItem(context.STEP_DISTANCE, `${stepDistance}`);
                            reloadImages(context);
                        }
                    },
                })
                .build()}
        </div>
    )
}

function GridList({context, filteredArticleArray}: { context: AlbumOverview, filteredArticleArray: Article[] }): JSX.Element {

    // const [{hasMore, count}, setState] = useState(initialState);
    // const [hasMore, setHasMore] = useState(true);
    // const [count, setCount] = useState(24);
    const [dummy, setDummy] = useState(0);
    const step = context.stepDistance;
    let shortedFilteredArticleArray: Article[];

    const fetchMoreData = () => {
        if (articleArray[0].id === -2)
            return;

        if (shortedFilteredArticleArray.length >= filteredArticleArray.length) {
            context.hasMore = false;
            setDummy(dummy + 1);
            return;
        }

        if (context.maxVisible + step >= filteredArticleArray.length) {
            context.maxVisible = filteredArticleArray.length;
            context.hasMore = false;
            setDummy(dummy + 1);
        } else {
            context.maxVisible += step;
            setDummy(dummy + 1);
        }
    };

    shortedFilteredArticleArray = filteredArticleArray.slice(0, context.maxVisible);

    return (
        <InfiniteScroll
            style={{width: "100%"}}
            dataLength={shortedFilteredArticleArray.length}
            next={fetchMoreData}
            hasMore={context.hasMore}
            loader={<h4 style={{color: "rgba(0, 0, 0, 0.54)", marginTop: 15}}>Laden...</h4>}
            endMessage={
                <p style={{textAlign: "center", color: "rgba(0, 0, 0, 0.54)", marginTop: 75}}>
                    <b>Keine weiteren Produkte ferfügbar</b>
                </p>
            }>
            <Grid container spacing={4}
                  style={{width: "100%"}}
            >
                {shortedFilteredArticleArray.map((article) => (
                    <ArticleComponent context={context} article={article}/>
                ))}
            </Grid>
        </InfiniteScroll>
    )
}

function reloadImages(context: AlbumOverview) {
    context.imageReloadArray.forEach(reload => reload())
}

function ArticleComponent(props: any) {
    const classes = useStyles();
    let article: Article = props.article;
    let context: AlbumOverview = props.context;
    let isDummy: boolean = article.id === -2;
    if (isDummy) {
        return (
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <Card className={classes.card}>
                    <CardMedia className={classes.cardMedia}/>
                    <CardContent className={classes.cardContent}>
                        <Grid container justify={"flex-end"}>
                            <Grid item xs={12}>
                                <Typography gutterBottom variant="h5" component="h2"
                                            style={{backgroundColor: "lightgrey"}}>
                                    {article.title}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container justify={"space-between"}>
                                    <Grid item xs={5}>
                                        <Typography style={{backgroundColor: "lightgrey"}}>
                                            {article.description}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={5}>
                                        <Typography style={{backgroundColor: "lightgrey"}}>
                                            {article.description}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item style={{width: "20%"}}>
                                <Typography
                                    style={{
                                        backgroundColor: "lightgrey",
                                        marginTop: 5,
                                        justifySelf: "end"
                                    }}>
                                    {article.description}
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        )
    } else {
        return (
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <CardActionArea component={Link} to={(location: any) => {
                    location.pathname = "/articleView";

                    location.state = {article: article};

                    return location;
                }}>
                    <Card className={classes.card}>
                        <LazyImage
                            returnMode={RETURN_MODE.CARD_MEDIA}
                            alt={article.title}
                            className={classes.cardMedia}
                            payload={article}
                            getSrc={setImgSrc => {
                                if (article.picture && article.picture) {
                                    setImgSrc(base64ToDataUri(article.picture))
                                } else {
                                    loadSingleImage("article", article.id, imageResponse => {
                                        if (imageResponse)
                                            setImgSrc(base64ToDataUri(imageResponse.file));
                                    }, context.imageResolution);
                                }
                            }}
                            reload={reload => context.imageReloadArray.push(reload)}
                        />
                        <CardContent className={classes.cardContent}>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        {article.title}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container spacing={2}>
                                        <Grid item xs>
                                            <Typography>
                                                {article.artists.name}
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography style={{textAlign: "end"}}>
                                                {article.genre.name}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography style={{textAlign: "end"}}>
                                        {article.price + " €"}
                                    </Typography>
                                </Grid>
                            </Grid>
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
            id: -2,
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