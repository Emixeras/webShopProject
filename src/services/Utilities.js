import { toast, Flip} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export function titles() {
    return (
        [
            {
                value: 'none',
                label: 'Nicht Ausgewählt',
            },
            {
                value: 'Hr',
                label: 'Herr',
            },
            {
                value: 'Fr',
                label: 'Frau',
            },
            {
                value: 'Prof',
                label: 'Professor',
            },
            {
                value: 'Dr',
                label: 'Doktor',
            },
            {
                value: 'Div',
                label: 'Divers',
            },
        ]
    )
}
//  ------------------------- Padding ------------------------->
export function padding_extend(obj, a, b, c, d) {
    debugger
    return {
        ...obj,
        paddingTop: a,
        paddingRight: b ? b : a,
        paddingBottom: c ? c : a,
        paddingLeft: d ? d : (b ? b : a)
    }
}

export function padding(a, b, c, d) {
    return {
        paddingTop: a,
        paddingRight: b ? b : a,
        paddingBottom: c ? c : a,
        paddingLeft: d ? d : (b ? b : a)
    }
}
//  <------------------------- Padding -------------------------


//  ------------------------- Toast ------------------------->
/**
 * @param {string} text Den anzuzeigenen Text
 * @param {(''|'info'|'success'|'warn'|'error'|'dark')} [type] Leer für 'Default', der eines der folgenden typen: 'info', 'success', 'warn', 'error', 'dark'
 * @param {object} [customOptions] Ein Objekt mit überschriebenen Optionen
 * @param func
 * @returns {number} Gibt die Toast-ID zurück
 */
export function showToast(text, type, customOptions, func) {
    let options = {
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


//  ------------------------- ObjectComparisons ------------------------->
export function shallowEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (let key of keys1) {
        if (object1[key] !== object2[key]) {
            return false;
        }
    }

    return true;
}

export function deepEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (const key of keys1) {
        const val1 = object1[key];
        const val2 = object2[key];
        const areObjects = isObject(val1) && isObject(val2);
        if (
            areObjects && !deepEqual(val1, val2) ||
            !areObjects && val1 !== val2
        ) {
            return false;
        }
    }

    return true;
}

export function isObject(object) {
    return object != null && typeof object === 'object';
}
//  <------------------------- ObjectComparisons -------------------------


//  ------------------------- Checks ------------------------->
export const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export function isEmail(email) {
    return emailRegEx.test(email)
}

// ---------------

export function isMobile(window) {
    return window.innerHeight > window.innerWidth
}
//  <------------------------- Checks -------------------------