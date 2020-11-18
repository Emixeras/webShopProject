import React from 'react'
import { Grid, Card, TextField, Button, Typography, hexToRgb, IconButton } from "@material-ui/core";
import MenuDrawer from "./MenuDrawer";
import { addDrawerCallback, isDrawerVisible, removeDrawerCallback } from "../services/StorageUtil";
import { padding, showToast } from "../Utilities/Utilities";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { Article, loadSingleImage, LazyImage, base64ToDataUri } from "../Utilities/TsUtilities";

interface IProps {
    // @ts-ignore
    location: history.Location;
}

interface IState {
}


class ArticleView extends React.Component<IProps, IState> {

    drawerState: boolean = isDrawerVisible();
    article: Article;

    drawerCallback = (state: boolean) => {
        this.drawerState = state;
        this.forceUpdate()
    };

    constructor(props: IProps, context: any) {
        super(props, context);
        if (this.props.location.state) {
            this.article = this.props.location.state.article;
        } else {
            this.article = {
                id: 1,
                title: "The Show Must Go On",
                artists: {
                    id: 1,
                    name: "Rammstein"
                },
                genre: {
                    id: 1,
                    name: "Rock"
                },
                price: "16.20€",
                ean: 12345678,
                picture: {
                    id: 1,
                    data: ""
                },
                description: "test Api - provides basic test Functions and example Data. test Api - provides basic test Functions and example Data. test Api - provides basic test Functions and example Data"
            }
        }
        addDrawerCallback(this.drawerCallback);
    }

    render() {
        return (

            <div>
                <MenuDrawer />
                <div style={{
                    marginTop: 8,
                    marginInlineStart: (this.drawerState ? 240 : 0),
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <Grid container
                        style={{ width: '85%', maxWidth: "800px" }}
                        spacing={3}>
                        <Grid item sm={12}>
                            <Typography component="h1" variant="h2" align={"center"}>
                                {this.article.title}
                            </Typography>
                            <Card style={padding(18)}>
                                <Grid container spacing={2}>
                                    {this.article.picture &&
                                        <Grid item md={4} sm={12}>
                                            <LazyImage
                                                style={{width:250, height:250, backgroundColor:"lightgrey"}}
                                                rounded
                                                alt={this.article.title}
                                                getSrc={setImgSrc => {
                                                    loadSingleImage(this.article.id, imageResponse => {
                                                        if (imageResponse) {
                                                            setImgSrc(base64ToDataUri(imageResponse.file))
                                                        }
                                                    })
                                                }}
                                            />

                                        </Grid>}
                                    <Grid item md={8} sm={12}>
                                        <Card style={{...padding(18), minHeight:250}}>
                                            <Grid container spacing={2}>
                                                <Grid item md={8} sm={12}>
                                                    <Typography component="h1" variant="h4" align={"left"}>
                                                        {"Artist:"}
                                                    </Typography>
                                                </Grid>
                                                <Grid item md={4} sm={12}>
                                                    <Typography component="h1" variant="h4" align={"left"}>
                                                        {"Genre:"}
                                                    </Typography>
                                                </Grid>
                                                <Grid item md={8} sm={12}>
                                                    <Typography component="h1" variant="h5" align={"left"}>
                                                        {this.article.artists.name}
                                                    </Typography>
                                                </Grid>
                                                <Grid item md={4} sm={12}>
                                                    <Typography component="h1" variant="h5" align={"left"}>
                                                        {this.article.genre.name}
                                                    </Typography>
                                                </Grid>
                                                <Grid item md={6} sm={12}>
                                                    <Grid container style={{ alignItems: "center" }} spacing={1}>
                                                        <Grid item xs={12}>
                                                            <Typography component="h1" variant="h4" align={"left"}>
                                                                {"Preis:"}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item sm={12}>
                                                            <Typography component="h1" variant="h5" align={"left"}>
                                                                {this.article.price}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Card>
                                    </Grid>
                                    <Grid item sm={12}>
                                        <div style={{float:"right"}}>
                                        <Button variant="contained" color="primary" endIcon={<ShoppingCartIcon />}
                                            onClick={(event) => {
                                                showToast("Artikel Erfolgreich hinzugefügt", "success");
                                            }}>
                                            {"Artikel in den Warenkorb hinzufügen"}
                                        </Button>
                                        </div>
                                    </Grid>
                                    {this.article.description &&
                                        <Grid item sm={12}>
                                            <Card style={padding(18)}>
                                                <Typography component="h1" variant="h6" align={"left"}>
                                                    {this.article.description}
                                                </Typography>
                                            </Card>
                                        </Grid>}
                                </Grid>
                            </Card>
                        </Grid>
                    </Grid>
                </div>
            </div>
        )
    }
    
    componentWillUnmount() {
        removeDrawerCallback(this.drawerCallback)
    }
}
export default ArticleView;