import {isMobile} from "../Utilities/Utilities";

export const getSessionUser = () => {
    return JSON.parse(localStorage.getItem('myUser'));
};

export const setSessionUser = (user) => {
    localStorage.setItem('myUser', JSON.stringify(user));
};

export const setUserLoggedIn = (bool) => {
    if(bool === true){
        localStorage.setItem('isLoggedIn', '1');
    }else{
        localStorage.setItem('isLoggedIn', undefined)
    }
};

export const isUserLoggedIn = () => {
    return localStorage.getItem('isLoggedIn') === '1';
};

export const setDrawerVisible = (bool) =>{
    if (bool){
        localStorage.setItem('isDrawerVisible','1')
    }else{
        localStorage.setItem('isDrawerVisible',undefined)
    }
    callDrawerCallbacks()
};

export const isDrawerVisible = () =>{
    return localStorage.getItem('isDrawerVisible') === '1';
};

export function getDrawerState() {
    return isDrawerVisible() && !isMobile();
}

//  ------------------------- Drawer-Callbacks ------------------------->
const drawerStateCallbackList = require("collections/list")();

/**
 * @param {function} drawerCallback Der hinzuzufügende Clallback
 */
export function addDrawerCallback(drawerCallback) {
    drawerStateCallbackList.push(drawerCallback)
}

export function removeDrawerCallback(drawerCallback) {
    drawerStateCallbackList.delete(drawerCallback)
}

export function callDrawerCallbacks() {
    let state = isDrawerVisible() && !isMobile();
    drawerStateCallbackList.forEach(value => value(state))
}

function resizeListener() {
    let prevState = isMobile();
    window.addEventListener('resize', ev => {
        let newState = isMobile();
        if (newState !== prevState) {
            prevState = newState;
            if (isDrawerVisible())
                callDrawerCallbacks();
        }
    });
}
resizeListener();
//  <------------------------- Drawer-Callbacks -------------------------
