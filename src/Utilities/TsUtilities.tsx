import React, {useEffect, useState} from "react";
import {Card, CardMedia, Link, Typography} from "@material-ui/core";
import {number} from "prop-types";
import {padding, showToast} from "../Utilities/Utilities";
import {getSessionUser} from "../services/StorageUtil";
import {useHistory} from "react-router-dom";
import {logoutUser} from "../services/UserApiUtil";
import MenuDrawer from "../components/MenuDrawer";

export function boolOr<T>(input: T, ...ors: T[]): boolean {
    for (let or of ors) {
        if (input === or)
            return true;
    }
    return false;
}


//  ------------------------- Tuple ------------------------->
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
export interface ContextType<T> {
    context: T;
}

export interface Article {
    id: number;
    title: string;
    description: string;
    ean: number;
    price: string;
    artists: ArtistOrGenre;
    genre: ArtistOrGenre;
    picture?: { id: number, data: string };
}

export interface ArtistOrGenre {
    id: number;
    name: string;
    file?: string;
}

export interface ImageResponseType {
    article: Article;
    file: string;
}

export enum ROLES {
    USER, EMPLOYEE, ADMIN
}

//  <------------------------- Types -------------------------


//  ------------------------- Image ------------------------->
export function base64ToDataUri(base64: string): string {
    var mime;
    if (base64.startsWith("iVBORw0KGgo"))
        mime = "image/png";
    else if (base64.startsWith("/9j/4AAQSkZJRg"))
        mime = "image/jpeg";

    // for (let s in signatures) {
    //     debugger
    //     if (base64.startsWith(s)) {
    //          mime = signatures[s as string] as string;
    //     }
    // }
    // var a = new Uint8Array(buffer);
    // var nb = a.length;
    // if (nb < 4)
    //     return "";
    // var b0 = a[0];
    // var b1 = a[1];
    // var b2 = a[2];
    // var b3 = a[3];
    // if (b0 == 0x89 && b1 == 0x50 && b2 == 0x4E && b3 == 0x47)
    //     mime = 'image/png';
    // else if (b0 == 0xff && b1 == 0xd8)
    //     mime = 'image/jpeg';
    // else if (b0 == 0x47 && b1 == 0x49 && b2 == 0x46)
    //     mime = 'image/gif';
    // else
    //     return "";
    // var binary = "";
    // for (var i = 0; i < nb; i++)
    //     binary += String.fromCharCode(a[i]);
    // var base64 = window.btoa(binary);
    return `data:${mime};base64,${base64}`
}

export function loadSingleImage(articleId: number, onFinish: (imageResponse?: ImageResponseType) => void, imageResolution?: number) {
    fetch(new Request(`http://localhost:8080/article/range;start=${articleId};end=${articleId};quality=${imageResolution ? imageResolution : 250}`, {method: 'GET'}))
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

// ---------------
/* Credit: https://slashgear.github.io/creating-an-image-lazy-loading-component-with-react/*/

const placeHolder = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="; //""; //'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII=';

interface LazyImageProperties {
    getSrc: (setImgSrc: ((result: string) => void)) => void;
    alt?: string;
    reload?: (reload: () => void) => void
    style?: React.CSSProperties;
    className?: string
    autoUnloadImages?: boolean;
    returnMode?: RETURN_MODE;
    loadImageMode?: LOAD_IMAGE_MODE;
    shouldImageUpdate?: ((oldPayload: any, newPayload: any) => boolean) | null;
    payload?: any;
    imageRef?: any;
    rounded?: boolean | string | "circle" | "small" | "medium" | "large";
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

export class LazyImage extends React.Component<LazyImageProperties, LazyImageState> {
    imageSrc: string = placeHolder;
    // @ts-ignore
    getSrc: (onResult: ((result: string) => void)) => void;
    alt?: string;
    reload?: (reload: () => void) => void;
    style?: React.CSSProperties;
    className?: string;
    returnMode?: RETURN_MODE;
    loadImageMode?: LOAD_IMAGE_MODE;
    shouldImageUpdate?: ((oldPayload: any, newPayload: any) => boolean) | null;
    payload?: any;
    imageRef?: Element = undefined;
    initialLoad: boolean = true;
    observer?: IntersectionObserver;
    rounded?: boolean | string | "circle" | "small" | "medium" | "large";

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
                                // @ts-ignore
                                this.loadImage(result => this.observer.unobserve(this.imageRef))
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
    }

    shouldComponentUpdate(nextProps: Readonly<LazyImageProperties>, nextState: Readonly<LazyImageState>, nextContext: any): boolean {
        if (this.shouldImageUpdate !== undefined) {
            let shouldUpdate: boolean;
            if (this.shouldImageUpdate === null)
                shouldUpdate = this.payload !== nextProps.payload;
            else
                shouldUpdate = this.shouldImageUpdate(this.payload, nextProps.payload);
            if (shouldUpdate) {
                this.loadImage();
            }
            return false;
        } else
            return true;
    }

    componentWillUpdate(nextProps: Readonly<LazyImageProperties>, nextState: Readonly<LazyImageState>, nextContext: any): void {
        this.updateVariables(nextProps);
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
        this.getSrc(result => {
            this.imageSrc = result;
            if (onResult)
                onResult(result);
            this.forceUpdate();
        })
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
            case RETURN_MODE.IMG:
                return <img className={this.className}
                            style={{borderRadius: borderRadius, ...this.style}}
                            src={this.imageSrc}
                            ref={element => {
                                if (element) this.imageRef = element
                            }}
                            alt={this.alt}
                />;
            case RETURN_MODE.CARD_MEDIA:
                return <CardMedia className={this.className}
                                  style={{borderRadius: borderRadius, ...this.style}}
                                  image={this.imageSrc}
                                  ref={element => {
                                      if (element) this.imageRef = element
                                  }}
                                  title={this.alt}/>;
        }

    }
}

//  <------------------------- Image -------------------------


//  ------------------------- Logic ------------------------->
export function filterArticle(query: string, article: Article) {
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

export function orElse<T>(input: T, orElse: T | (() => T)): T {
    if (input)
        return input;
    else {
        if (typeof orElse === "function")
            return (orElse as Function)();
        else
            return orElse;
    }
}

export function ifExistsReturnOrElse<T, R>(input: T, returnFunction: (input: T) => R, orElse: R | (() => R)): R {
    if (input)
        return returnFunction(input);
    else {
        if (typeof orElse === "function")
            return (orElse as Function)();
        else
            return orElse;
    }
}

// ---------------

export function hasCurrentUserRoleLevel(level: string | number = "EMPLOYEE"): boolean {
    let roleMap = {
        USER: 0,
        EMPLOYEE: 1,
        ADMIN: 2,
        "0": 0,
        "1": 1,
        "2": 2,
    };

    let user = getSessionUser();
    // @ts-ignore
    return user && roleMap[user.role] >= roleMap[level];
}

//  <------------------------- Logic -------------------------


//  ------------------------- Components ------------------------->
interface RestrictedPage_props {
    children: JSX.Element;
    roleLevel?: ROLES;
    dontShowMenuDrawer?: boolean;
    style?: React.CSSProperties;
}

interface RestrictedPage_state {}

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

//  <------------------------- Components -------------------------


//  ------------------------- Convenience ------------------------->
export function renameObjectKey(object: object, oldKey: string, newKey: string): object {
    // @ts-ignore
    object[newKey] = object[oldKey];
    // @ts-ignore
    // delete object[oldKey];
    // if (oldKey !== newKey) {
    //     Object.defineProperty(object, newKey,
    //     // @ts-ignore
    //         Object.getOwnPropertyDescriptor(object, oldKey));
    //     // @ts-ignore
    //     delete object[oldKey];
    // }
    return object
}
//  <------------------------- Convenience -------------------------