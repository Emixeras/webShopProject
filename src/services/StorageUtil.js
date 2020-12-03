import {isMobile} from "../Utilities/Utilities";
import {MY_USER} from "./UserApiUtil";

export const getSessionUser = () => {
    return JSON.parse(localStorage.getItem(MY_USER));
};

export const setSessionUser = (user) => {
    localStorage.setItem(MY_USER, JSON.stringify(user));
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
};

export const isDrawerVisible = () =>{
    return localStorage.getItem('isDrawerVisible') === '1';
};

export function getDrawerState() {
    return isDrawerVisible() && !isMobile();
}

//  ------------------------- Resize-Callbacks ------------------------->
const mobileStateCallbackList = require("collections/list")();

/**
 * @param {function} mobileCallback Der hinzuzufügende Clallback
 */
export function addMobileCallback(mobileCallback) {
    mobileStateCallbackList.push(mobileCallback)
}

export function removeMobileCallback(mobileCallback) {
    mobileStateCallbackList.delete(mobileCallback)
}

function resizeListener() {
    let prevState = isMobile();
    window.addEventListener('resize', ev => {
        let newState = isMobile();
        if (newState !== prevState) {
            prevState = newState;
            mobileStateCallbackList.forEach(callback => callback(newState));
        }
    });
}
resizeListener();
//  <------------------------- Resize-Callbacks -------------------------
