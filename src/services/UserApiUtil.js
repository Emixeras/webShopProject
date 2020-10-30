import axios from "axios";
import {getSessionUser, setSessionUser, setUserLoggedIn} from "./StorageUtil";
import { withRouter } from "react-router-dom";

const apiBaseUrlUserRegister = "http://localhost:8080/user";
const apiBaseUrlUserLogin = "http://localhost:8080/user";
const apiBaseUrlUserDelete = "http://localhost:8080/user/";

export const registerUser = (payload,props) => {
    axios.post(apiBaseUrlUserRegister, payload)
        .then(function (response) {
            console.log(response);
            if(response.status === 200){
                console.log("register successfull");
                console.log(response.data);
                setSessionUser(response.data);
                setUserLoggedIn(true);
                props.history.push("/")
            }
            else{
                console.log("register failed");
            }
        })
        .catch(function (error) {
            alert('register failed');
            console.log(error);
        });
};

export const loginUser = (username,password,props) => {
    axios.get(apiBaseUrlUserLogin, {
        auth: {
            username: username,
            password: password
        }
    })
        .then(function (response) {
            console.log(response);
            if(response.status === 200){
                console.log("Login successfull");
                setUserLoggedIn(true);
                setSessionUser(response.data);
                props.history.push("/")
            }else{
                alert('authentication failed, please try again');
                console.log(response);
            }
        })
        .catch(function (error) {
            alert('login failed');
            console.log(error);
        });
};

export const deleteUser = (props) => {
    var user = getSessionUser();
    axios.delete(apiBaseUrlUserDelete + user.username, {
        auth: {
            username: user.username,
            password: user.password
        }
    })
        .then(function (response) {
            if(response.status === 200){
                console.log("user delete successful");
                localStorage.clear();
                props.history.push("/")
            }else(
                alert('delete failed')
            )
        })
}

export const logoutUser = (props) => {
    console.log('user has been logged out');
    localStorage.clear();
    props.history.push("/")
}