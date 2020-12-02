import React from "react";
import {
    Article,
    base64ToDataUri,
    callIfExists,
    LazyImage,
    loadSingleImage
} from "../Utilities/TsUtilities";
import {Button, Grid, IconButton, Typography} from "@material-ui/core";
import AddIcon from '@material-ui/icons/AddCircleOutline';
import RemoveIcon from '@material-ui/icons/RemoveCircleOutline';
import DeleteIcon from '@material-ui/icons/Delete';
import {Link} from "react-router-dom";
import {margin, showToast} from "../Utilities/Utilities";

const SHOPPING_CART: string = "SHOPPING_CART";
const emptyShoppingCart: ShoppingCartObject = {entries: []};

export interface ShoppingCartObject {
    entries: ShoppingCartEntry[]
}

export interface ShoppingCartEntry {
    article: Article;
    count: number;
}

//  ------------------------- Internal ------------------------->
function apply() {
    // localStorage.removeItem(SHOPPING_CART)
    let item = localStorage.getItem(SHOPPING_CART);
    if (!item)
        localStorage.setItem(SHOPPING_CART, JSON.stringify(emptyShoppingCart));
}

apply();

// ---------------

export function getShoppingCartObject(): ShoppingCartObject {
    let item = localStorage.getItem(SHOPPING_CART);
    if (item)
        return JSON.parse(item);
    else
        return emptyShoppingCart
}

function saveShoppingCartObject(shoppingCartObject: ShoppingCartObject) {
    localStorage.setItem(SHOPPING_CART, JSON.stringify(shoppingCartObject))
}

function getShoppingCartEntry(article: Article, shoppingCartObject?: ShoppingCartObject): ShoppingCartEntry | null {
    if (!shoppingCartObject)
        shoppingCartObject = getShoppingCartObject();
    for (const entry of shoppingCartObject.entries) {
        if (entry.article.id === article.id)
            return entry;
    }
    return null;
}

//  <------------------------- Internal -------------------------


//  ------------------------- Add and Remove ------------------------->
export enum AAR_RETURN_TYPE {
    ADDED, REMOVED, INCREASED, DECREASED, NULL
}

export function addToShoppingCart(article: Article): AAR_RETURN_TYPE {
    let shoppingCartObject = getShoppingCartObject();
    let shoppingCartEntry = getShoppingCartEntry(article, shoppingCartObject);
    let returnValue: AAR_RETURN_TYPE;
    if (shoppingCartEntry) {
        shoppingCartEntry.count += 1;
        returnValue = AAR_RETURN_TYPE.INCREASED;
    } else {
        shoppingCartObject.entries.push({article: article, count: 1});
        returnValue = AAR_RETURN_TYPE.ADDED;
    }
    saveShoppingCartObject(shoppingCartObject);
    return returnValue;
}

export function removeFromShoppingCart(article: Article): AAR_RETURN_TYPE {
    let shoppingCartObject = getShoppingCartObject();
    let shoppingCartEntry = getShoppingCartEntry(article, shoppingCartObject);
    let returnValue: AAR_RETURN_TYPE;
    if (!shoppingCartEntry)
        return AAR_RETURN_TYPE.NULL;
    if (shoppingCartEntry.count > 1) {
        shoppingCartEntry.count -= 1;
        returnValue = AAR_RETURN_TYPE.DECREASED;
    } else {
        shoppingCartObject.entries = shoppingCartObject.entries.filter(entry => entry.article.id !== article.id);
        returnValue = AAR_RETURN_TYPE.REMOVED;
    }
    saveShoppingCartObject(shoppingCartObject);
    return returnValue;
}

//  <------------------------- Add and Remove -------------------------


//  ------------------------- Convenience ------------------------->
export function isInShoppingCart(article: Article): boolean {
    for (const entry of getShoppingCartObject().entries) {
        if (article.id === entry.article.id)
            return true;
    }
    return false;
}

export function clearShoppingCart() {
    localStorage.setItem(SHOPPING_CART, JSON.stringify(emptyShoppingCart))
}

//  <------------------------- Convenience -------------------------


//  ------------------------- getters ------------------------->
export function getShoppingCartCount(article?: Article): number {
    if (article) {
        let entry = getShoppingCartEntry(article);
        if (entry)
            return entry.count;
        else
            return 0;
    } else {
        let allCount = 0;
        for (const entry of getShoppingCartObject().entries)
            allCount += entry.count;
        return allCount;
    }
}

export function getShoppingCartPrice(article?: Article): string {
    let result: number;
    if (article) {
        let entry = getShoppingCartEntry(article);
        if (entry)
            result = +entry.article.price * entry.count;
        else
            result = -1;
    } else {
        let allPrice = 0;
        for (const entry of getShoppingCartObject().entries)
            allPrice += +entry.article.price * entry.count;
        result = allPrice;
    }
    return result.toFixed(2);
}

export function isShoppingCartEmpty(): boolean {
    return getShoppingCartObject().entries.length === 0;
}

// ---------------

export function getAllShoppingCartEntries(): ShoppingCartEntry[] {
    return getShoppingCartObject().entries
}

export function getAllShoppingCartArticles(): Article[] {
    return getAllShoppingCartEntries().map(entry => entry.article)
}

//  <------------------------- getters -------------------------


//  ------------------------- List ------------------------->
interface ShoppingCartList_props {
    showChangeCount: boolean;
    update?: () => void;
    shoppingCart: any;
}

export class ShoppingCartList extends React.Component<ShoppingCartList_props, {}> {

    entryArray: ShoppingCartEntry[]
    update?: () => void;
    totalPriceWithoutShipping: number

    constructor(props: ShoppingCartList_props, context: any) {
        super(props, context);
        this.totalPriceWithoutShipping = 0;
        if (this.props.shoppingCart) {
            this.entryArray = this.props.shoppingCart
            // @ts-ignore
            this.props.shoppingCart.map((item) =>
                this.totalPriceWithoutShipping = this.totalPriceWithoutShipping + (parseFloat(item.count) * parseFloat(item.article.price))
            );
            console.log(this.totalPriceWithoutShipping)
        } else {
            this.entryArray = getAllShoppingCartEntries();
        }
        this.update = props.update;
    }

    componentWillUpdate(nextProps: Readonly<ShoppingCartList_props>, nextState: Readonly<{}>, nextContext: any) {
        // debugger
        if (this.props.shoppingCart) {
            this.entryArray = this.props.shoppingCart
        } else {
            this.entryArray = getAllShoppingCartEntries();
        }
    }

    render() {
        return (
            <Grid container spacing={2}>
                {
                    this.entryArray.map((entry, index) => {
                        return <ShoppingCartListItem update={() => callIfExists(this.update)}
                                                     entry={entry} index={index}
                                                     showChangeCount={this.props.showChangeCount}
                                                     isDetails={!!this.props.shoppingCart}/>
                    })
                }
            </Grid>
        )
    }
}

interface ShoppingCartListItem_props {
    isDetails: boolean;
    entry: ShoppingCartEntry;
    index: number;
    showChangeCount: boolean;
    update: () => void;
}

class ShoppingCartListItem extends React.Component<ShoppingCartListItem_props, {}> {
    isDetails: boolean
    entry: ShoppingCartEntry
    index: number
    showChangeCount: boolean
    article: Article;
    update: () => void;
    count: number;
    price: number;

    constructor(props: ShoppingCartListItem_props, context: any) {
        console.log(JSON.stringify(props))
        super(props, context);
        this.isDetails = props.isDetails;
        this.entry = props.entry;
        this.index = props.index;
        this.showChangeCount = props.showChangeCount;
        this.article = this.entry.article;
        this.update = props.update;
        this.count = this.isDetails ? props.entry.count : getShoppingCartCount(this.article);
        this.price = this.isDetails ? (parseFloat(props.entry.article.price)*props.entry.count) : parseFloat(getShoppingCartPrice(this.article));
    }

    componentWillUpdate(nextProps: Readonly<ShoppingCartListItem_props>, nextState: Readonly<{}>, nextContext: any) {
        this.isDetails = nextProps.isDetails;
        this.entry = nextProps.entry;
        this.index = nextProps.index;
        this.showChangeCount = nextProps.showChangeCount;
        this.article = this.entry.article;
        this.update = nextProps.update;
        this.count = this.isDetails ? nextProps.entry.count : getShoppingCartCount(this.article);
        this.price = this.isDetails ? (parseFloat(nextProps.entry.article.price)*nextProps.entry.count) : parseFloat(getShoppingCartPrice(this.article));
    }

    render() {
        let sCc = this.showChangeCount;
        return (
            <Grid item xs={12}
                  style={{borderRadius: "4px", ...(this.index % 2 === 1 ? {backgroundColor: "rgba(0,0,0,0.05)"} : {})}}>
                <Grid container>
                    <Grid item>
                        <div style={{
                            display: "flex",
                            height: "100%",
                            alignItems: "center"
                        }}>

                            <LazyImage
                                getSrc={setImgSrc => {
                                    if (this.isDetails) {
                                        if (this.article.picture)
                                            { // @ts-ignore
                                                setImgSrc(base64ToDataUri(this.article.picture))
                                            }
                                    } else
                                        loadSingleImage("article", this.article.id, setImgSrc, 100)
                                }}
                                payload={this.article}
                                shouldImageUpdate={(oldPayload: Article, newPayload: Article) => {
                                    return oldPayload.id !== newPayload.id;
                                }}
                                rounded
                                className={"no-print"}
                                style={{
                                    width: 75,
                                    height: 75,
                                    backgroundColor: "lightgray",
                                    marginRight: 18,
                                }}/>
                        </div>
                    </Grid>
                    <Grid item lg={sCc ? 3 : 4} md={8} sm={8}>
                        <div style={margin(0, 20, 0, 0)}>
                            <Grid container style={{height: "100%", ...margin(0, 20, 0, 0)}}
                                  direction={"column"}>
                                <Grid item>
                                    <Typography variant="h6" style={{color: "rgba(0,0,0,0.87)"}}
                                                gutterBottom to={(location: any) => {
                                        location.pathname = "/articleView";
                                        location.state = {article: this.article, isDetails: this.isDetails};
                                        return location;
                                    }} component={Link}>
                                        {this.article.title}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="body1" gutterBottom>
                                        {(+this.article.price).toFixed(2)} €
                                    </Typography>
                                </Grid>
                            </Grid>
                        </div>
                    </Grid>
                    <Grid item lg={sCc ? 2 : 3} md={sCc ? 4 : 5} sm={sCc ? 4 : 5}>
                        <div style={margin(0, 20, 0, 0)}>
                            <Grid container style={{height: "100%", ...margin(0, 20, 0, 0)}}
                                  direction={"column"}>
                                <Grid item>
                                    <Typography variant="body1" style={{marginBottom: 15}}>
                                        {this.article.artists.name}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="body1" gutterBottom>
                                        {this.article.genre.name}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </div>
                    </Grid>
                    <Grid item lg={3} md={sCc ? 4 : 5} sm={sCc ? 4 : 5}>
                        <div style={margin(0, 20, 0, 0)}>
                            <Grid container style={{height: "100%", ...margin(0, 20, 0, 0)}}
                                  direction={"column"}>
                                <Grid item>
                                    <Typography variant="body1" style={{marginBottom: 15}}>
                                        Stück: {this.count}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="body1" gutterBottom>
                                        Gesamt: {(this.price).toFixed(2)} €
                                    </Typography>
                                </Grid>
                            </Grid>
                        </div>
                    </Grid>
                    {this.showChangeCount &&
                    <Grid item lg={2} md={3} sm={3}>
                        <ShoppingCartListItemButtons update={() => this.update()}
                                                     article={this.article}/>
                    </Grid>}
                </Grid>
            </Grid>
        )
    }

}

interface ShoppingCartListItemButtons_props {
    article: Article;
    update: () => void;
}

class ShoppingCartListItemButtons extends React.Component<ShoppingCartListItemButtons_props, {}> {
    article: Article;
    count: number;
    update: () => void;


    constructor(props: ShoppingCartListItemButtons_props, context: any) {
        super(props, context);
        this.article = props.article;
        this.update = props.update;
        this.count = getShoppingCartCount(this.article);
    }

    componentWillUpdate(nextProps: Readonly<ShoppingCartListItemButtons_props>, nextState: Readonly<{}>, nextContext: any) {
        this.article = nextProps.article;
        this.update = nextProps.update;
        this.count = getShoppingCartCount(this.article);
    }

    render() {
        return (
            <div style={{
                display: "flex",
                height: "100%",
                alignItems: "center"
            }}>
                <Grid container>
                    <Grid item>
                        <IconButton onClick={event => {
                            removeFromShoppingCart(this.article);
                            if (getShoppingCartCount(this.article) === 0)
                                showToast("Artikel wurde aus dem Einkaufswagen entfernt", "success");
                            this.update();
                        }} color={"secondary"}>{this.count > 1 ? <RemoveIcon/> :
                            <DeleteIcon/>}</IconButton>
                    </Grid>
                    <Grid item>
                        <IconButton onClick={event => {
                            addToShoppingCart(this.article);
                            this.update();
                        }} color={"primary"}>{<AddIcon/>}</IconButton>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

//  <------------------------- List -------------------------