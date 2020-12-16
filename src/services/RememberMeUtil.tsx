import {orElse} from "../Utilities/TsUtilities";
import {MY_USER} from "./UserApiUtil";
import {setUserLoggedIn} from "./StorageUtil";

const REMEMBER_ME = "REMEMBER_ME";

/**
 * Adds a listener for window closing events
 */
function addWindowCloseListener() {
    window.onunload = () => {
        let rememberMe: boolean = orElse(localStorage.getItem(REMEMBER_ME), "false") == 'true';
        if (!rememberMe) {
            localStorage.removeItem(MY_USER)
            setUserLoggedIn(false);
        }
    }
}

addWindowCloseListener()

/**
 * Sets the new rememberMe state
 * @param state The new state
 */
export function setRememberMe(state: boolean) {
    localStorage.setItem(REMEMBER_ME, `${state}`)
}

