import {Article} from "../Utilities/TsUtilities";

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

function getShoppingCartObject(): ShoppingCartObject {
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
    debugger
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

export function getShoppingCartPrice(article?: Article): number {
    if (article) {
        let entry = getShoppingCartEntry(article);
        if (entry)
            return +entry.article.price * entry.count;
        else
            return -1;
    } else {
        let allPrice = 0;
        for (const entry of getShoppingCartObject().entries)
            allPrice += +entry.article.price * entry.count;
        return allPrice;
    }
}

// ---------------

export function getAllShoppingCartEntries(): ShoppingCartEntry[] {
    return getShoppingCartObject().entries
}

export function getAllShoppingCartArticles(): Article[] {
    return getAllShoppingCartEntries().map(entry => entry.article)
}
//  <------------------------- getters -------------------------