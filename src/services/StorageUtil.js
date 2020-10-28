
//returns user object
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

