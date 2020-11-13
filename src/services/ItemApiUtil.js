import {getSessionUser} from "./StorageUtil";
import axios from "axios";
import {showToast} from "../Utilities/Utilities";

const apiBaseUrlUpdateArticle = 'http://localhost:8080/article';

export const createNewArticle = (metaDataPayload, pictureFile, onSuccess, onFail) => {
    var user = getSessionUser();
    const formData = new FormData();
    const json = JSON.stringify(metaDataPayload);
    const blob = new Blob([json], {
        type: 'application/json'
    });

    formData.append('Picture', pictureFile);
    formData.append('Article', blob);
    const config = {
        auth: {
            username: user.email,
            password: user.password
        },
        headers: {
            'content-type': 'multipart/form-data'
        }
    };
    axios.post(apiBaseUrlUpdateArticle, formData,config)
        .then(function (response) {
            console.log(response);
            if(onSuccess)
                onSuccess(response)
        })
        .catch(function (error) {
            console.log(error);
            if(onFail)
                onFail(error);
        });
};

export const updateArticle = (metaDataPayload, pictureFile, onSuccess, onFail) => {
    var user = getSessionUser();
    if (!user) {
        showToast("Nicht angemeldet", "error");
        return
    }
    const formData = new FormData();
    const json = JSON.stringify(metaDataPayload);
    const blob = new Blob([json], {
        type: 'application/json'
    });
    if(pictureFile)
        formData.append('Picture', pictureFile);
    formData.append('Article', blob);
    const config = {
        auth: {
            username: user.email,
            password: user.password
        },
        headers: {
            'content-type': 'multipart/form-data'
        }
    };
    axios.put(apiBaseUrlUpdateArticle, formData,config)
        .then(function (response) {
            console.log(response);
            if(onSuccess)
                onSuccess(response)
        })
        .catch(function (error) {
            console.log(error);
            if(onFail)
                onFail(error);
        });
};