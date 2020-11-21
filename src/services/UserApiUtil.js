import axios from "axios";
import {getSessionUser, setSessionUser, setUserLoggedIn} from "./StorageUtil";
import {showToast} from "../Utilities/Utilities";

const apiBaseUrlUserRegister = "http://localhost:8080/user";
const apiBaseUrlUserLogin = "http://localhost:8080/user";
const apiBaseUrlUserDelete = "http://localhost:8080/user/";

/**
 * @param {object} payload
 * @param [onSuccess]
 * @param [onFail]
 */
export const registerUser = (payload, onSuccess, onFail) => {
    axios.post(apiBaseUrlUserRegister, payload)
        .then(function (response) {
            console.log(response);
            if (response.status === 200) {
                console.log("register successfull");
                console.log(response.data);
                setSessionUser(response.data);
                setUserLoggedIn(true);
                if (onSuccess)
                    onSuccess(response)
            } else {
                console.log("register failed");
                if (onFail)
                    onFail(response)
            }
        })
        .catch(function (error) {
            console.log(error);
            if (onFail)
                onFail(error)
        });
};
/**
 * @param {string} email
 * @param {string} password
 * @param [onSuccess]
 * @param [onFail]
 */
export const loginUser = (email, password, onSuccess, onFail) => {
    axios.get(apiBaseUrlUserLogin, {
        auth: {
            username: email,
            password: password
        }
    })
        .then(function (response) {
            console.log(response);
            if (response.status === 200) {
                showToast("Anmeldung Erfolgreich", "success");
                console.log("Login successfull");
                setUserLoggedIn(true);
                setSessionUser(response.data);
                if (onSuccess)
                    onSuccess(response);
            } else {
                showToast("Anmeldung Fehlgeschlagen", "error");
                console.log(response);
                if (onFail)
                    onFail(response);
            }
        })
        .catch(function (error) {
            showToast("Anmeldung Fehlgeschlagen: " + error.message, "error");
            console.log(error);
            if (onFail)
                onFail(error);
        });
};

export const updateUser = (payload, onSuccess, onFail) => {
    var user = getSessionUser();
    axios.put(apiBaseUrlUserLogin, payload, {
        auth: {
            username: user.email,
            password: user.password
        }
    })
        .then(function (response) {
            console.log(response);
            if (response.status === 200) {
                console.log("update successfull");
                setSessionUser(response.data);
                if (onSuccess)
                    onSuccess(response);
            } else {
                console.log(response);
                console.log("user update failed")
                if (onFail)
                    onFail(response);
            }
        })
        .catch(function (error) {
            console.log("user update failed")
            console.log(error);
            if (onFail)
                onFail(error);
        });
};

export const deleteUser = (onSuccess, onFail) => {
    var user = getSessionUser();
    axios.delete(apiBaseUrlUserDelete + user.email, {
        auth: {
            username: user.email,
            password: user.password
        }
    })
        .then(function (response) {
            if (response.status === 200) {
                console.log("user delete successful");
                localStorage.clear();
                onSuccess();
            } else {
                if (onFail)
                    onFail()
            }
        })
}

export const logoutUser = (onSuccess, onFail) => {
    try {
        console.log('user has been logged out');
        localStorage.removeItem("myUser");
        setUserLoggedIn(false);
        onSuccess();
    } catch (e) {
        if (onFail)
            onFail(e);
    }

}