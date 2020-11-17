import React, {useEffect, useState} from "react";
import {CardMedia} from "@material-ui/core";
import {Article} from "../components/EditArticles";

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

//  <------------------------- Types -------------------------


//  ------------------------- Image ------------------------->
var signatures = {
    JVBERi0: "application/pdf",
    R0lGODdh: "image/gif",
    R0lGODlh: "image/gif",
    iVBORw0KGgo: "image/png"
};

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

// export const LazyImage = ({alt, getSrc, reload, style, className, returnMode, shouldImageUpdate}: LazyImageProperties): JSX.Element => {
//     const [imageSrc, setImageSrc] = useState(placeHolder);
//     const [imageRef, setImageRef] = useState<Element>();
//
//     if (reload)
//         reload(() => getSrc(result => setImageSrc(result)));
//
//     // const onLoad = (event: any) => {
//     //     event.target.classList.add('loaded')
//     // };
//     //
//     // const onError = (event: any) => {
//     //     event.target.classList.add('has-error')
//     // };
//
//     if (shouldImageUpdate) {
//         if (shouldImageUpdate(null, null))
//             getSrc(result => setImageSrc(result))
//     }
//     useEffect(() => {
//         if (shouldImageUpdate)
//             return () => {};
//         let observer: IntersectionObserver;
//         let didCancel = false;
//
//         debugger
//         if (imageRef && imageSrc === placeHolder) {
//             if (IntersectionObserver) {
//                 observer = new IntersectionObserver(
//                     entries => {
//                         entries.forEach(entry => {
//                             if (alt === "Davis LLC")
//                                 debugger
//                             if (!didCancel && (entry.intersectionRatio > 0 || entry.isIntersecting)) {
//                                 getSrc(result => {
//                                     setImageSrc(result);
//                                     if (alt !== "Davis LLC")
//                                         observer.unobserve(imageRef);
//                                     else
//                                         debugger
//                                 })
//                             }
//                         })
//                     },
//                     {
//                         threshold: 0.01,
//                         rootMargin: '75%',
//                     }
//                 );
//                 observer.observe(imageRef)
//             } else {
//                 // Old browsers fallback
//                 getSrc(result => {
//                     setImageSrc(result);
//                 })
//             }
//         }
//         return () => {
//             didCancel = true;
//             // on component cleanup, we remove the listner
//             if (observer && observer.unobserve && imageRef) {
//                 if (alt === "Davis LLC")
//                     debugger
//                 observer.unobserve(imageRef)
//             }
//         }
//     }, [imageSrc, imageRef]);
//
//     switch (returnMode) {
//         default:
//         case RETURN_MODE.IMG:
//             return <img className={className}
//                         style={style}
//                         src={imageSrc}
//                         ref={element => {
//                             if (element) setImageRef(element)
//                         }}
//                         alt={alt}
//             />;
//         case RETURN_MODE.CARD_MEDIA:
//             return <CardMedia className={className}
//                               style={style}
//                               image={imageSrc}
//                               ref={element => {
//                                   if (element) setImageRef(element)
//                               }}
//                               title={alt}/>;
//     }
// //    onLoad={onLoad}
// //     onError={onError}
// };

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
    }

    shouldComponentUpdate(nextProps: Readonly<LazyImageProperties>, nextState: Readonly<LazyImageState>, nextContext: any): boolean {
        if (this.shouldImageUpdate !== undefined)
            {
                let shouldUpdate: boolean;
                if (this.shouldImageUpdate === null)
                    shouldUpdate = this.payload !== nextProps.payload;
                else
                    shouldUpdate = this.shouldImageUpdate(this.payload, nextProps.payload);
                if (shouldUpdate) {
                    this.loadImage();
                }
                return false;
            }
        else
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
        switch (this.returnMode) {
            default:
            case RETURN_MODE.IMG:
                return <img className={this.className}
                            style={this.style}
                            src={this.imageSrc}
                            ref={element => {
                                if (element) this.imageRef = element
                            }}
                            alt={this.alt}
                />;
            case RETURN_MODE.CARD_MEDIA:
                return <CardMedia className={this.className}
                                  style={this.style}
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

export  function orElse<T>(input: T, orElse: T | (() => T)): T {
    if (input)
        return input;
    else {
        if (typeof orElse === "function")
            return (orElse as Function)();
        else
            return orElse;
    }
}
//  <------------------------- Logic -------------------------