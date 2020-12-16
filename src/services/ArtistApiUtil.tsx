import {getSessionUser} from "./StorageUtil";
import axios from "axios";
import {showToast} from "../Utilities/Utilities";

const apiBaseUrlUpdateArtist = `http://${window.location.hostname}:8080/artist/`;

/**
 * The endpoint utility for creating artists
 * @param metaDataPayload The artist metadata
 * @param pictureFile The artist picture
 * @param onSuccess Callback when the request was successful
 * @param onFail Callback when the request failed
 */
export const createNewArtist = (metaDataPayload: object, pictureFile: File | null, onSuccess?: (response: any) => void, onFail?: (error: any) => void) => {
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
    formData.append('Artist', blob);
    const config = {
        auth: {
            username: user.email,
            password: user.password
        },
        headers: {
            'content-type': 'multipart/form-data'
        }
    };
    axios.post(apiBaseUrlUpdateArtist, formData,config)
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
 * The endpoint utility for updating artists
 * @param metaDataPayload The artist metadata
 * @param pictureFile The artist picture
 * @param onSuccess Callback when the request was successful
 * @param onFail Callback when the request failed
 */
export const updateArtist = (metaDataPayload: object, pictureFile: File | null, onSuccess?: (response: any) => void, onFail?: (error: any) => void) => {
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
    formData.append('Artist', blob);
    const config = {
        auth: {
            username: user.email,
            password: user.password
        },
        headers: {
            'content-type': 'multipart/form-data'
        }
    };
    axios.put(apiBaseUrlUpdateArtist, formData,config)
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
 * The endpoint utility for deleting artists
 * @param id The artist id
 * @param onSuccess Callback when the request was successful
 * @param onFail Callback when the request failed
 */
export function deleteArtist(id: number, onSuccess?: (response: any) => void, onFail?: (error: any) => void) {
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

    axios.delete(apiBaseUrlUpdateArtist + id, config)
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
}