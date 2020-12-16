import {getSessionUser} from "./StorageUtil";
import axios from "axios";
import {showToast} from "../Utilities/Utilities";

const apiBaseUrlUpdateArtist = `http://${window.location.hostname}:8080/artist/`;

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