//  ------------------------- Toast ------------------------->
import {Flip, toast, ToastContent, ToastOptions} from "react-toastify";

/**
 * @param {string} text Den anzuzeigenen Text
 * @param {(''|'info'|'success'|'warn'|'error'|'dark')} [type] Leer für 'Default', der eines der folgenden typen: 'info', 'success', 'warn', 'error', 'dark'
 * @param {object} [customOptions] Ein Objekt mit überschriebenen Optionen
 * @returns {number} Gibt die Toast-ID zurück
 */
export function showToast(text:ToastContent, type?:''|'info'|'success'|'warn'|'error'|'dark', customOptions?:ToastOptions) {
    let options:ToastOptions = {
        position: "bottom-right",
        autoClose: 2500,
        hideProgressBar: true,
        transition: Flip,
        ...customOptions
    };
    if (type) 
        return toast[type](text, options);
    else
        return toast(text, options);
}

//  <------------------------- Toast -------------------------
