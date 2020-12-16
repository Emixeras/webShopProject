import React, {useState} from "react";
import {Card, CardMedia, Grid, Link, Typography} from "@material-ui/core";
import {padding, showToast} from "../Utilities/Utilities";
import {getSessionUser} from "../services/StorageUtil";
import {useHistory} from "react-router-dom";
import {logoutUser} from "../services/UserApiUtil";
import MenuDrawer from "../components/MenuDrawer";

//  ------------------------- Tuple ------------------------->
/**
 * A construct for holding two connected values
 */
export class Pair<A, B> {
    public first: A;
    public second: B;


    constructor(first: A, second: B) {
        this.first = first;
        this.second = second;
    }

    static make<A, B>(first: A, second: B): Pair<A, B> {
        return new Pair(first, second);
    }
}

/**
 * A construct for holding three connected values
 */
export class Triple<A, B, C> {
    public first: A;
    public second: B;
    public third: C;


    constructor(first: A, second: B, third: C) {
        this.first = first;
        this.second = second;
        this.third = third;
    }

    static make<A, B, C>(first: A, second: B, third: C): Triple<A, B, C> {
        return new Triple(first, second, third);
    }
}
//  <------------------------- Tuple -------------------------


//  ------------------------- Types ------------------------->
/**
 * A parameter type that contains the context of another component
 */
export interface ContextType<T> {
    context: T;
}

/**
 * The scheme of an article
 */
export interface Article {
    id: number;
    title: string;
    description: string;
    ean: number;
    price: string;
    artists: ArtistOrGenre;
    genre: ArtistOrGenre;
    picture?: string;
}

/**
 * The scheme of an artist or genre
 */
export interface ArtistOrGenre {
    id: number;
    name: string;
    file?: string;
}

/**
 * The scheme of an imageResponse
 */
export interface ImageResponseType {
    article: Article;
    file: string;
}

/**
 * The scheme of an user
 */
export interface User {
    id: number;
    birth: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    role: string;
    postalCode?: number;
    street?: string;
    streetNumber?: number;
    title?: string;
    town?: string;
}

/**
 * All supported user roles
 */
export enum ROLES {
    USER, EMPLOYEE, ADMIN
}
//  <------------------------- Types -------------------------


//  ------------------------- Values ------------------------->
export const textColor = "rgba(0, 0, 0, 0.87)";

export const roleMap = {
    USER: 0,
    EMPLOYEE: 1,
    ADMIN: 2,
    "0": 0,
    "1": 1,
    "2": 2,
};
//  <------------------------- Values -------------------------


//  ------------------------- Image ------------------------->
/**
 * Transforms a base64 data string to be converted to a data uri
 * @param base64
 */
export function base64ToDataUri(base64: string): string {
    var mime;
    if (base64.startsWith("iVBORw0KGgo"))
        mime = "image/png";
    else if (base64.startsWith("/9j/4AAQSkZJRg"))
        mime = "image/jpeg";
    return `data:${mime};base64,${base64}`
}

interface ImageResponseFunction {
    (imageResponse?: ImageResponseType): void
}

/**
 * The central method for loading an image for an article, artist or genre
 * @param type The type of the target endpoint
 * @param id The id of the object to be loaded
 * @param onFinish A callback that is called when the data is loaded; the loaded data is the parameter
 * @param [imageResolution] An optional parameter to select a specific resolution
 */
export function loadSingleImage(type: "article" | "artist" | "genre", id: number, onFinish: (ImageResponseFunction | Function), imageResolution?: number) {
    let request: string;
    if (imageResolution !== undefined)
        request = `http://${window.location.hostname}:8080/${type}/range;start=${id};end=${id};quality=${imageResolution ? imageResolution : 250}`
    else
        request = `http://${window.location.hostname}:8080/${type}/${id}`;

    fetch(new Request(request, {method: 'GET'}))
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error(`Fehler bei der Anfrage: ${response.status} ${response.statusText}`);
            }
        })
        .then((response: ImageResponseType) => {
            if (onFinish.name === "setImgSrc") {
                // @ts-ignore
                onFinish(base64ToDataUri(response.file))
            } else
                onFinish(response)
        })
        .catch(reason => {
            showToast(reason.message, "error")
        })
}

// ---------------
/* Credit: https://slashgear.github.io/creating-an-image-lazy-loading-component-with-react/*/

const placeHolder = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

interface LazyImageProperties {
    getSrc: (setImgSrc: ((result: string) => void), payload: any) => void;
    alt?: string;
    reload?: (reload: () => void) => void
    style?: React.CSSProperties;
    className?: string
    autoUnloadImages?: boolean;
    returnMode?: RETURN_MODE;
    loadImageMode?: LOAD_IMAGE_MODE;
    shouldImageUpdate?: ((oldPayload: any, newPayload: any) => boolean) | boolean;
    payload?: any;
    imageRef?: any;
    rounded?: boolean | string | "circle" | "small" | "medium" | "large";
    id?: string
}

interface LazyImageState {
    imageSrc: string;
    alt?: string;
}

export enum RETURN_MODE {
    CARD_MEDIA, IMG
}

export enum LOAD_IMAGE_MODE {
    ON_VISIBLE, ALWAYS
}

/**
 * A custom component that simplifies the performant loading of an image
 */
export class LazyImage extends React.Component<LazyImageProperties, LazyImageState> {
    imageSrc: string = placeHolder;
    // @ts-ignore
    getSrc: (onResult: ((result: string) => void), payload: any) => void;
    alt?: string;
    reload?: (reload: () => void) => void;
    style?: React.CSSProperties;
    className?: string;
    returnMode?: RETURN_MODE;
    loadImageMode?: LOAD_IMAGE_MODE;
    shouldImageUpdate?: ((oldPayload: any, newPayload: any) => boolean) | boolean;
    payload?: any;
    imageRef?: Element = undefined;
    initialLoad: boolean = true;
    observer?: IntersectionObserver;
    rounded?: boolean | string | "circle" | "small" | "medium" | "large";
    id?: string

    constructor(props: LazyImageProperties, context: any) {
        super(props, context);
        this.updateVariables(props);
        if (this.reload)
            this.reload(() => {
                if (this.loadImageMode === LOAD_IMAGE_MODE.ON_VISIBLE) {
                    this.imageSrc = placeHolder;
                    this.applyIntersectionObserver();
                } else
                    this.loadImage();
            });
    }

    applyIntersectionObserver() {
        let didCancel = false;

        if (this.imageRef /*&& this.imageSrc === placeHolder*/) {
            if (this.observer)
                this.observer.disconnect();
            if (IntersectionObserver) {
                this.observer = new IntersectionObserver(
                    entries => {
                        entries.forEach(entry => {
                            if (!didCancel && (entry.intersectionRatio > 0 || entry.isIntersecting)) {
                                const that = this;
                                this.loadImage(function setImgSrc(result: string) {
                                        // @ts-ignore
                                        return that.observer.unobserve(that.imageRef);
                                    }
                                );
                            }
                        })
                    },
                    {
                        threshold: 0.01,
                        rootMargin: '75%',
                    }
                );
                this.observer.observe(this.imageRef)
            } else {
                this.loadImage();
            }
        }
    }

    private updateVariables(props: Readonly<LazyImageProperties>) {
        this.getSrc = props.getSrc;
        this.reload = props.reload;
        this.style = props.style;
        this.className = props.className;
        this.returnMode = props.returnMode;
        this.shouldImageUpdate = props.shouldImageUpdate;
        this.payload = props.payload;
        this.alt = props.alt;
        this.loadImageMode = orElse(props.loadImageMode, LOAD_IMAGE_MODE.ON_VISIBLE);
        this.rounded = props.rounded;
        this.id = props.id;
    }

    shouldComponentUpdate(nextProps: Readonly<LazyImageProperties>, nextState: Readonly<LazyImageState>, nextContext: any): boolean {
        if (this.shouldImageUpdate !== undefined && this.shouldImageUpdate !== false) {
            let shouldUpdate: boolean;
            if (this.shouldImageUpdate === true)
                shouldUpdate = this.payload !== nextProps.payload;
            else
                shouldUpdate = this.shouldImageUpdate(this.payload, nextProps.payload);
            this.updateVariables(nextProps);
            if (shouldUpdate) {
                this.loadImage();
            }
            return false;
        } else {
            this.updateVariables(nextProps);
            return true;
        }
    }

    componentDidMount(): void {
        if (this.initialLoad && this.loadImageMode === LOAD_IMAGE_MODE.ON_VISIBLE) {
            this.initialLoad = false;
            this.applyIntersectionObserver();
        }
    }

    componentWillUnmount(): void {
        if (this.observer)
            this.observer.disconnect()
    }

    private loadImage(onResult?: (result: string) => boolean | void) {
        const that = this;
        this.getSrc(function setImgSrc(result: string) {
            that.imageSrc = result;
            if (onResult)
                onResult(result);
            that.forceUpdate();
        }, this.payload)
    }

    render() {
        if (this.initialLoad && this.loadImageMode === LOAD_IMAGE_MODE.ALWAYS) {
            this.initialLoad = false;
            this.loadImage();
        }
        let borderRadius;
        switch (this.rounded) {
            default:
                if (this.rounded === false)
                    borderRadius = "";
                else
                    borderRadius = this.rounded;
                break;
            case true:
                borderRadius = "4px";
                break;
            case "circle":
                borderRadius = "50%";
                break;
            case "small":
                borderRadius = "5%";
                break;
            case "medium":
                borderRadius = "10%";
                break;
            case "large":
                borderRadius = "15%";
                break;

        }
        switch (this.returnMode) {
            default:
            case RETURN_MODE.CARD_MEDIA:
                return <CardMedia className={this.className}
                                  style={{borderRadius: borderRadius, ...this.style}}
                                  image={this.imageSrc}
                                  id={this.id}
                                  ref={element => {
                                      if (element) this.imageRef = element
                                  }}
                                  title={this.alt}/>;
            case RETURN_MODE.IMG:
                return <img className={this.className}
                            style={{borderRadius: borderRadius, ...this.style}}
                            src={this.imageSrc}
                            id={this.id}
                            ref={element => {
                                if (element) this.imageRef = element
                            }}
                            alt={this.alt}
                />;
        }

    }
}

// ---------------

interface ImageGrid_state {

}

interface ImageGrid_props {
    articleList?: Article[];
    imageList?: string[];
    style?: React.CSSProperties;
    rounded?: boolean | string | "circle" | "small" | "medium" | "large";
}

/**
 * A custom component that renders a grid of 1-4 images
 */
export class ImageGrid extends React.Component<ImageGrid_props, ImageGrid_state> {
    articleList?: Article[];
    imageList?: string[];
    style?: React.CSSProperties;
    rounded?: boolean | string | "circle" | "small" | "medium" | "large";

    constructor(props: ImageGrid_props, context: any) {
        super(props, context);

        this.setProps(props);
    }

    setProps(props: ImageGrid_props) {
        this.articleList = props.articleList;
        this.imageList = props.imageList;
        this.style = props.style;
        this.rounded = props.rounded;
    }

    render() {
        let borderRadius: any;
        switch (this.rounded) {
            default:
                if (this.rounded === false)
                    borderRadius = "";
                else
                    borderRadius = this.rounded;
                break;
            case true:
                borderRadius = "4px";
                break;
            case "circle":
                borderRadius = "50%";
                break;
            case "small":
                borderRadius = "5%";
                break;
            case "medium":
                borderRadius = "10%";
                break;
            case "large":
                borderRadius = "15%";
                break;
        }

        if (!this.imageList) {
            if (!this.articleList || this.articleList?.length === 0)
                return null;
            this.imageList = this.articleList?.filter(article => !!article.picture).map(article => (article.picture as string))
        }

        this.imageList = this.imageList?.slice(0, 4);

        const borderRadius_byIndex = (index: number): string => {
            let ret;
            switch (this.imageList?.length) {
                default:
                    return "0px";
                case 1:
                    return borderRadius;
                case 2:
                    return index === 0 ? `${borderRadius} ${0}px ${0}px ${borderRadius}` : `${0}px ${borderRadius} ${borderRadius} ${0}px`
                case 3:
                    switch (index) {
                        default:
                            ret = "0px";
                            break;
                        case 0:
                            ret = `${borderRadius} ${0}px ${0}px ${0}px`
                            break;
                        case 1:
                            ret = `${0}px ${borderRadius} ${0}px ${0}px`
                            break;
                        case 2:
                            ret = `${0}px ${0}px ${borderRadius} ${borderRadius}`
                            break;
                    }
                    return ret;
                case 4:
                    switch (index) {
                        default:
                            ret = "0px";
                            break;
                        case 0:
                            ret = `${borderRadius} ${0}px ${0}px ${0}px`
                            break;
                        case 1:
                            ret = `${0}px ${borderRadius} ${0}px ${0}px`
                            break;
                        case 2:
                            ret = `${0}px ${0}px ${0}px ${borderRadius}`
                            break;
                        case 3:
                            ret = `${0}px ${0}px ${borderRadius} ${0}px`
                            break;
                    }
                    return ret;
            }
        };

        const xs_byIndex = (index: number): number => {
            switch (this.imageList?.length) {
                case 1:
                    return 12;
                case 2:
                case 4:
                    return 6;
                case 3:
                    return index < 2 ? 6 : 12;
            }
            return 6;
        };

        return (
            <div style={{borderRadius, ...this.style}}>
                <Grid container style={matchParent(true, true)}>
                    {this.imageList?.map((file, index) => {
                        return (
                            //@ts-ignore
                            <Grid item xs={xs_byIndex(index)}>
                                {/*<LazyImage getSrc={setImgSrc => setImgSrc(base64ToDataUri(file))}/>*/}
                                <CardMedia
                                    style={{borderRadius: borderRadius_byIndex(index), ...matchParent(true, true)}}
                                    image={base64ToDataUri(file)}/>
                            </Grid>
                        )
                    })}
                </Grid>
            </div>
        );
    }
}
//  <------------------------- Image -------------------------


//  ------------------------- Logic ------------------------->
/**
 * The central method for testing a single article by  the advanced search
 * @param query The search query
 * @param article The article to be tested
 * @return {boolean} Does the article match the query
 */
export function filterArticle(query: string, article: Article): boolean {
    let subArray = query.split("&");
    let length = subArray.length;
    let found = 0;
    for (let sub of subArray) {
        sub = sub.trim();
        let type: boolean | string = sub.length > 1 && sub.charAt(1) === ":";
        if (type) {
            type = sub.substr(0, 1);
            sub = sub.substr(2).trim();
        }

        if (sub.length === 0 && length > 1) {
            if (++found >= length)
                return true;
            continue
        }

        if ((!type || type === "i") && article.id.toString().toLowerCase().includes(sub)) {
            if (++found >= length)
                return true;
        } else if ((!type || type === "t") && article.title.toLowerCase().includes(sub)) {
            if (++found >= length)
                return true;
        } else if ((!type || type === "a") && article.artists.name.toLowerCase().includes(sub)) {
            if (++found >= length)
                return true;
        } else if ((!type || type === "g") && article.genre.name.toLowerCase().includes(sub)) {
            if (++found >= length)
                return true;
        } else if ((!type || type === "d") && article.description && article.description.toLowerCase().includes(sub)) {
            if (++found >= length)
                return true;
        } else if ((!type || type === "e") && article.ean.toString().includes(sub)) {
            if (++found >= length)
                return true;
        } else if ((!type || type === "p")) {
            sub = sub.replaceAll(",", ".");
            if (sub.includes("-")) {
                let fromTo = sub.split("-");
                if ((article.price >= fromTo[0] || !fromTo[0]) && (article.price <= fromTo[1] || !fromTo[1])) {
                    if (++found >= length)
                        return true;
                }
            } else if (article.price == sub) {
                if (++found >= length)
                    return true;
            }
        }
    }
    return false;
}

/**
 * A simplified way of returning an element if it is defined, oderwise another value
 * @param input The object to be tested
 * @param orElse The object that is returned if the input is not defined
 */
export function orElse<T>(input: T, orElse: NonNullable<T> | (() => NonNullable<T>)): NonNullable<T> {
    if (input)
        return (input as NonNullable<T>);
    else {
        if (typeof orElse === "function")
            return (orElse as Function)();
        else
            return orElse;
    }
}

/**
 * If the input is defined the method transforms it; otherwise another value is returned
 * @param input The object to be tested
 * @param returnFunction The function to transform the input
 * @param orElse The object that is returned if the input is not defined
 */
export function ifExistsReturnOrElse<T, R>(input: T, returnFunction: (input: NonNullable<T>) => R, orElse: R | (() => R)): R {
    if (input)
        return returnFunction((input as NonNullable<T>));
    else {
        if (typeof orElse === "function")
            return (orElse as Function)();
        else
            return orElse;
    }
}

/**
 * If the input matches the value the method transforms it; otherwise another value is returned
 * @param input The object to be tested
 * @param value The value the input is compared to
 * @param returnFunction The function to transform the input
 * @param orElse The object that is returned if the input is not defined
 * @param reverse If true the input must not match the value
 */
export function ifValueReturnOrElse<T, R>(input: T, value: T, returnFunction: ((input: T) => R) | undefined, orElse: R | (() => R), reverse?: boolean): R {
    if ((reverse && input !== value) || (!reverse && input === value))
        if (returnFunction)
            return returnFunction(input);
        else
            // @ts-ignore
            return input;
    else {
        if (typeof orElse === "function")
            return (orElse as Function)();
        else
            return orElse;
    }
}

/**
 * A simplified way of testing if a input is equal to multiple values
 * @param input The input to be tested
 * @param ors An array of compare values
 * @return True if the input matches any value in ors
 */
export function boolOr<T>(input: T, ...ors: T[]): boolean {
    for (let or of ors) {
        if (input === or)
            return true;
    }
    return false;
}

// ---------------

/**
 * Checks if the current logged in user has a least the given roleLevel
 * @param level The minimum required roleLevel
 * @return True if the user has the the required roleLevel
 */
export function hasCurrentUserRoleLevel(level: "USER" | "EMPLOYEE" | "ADMIN" | number = "EMPLOYEE"): boolean {
    let user = getSessionUser();
    // @ts-ignore
    return user && roleMap[user.role] >= roleMap[level];
}
//  <------------------------- Logic -------------------------


//  ------------------------- Comparators ------------------------->
/**
 * A comparator for sorting articles
 * @param a
 * @param b
 */
export function article_comparator(a: Article, b: Article) {
    return name_comparator(a.title, b.title)
}

/**
 * A comparator for sorting artists, or genres
 * @param a
 * @param b
 */
export function artistOrGenre_comparator(a: ArtistOrGenre, b: ArtistOrGenre) {
    return name_comparator(a.name, b.name)
}

/**
 * A comparator for sorting names
 * @param a
 * @param b
 */
export function name_comparator(a: string, b: string) {
    a = a.toUpperCase();
    b = b.toUpperCase();

    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }
    return 0;
}
//  <------------------------- Comparators -------------------------


//  ------------------------- Components ------------------------->
interface RestrictedPage_props {
    children: JSX.Element;
    roleLevel?: ROLES;
    dontShowMenuDrawer?: boolean;
    style?: React.CSSProperties;
}

interface RestrictedPage_state {
}

/**
 * A custom component that restricts the access to a page if the user doesn't have the required roleLevel
 */
export class RestrictedPage extends React.Component<RestrictedPage_props, RestrictedPage_state> {
    children: JSX.Element;
    roleLevel?: ROLES;
    dontShowMenuDrawer?: boolean;
    hasPermission: boolean = false;
    style?: React.CSSProperties;

    constructor(props: RestrictedPage_props, context: any) {
        super(props, context);

        this.children = props.children;
        this.roleLevel = props.roleLevel;
        this.dontShowMenuDrawer = props.dontShowMenuDrawer;
        this.style = props.style;

        this.checkPermission();
    }

    checkPermission() {
        this.hasPermission = hasCurrentUserRoleLevel(this.roleLevel)
    }

    shouldComponentUpdate(nextProps: Readonly<RestrictedPage_props>, nextState: Readonly<RestrictedPage_state>, nextContext: any): boolean {
        this.children = nextProps.children;
        this.roleLevel = nextProps.roleLevel;
        this.dontShowMenuDrawer = nextProps.dontShowMenuDrawer;
        this.style = nextProps.style;
        return true;
    }

    render() {
        if (this.hasPermission) {
            return this.children;
        } else {
            if (this.dontShowMenuDrawer)
                return this.renderMessage()
            else
                return (
                    <MenuDrawer>
                        {this.renderMessage()}
                    </MenuDrawer>
                )
        }
    }

    renderMessage() {
        return (
            <div style={{display: 'flex', justifyContent: 'center', ...this.style}}>
                <Card style={{
                    marginTop: 75,
                    width: '85%',
                    maxWidth: "800px",
                    textAlign: "center", ...padding(18)
                }}>
                    <Typography variant="h3" gutterBottom>
                        Zugriff Verweigert
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                        Um auf die Seite '{document.location.pathname}' zugreifen zu können
                        werden mindestens Berechtigungen vom Level
                        '{this.roleLevel ? ROLES[this.roleLevel] : ROLES[ROLES.EMPLOYEE]}'
                        benötigt.
                    </Typography>
                    <Typography variant="body1">
                        Bitte melden Sie sich {<LogoutAndLoginLink text={"hier"}/>} an
                    </Typography>
                </Card>
            </div>
        )
    }
}

/**
 * A component for rendering a auto logout link
 * @param text The text to be displayed
 */
function LogoutAndLoginLink({text}: { text: string }) {
    const history = useHistory();
    return (
        <Link component="button"
              variant="body2"
              onClick={() => {
                  logoutUser(() => {
                      history.push("/login")
                  }, () => {
                      showToast('Abmelden Fehlgeschlagen', "error")
                  });

              }}>{text}</Link>
    )
}

// ---------------

/**
 * A convenience hook for forcing an rerender on a functional component
 */
export function useForceUpdate() {
    const setValue = useState(0)[1];
    return () => setValue(value => ++value);
}
//  <------------------------- Components -------------------------


//  ------------------------- Convenience ------------------------->
/**
 * A convenience function for renaming a key of an object
 * @param object The object
 * @param oldKey The name of the old key
 * @param newKey The name of the new key
 */
export function renameObjectKey(object: object, oldKey: string, newKey: string): object {
    // @ts-ignore
    object[newKey] = object[oldKey];
    // @ts-ignore
    return object
}

/**
 * A convenience function that calls a callback only if it is defined
 * @param what The callback
 * @param args The arguments of the callback
 */
export function callIfExists(what: Function | undefined | null, ...args: any[]) {
    if (what)
        what.call(undefined, args)
}

/**
 * @param {string} text Input String
 * @param {number} start Start Index (can be negative)
 * @param {number} [end] End Index (can be negative)
 * @return {string} The SubString
 */
export function subString(text: string, start: number, end?: number): string {
    if (start < 0)
        start = text.length + start;
    if (end === undefined) {
        return text.substring(start);
    } else {
        if (end < 0)
            end = text.length + end;
        return text.substring(start, end);
    }
}

const dateFormat = require('dateformat')

/**
 * A convenience function for formatting a date
 * @param date The date to be formatted
 * @param [pattern] An optional formatting pattern
 */
export function formatDate(date: string | number, pattern?: (string | boolean)): string {
    if (typeof date === "string") {
        if (date.includes("[UTC]"))
            date = subString(date, 0, -5);
        date = Date.parse(date);
    }
    return dateFormat(date, (typeof pattern === "string" ? pattern : (pattern ? "dd.mm.yyyy HH:MM" : "dd.mm.yyyy")));
}
//  <------------------------- Convenience -------------------------


//  ------------------------- Styles ------------------------->
export function alignCenter(vertical?: boolean, horizontal?: boolean): React.CSSProperties {
    return {
        display: "flex",
        height: "100%",
        alignItems: vertical ? "center" : undefined,
        justifyContent: horizontal ? "center" : undefined,
    }
}

/**
 * Returns a CSSProperties that sets the children's dimensions to fit their parent as specified
 * @param parentHeight Should it be vertically centered
 * @param parentWith Should it be horizontally centered
 */
export function matchParent(parentHeight?: boolean, parentWith?: boolean): React.CSSProperties {
    return {
        height: parentHeight ? "100%" : undefined,
        width: parentWith ? "100%" : undefined,
    }
}
//  <------------------------- Styles -------------------------