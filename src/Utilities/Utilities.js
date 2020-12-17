import {toast, Flip} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useHistory} from "react-router-dom";
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Returns an object of all the supported titles
 */
export function titles() {
    return (
        [
            {
                value: 'none',
                label: 'Nicht Ausgewählt',
            },
            {
                value: 'HERR',
                label: 'Herr',
            },
            {
                value: 'FRAU',
                label: 'Frau',
            },
            {
                value: 'PROFESSOR',
                label: 'Professor',
            },
            {
                value: 'DOKTOR',
                label: 'Doktor',
            },
            {
                value: 'BENUTZERDEFINIERT',
                label: 'Benutzerdefiniert',
            },
        ]
    )
}

//  ------------------------- Padding & Margin ------------------------->
/**
 * @param {number} a Alle oder Vertikal oder Oben
 * @param {number} [b] Horizontal oder Rechts
 * @param {number} [c] Unten
 * @param {number} [d] Links
 * @returns {{paddingBottom: (*), paddingRight: (*), paddingTop: *, paddingLeft: (*)}}
 */
export function padding(a, b, c, d) {
    return {
        paddingTop: a,
        paddingRight: b !== undefined ? b : a,
        paddingBottom: c !== undefined ? c : a,
        paddingLeft: d !== undefined ? d : (b !== undefined ? b : a)
    }
}

/**
 * @param {number} a Alle oder Vertikal oder Oben
 * @param {number} [b] Horizontal oder Rechts
 * @param {number} [c] Unten
 * @param {number} [d] Links
 * @returns {{marginBottom: (*), marginRight: (*), marginTop: *, marginLeft: (*)}}
 */
export function margin(a, b, c, d) {
    return {
        marginTop: a,
        marginRight: b !== undefined ? b : a,
        marginBottom: c !== undefined ? c : a,
        marginLeft: d !== undefined ? d : (b !== undefined ? b : a)
    }
}

//  <------------------------- Padding & Margin -------------------------


//  ------------------------- Toast ------------------------->
/**
 * @param {string} text Den anzuzeigenen Text
 * @param {(''|'info'|'success'|'warn'|'error'|'dark')} [type] Leer für 'Default', der eines der folgenden typen: 'info', 'success', 'warn', 'error', 'dark'
 * @param {ToastOptions} [customOptions] Ein Objekt mit überschriebenen Optionen
 * @returns {number} Gibt die Toast-ID zurück
 */
export function showToast(text, type = "", customOptions) {
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
/**
 * Compares two objects one layer deep
 * @param object1
 * @param object2
 * @return {boolean} Are the two objects equal
 */
export function shallowEqual(object1, object2) {
    if (object1 === object2)
        return true
    if (typeof object1 !== typeof object2)
        return false

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

/**
 * Compares recursively two objects
 * @param object1
 * @param object2
 * @return {boolean} Are the two objects equal
 */
export function deepEqual(object1, object2) {
    if (object1 === object2)
        return true
    if (typeof object1 !== typeof object2)
        return false

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

/**
 * Checks if the given parameter is an object
 * @param {any} object The variable to check
 * @return {boolean} Is the parameter an object
 */
export function isObject(object) {
    return object != null && typeof object === 'object';
}

//  <------------------------- ObjectComparisons -------------------------


//  ------------------------- Checks ------------------------->
export const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/**
 * Checks if the given string is a valid eMail
 * @param {string} email The string to check
 * @return {boolean} Is the string a valid eMail
 */
export function isEmail(email) {
    return emailRegEx.test(email)
}

// ---------------

/**
 * Checks if the current device is a mobile device
 * @return {boolean} True if the with is smaller or equal to 600px
 */
export function isMobile() {
    return window.innerWidth <= 600;
}

//  <------------------------- Checks -------------------------


//  ------------------------- Colors ------------------------->
/**
 * Transforms a hex color value to a rgba color value
 * @param hex The hex value to be transformed
 * @param alpha The alpha to be added
 * @return {string} The transformed rgba color value
 */
export function hexToRgbA(hex, alpha) {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        let s = 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + alpha + ')';
        return s;
    }
    throw new Error('Bad Hex');
}

//  <------------------------- Colors -------------------------


//  ------------------------- Components ------------------------->
/**
 * A component that navigates to a included path
 */
export class NavigationComponent extends React.Component {
    render() {
        return <Navigate to={this.props.to}/>
    }
}

/**
 * The navigation process for the NavigationComponent
 * @param props Includes the target location
 */
function Navigate(props) {
    const history = useHistory();
    history.push(props.to);
    return null;
}

NavigationComponent.propTypes = {
    to: PropTypes.string.isRequired
};
//  <------------------------- Components -------------------------


