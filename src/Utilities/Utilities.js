import {toast, Flip} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useHistory} from "react-router-dom";
import React, {Component, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import CardMedia from "@material-ui/core/CardMedia";
import {base64ToDataUri} from "./TsUtilities";
import Card from "@material-ui/core/Card/Card";

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
        paddingRight: b ? b : a,
        paddingBottom: c ? c : a,
        paddingLeft: d ? d : (b ? b : a)
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
        marginRight: b ? b : a,
        marginBottom: c ? c : a,
        marginLeft: d ? d : (b ? b : a)
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

export function isMobile() {
    return window.innerHeight > window.innerWidth
}

//  <------------------------- Checks -------------------------


//  ------------------------- Colors ------------------------->
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
export class NavigationComponent extends React.Component {
    render() {
        return <Navigate to={this.props.to}/>
    }
}

function Navigate(props) {
    const history = useHistory();
    history.push(props.to);
    return null;
}


NavigationComponent.propTypes = {
    to: PropTypes.string.isRequired
};
//  <------------------------- Components -------------------------


