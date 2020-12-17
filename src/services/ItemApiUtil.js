import {getSessionUser} from "./StorageUtil";
import axios from "axios";
import {showToast} from "../Utilities/Utilities";

const apiBaseUrlUpdateArticle = `http://${window.location.hostname}:8080/article/`;


/**
 * Nimmt die neuen Daten und pusht sie auf die DB
 * @param metaDataPayload neue Metadaten
 * @param pictureFile neues Bild
 * @param onSuccess Callback when the request was successful
 * @param onFail Callback when the request failed
 */
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

/**
 * Nimmt die bestehenden und neuen Daten des alten Artikels und pusht sie auf die DB
 * @param metaDataPayload neue Metadaten
 * @param pictureFile neues Bild
 * @param onSuccess Callback when the request was successful
 * @param onFail Callback when the request failed
 */
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

/**
 * @param {number} id
 * @param onSuccess Callback when the request was successful
 * @param onFail Callback when the request failed
 */

export const deleteArticle = (id, onSuccess, onFail) => {
    var user = getSessionUser();
    if (!user) {
        showToast("Nicht angemeldet", "error");
        return
    }

    const config = {
        auth: {
            username: user.email,
            password: user.password
        },
    };
    axios.delete(apiBaseUrlUpdateArticle + id,config)
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