import React, {useEffect, useState} from "react";
import {CardMedia} from "@material-ui/core";

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

    static make<A, B>(first: A, second: B): Pair<A,B> {
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

    static make<A, B, C>(first: A, second: B, third: C): Triple<A,B,C> {
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

export function base64ToDataUri (base64: string): string {
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

const placeHolder = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII=';
export interface LazyImageProperties {
    alt: string;
    getSrc: (onResult: ((result: string) => void)) => void;
}

interface GetSrcType {
    (onResult: ((result: string) => void)): void;
}

// @ts-ignore
export const LazyImage = ({ alt, getSrc }: LazyImageProperties): CardMedia => {
    let test: LazyImageProperties = {alt: "", getSrc: result => {

        }}
    const [imageSrc, setImageSrc] = useState(placeHolder);
    const [imageRef, setImageRef] = useState<Element>();

    const onLoad = (event: any) => {
        event.target.classList.add('loaded')
    };

    const onError = (event: any) => {
        event.target.classList.add('has-error')
    };

    useEffect(() => {
        let observer: IntersectionObserver;
        let didCancel = false;

        if (imageRef && imageSrc === placeHolder) {
            if (IntersectionObserver) {
                observer = new IntersectionObserver(
                    entries => {
                        entries.forEach(entry => {
                            if (!didCancel && (entry.intersectionRatio > 0 || entry.isIntersecting)) {
                                getSrc(result => {
                                    setImageSrc(result);
                                    observer.unobserve(imageRef)
                                })
                            }
                        })
                    },
                    {
                        threshold: 0.01,
                        rootMargin: '75%',
                    }
                );
                observer.observe(imageRef)
            } else {
                // Old browsers fallback
                getSrc(result => {
                    setImageSrc(result);
                })
            }
        }
        return () => {
            didCancel = true;
            // on component cleanup, we remove the listner
            if (observer && observer.unobserve && imageRef) {
                observer.unobserve(imageRef)
            }
        }
    }, [imageSrc, imageRef]);
    return <CardMedia style={{paddingTop: '100%', backgroundColor: "lightgrey"}} image={imageSrc} ref={element => {
        if (element)
            setImageRef(element)
    }
    } title={alt}/>
//    onLoad={onLoad}
//     onError={onError}
};
//  <------------------------- Image -------------------------