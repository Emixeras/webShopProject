
export const getSessionUser = () => {
    return JSON.parse(localStorage.getItem('myUser'));
};

export const setSessionUser = (user) => {
    localStorage.setItem('myUser', JSON.stringify(user));
}

export const setUserLoggedIn = (bool) => {
    if(bool === true){
        localStorage.setItem('isLoggedIn', '1');
    }else{
        localStorage.setItem('isLoggedIn', undefined)
    }
}

export const isUserLoggedIn = () => {
    return localStorage.getItem('isLoggedIn') === '1';
}

export const setDrawerVisible = (bool) =>{
    if (bool){
        localStorage.setItem('isDrawerVisible','1')
    }else{
        localStorage.setItem('isDrawerVisible',undefined)
    }
    drawerStateCallbackList.forEach(value => value(bool))
}

export const isDrawerVisible = () =>{
    return localStorage.getItem('isDrawerVisible') === '1';
}

//  ------------------------- Drawer-Callbacks ------------------------->
const drawerStateCallbackList = require("collections/list")();

/**
 * @param {function} callback Der hinzuzufügende Clallback
 */
export function addDrawerCallback(callback) {
    drawerStateCallbackList.push(callback)
}

export function removeDrawerCallback(callback) {
    drawerStateCallbackList.delete(callback)
}
//  <------------------------- Drawer-Callbacks -------------------------
