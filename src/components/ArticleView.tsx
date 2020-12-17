import React from 'react'
import {Button, Card, Grid, Typography} from "@material-ui/core";
import MenuDrawer from "./MenuDrawer";
import {isMobile, padding, showToast} from "../Utilities/Utilities";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import {
    alignCenter,
    Article, base64ToDataUri,
    ContextType,
    hasCurrentUserRoleLevel,
    LazyImage,
    loadSingleImage
} from "../Utilities/TsUtilities";
import EditIcon from '@material-ui/icons/Edit';
import {useHistory} from "react-router-dom";
import {
    addToShoppingCart,
    getShoppingCartCount, isInShoppingCart
} from "../services/ShoppingCartUtil";

interface ArticleView_props {
    // @ts-ignore
    location: history.Location;
}

interface ArticleView_state {
}


class ArticleView extends React.Component<ArticleView_props, ArticleView_state> {

    article: Article;
    isDetails: boolean = false;

    constructor(props: ArticleView_props, context: any) {
        super(props, context);
        if (this.props.location.state) {
            this.article = this.props.location.state.article;
            this.isDetails = this.props.location.state.isDetails
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
                price: "16.20",
                ean: 12345678,
                picture: "",
                description: "test Api - provides basic test Functions and example Data. test Api - provides basic test Functions and example Data. test Api - provides basic test Functions and example Data"
            }
        }
        window.scrollTo(0, 0);
    }

    render() {
        return (
            <MenuDrawer>
                <div style={{
                    marginTop: 8,
                    display: 'flex',
                    justifyContent: 'center'
                }} className={"mobile"}>
                    <Grid container
                          style={{width: isMobile() ? '100%' : '85%', maxWidth: "800px"}}
                          spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h2" align={"center"}>
                                {this.article.title}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Card style={padding(18)}>
                                <Grid container spacing={2}>
                                    <Grid item md={4} xs={12} style={alignCenter(false, true)}>
                                        <LazyImage
                                            style={{
                                                width: 250,
                                                height: 250,
                                                backgroundColor: "lightgrey"
                                            }}
                                            className={"articleView-image"}
                                            rounded
                                            alt={this.article.title}
                                            getSrc={setImgSrc => {
                                                if (this.isDetails) {
                                                    if (this.article.picture)
                                                        setImgSrc(base64ToDataUri(this.article.picture))
                                                } else
                                                    loadSingleImage("article", this.article.id, setImgSrc)
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={8} xs={12}>
                                        <Card className={"articleView-infoCard"} style={{...padding(18), minHeight: 250}}>
                                            <Grid container spacing={2}>
                                                <Grid item md={6} xs={12}>
                                                    <Grid container spacing={2}>
                                                        <Grid item md={12} xs={4}>
                                                            <Typography variant="h4"
                                                                        align={"left"}>
                                                                Artist:
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item md={12} xs={8}>
                                                            <Typography variant="h5"
                                                                        align={"left"}>
                                                                {this.article.artists.name}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid item md={6} xs={12}>
                                                    <Grid container spacing={2}>
                                                        <Grid item md={12} xs={4}>
                                                            <Typography variant="h4"
                                                                        align={"left"}>
                                                                Genre:
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item md={12} xs={8}>
                                                            <Typography variant="h5"
                                                                        align={"left"}>
                                                                {this.article.genre.name}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid item md={6} xs={12}>
                                                    <Grid container style={{alignItems: "center"}}
                                                          spacing={1}>
                                                        <Grid item md={12} xs={4}>
                                                            <Typography variant="h4"
                                                                        align={"left"}>
                                                                Preis:
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item md={12} xs={8}>
                                                            <Typography variant="h5"
                                                                        align={"left"}>
                                                                {this.article.price + " €"}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Card>
                                    </Grid>
                                    {!this.isDetails &&
                                    <Grid item xs={12}>
                                        <div style={{float: "right"}}>
                                            <Button variant="contained" color="primary"
                                                    endIcon={<ShoppingCartIcon/>}
                                                    onClick={(event) => {
                                                        addToShoppingCart(this.article)
                                                        this.forceUpdate();
                                                        showToast(`Artikel Erfolgreich hinzugefügt (${getShoppingCartCount(this.article)})`, "success");
                                                    }}>
                                                {isInShoppingCart(this.article) ?
                                                    "Erneut in den Einkaufswagen legen" :
                                                    "Artikel in den Einkaufswagen hinzufügen"}
                                            </Button>
                                        </div>
                                    </Grid>}
                                    {this.article.description &&
                                    <Grid item xs={12}>
                                        <Card style={padding(18)}>
                                            <Typography variant="h6" align={"left"}>
                                                {this.article.description}
                                            </Typography>
                                        </Card>
                                    </Grid>}
                                    <EditButton
                                        context={this}/>
                                </Grid>
                            </Card>
                        </Grid>
                    </Grid>
                </div>
            </MenuDrawer>
        )
    }

}

/**
 * Component for rendering edit button
 * @param {ArticleView} context
 * @return {JSX.Element} editButton
 */
function EditButton({context}: ContextType<ArticleView>) {
    const history = useHistory();
    if (hasCurrentUserRoleLevel() && !context.isDetails) {
        return (
            <Grid item xs={12}>
                <div style={{float: "right"}}>
                    <Button variant="contained" color="primary" endIcon={<EditIcon/>}
                            onClick={event => {
                                history.push("/editArticles", {article: context.article})
                            }}>
                        {"Artikel bearbeiten"}
                    </Button>
                </div>
            </Grid>
        )
    } else {
        return null;
    }
}

export default ArticleView;