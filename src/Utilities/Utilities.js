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
    if ("true")
        return window.innerWidth <= 600;
    // return window.innerHeight > window.innerWidth
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
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


