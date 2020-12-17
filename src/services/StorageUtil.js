import {isMobile} from "../Utilities/Utilities";
import {MY_USER} from "./UserApiUtil";

/**
 * Returns the current logged in user object from localStorage
 * @return {object} The user
 */
export const getSessionUser = () => {
    return JSON.parse(localStorage.getItem(MY_USER));
};

/**
 * Updates the currently logged in user in localStorage
 * @param user The metadata of the user
 */
export const setSessionUser = (user) => {
    localStorage.setItem(MY_USER, JSON.stringify(user));
};

/**
 * Saves the current login state in localStorage
 * @param bool The new state
 */
export const setUserLoggedIn = (bool) => {
    if(bool === true){
        localStorage.setItem('isLoggedIn', '1');
    }else{
        localStorage.setItem('isLoggedIn', undefined)
    }
};

/**
 * Checks if the user is currently logged in
 * @return {boolean}
 */
export const isUserLoggedIn = () => {
    return localStorage.getItem('isLoggedIn') === '1';
};

/**
 * Sets if the drawer is currently visible
 * @param bool The new state
 */
export const setDrawerVisible = (bool) =>{
    if (bool){
        localStorage.setItem('isDrawerVisible','1')
    }else{
        localStorage.setItem('isDrawerVisible',undefined)
    }
};

/**
 * Checks if the drawer is visible
 * @return {boolean}
 */
export const isDrawerVisible = () =>{
    return localStorage.getItem('isDrawerVisible') === '1';
};

/**
 * Returns true if the drawer is visible an the current devise is not mobile
 * @return {boolean}
 */
export function getDrawerState() {
    return isDrawerVisible() && !isMobile();
}

//  ------------------------- Resize-Callbacks ------------------------->
const mobileStateCallbackList = require("collections/list")();

/**
 * Adds a new drawerCallback
 * @param {function} mobileCallback The callback to be added
 */
export function addMobileCallback(mobileCallback) {
    mobileStateCallbackList.push(mobileCallback)
}

/**
 * Removes a drawerCallback
 * @param {function} mobileCallback The callback to be removed
 */
export function removeMobileCallback(mobileCallback) {
    mobileStateCallbackList.delete(mobileCallback)
}

/**
 * Applies an eventListener that listens for resize events
 */
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
