import {orElse} from "../Utilities/TsUtilities";
import {MY_USER} from "./UserApiUtil";
import {setUserLoggedIn} from "./StorageUtil";

const REMEMBER_ME = "REMEMBER_ME";

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

export function setRememberMe(state: boolean) {
    localStorage.setItem(REMEMBER_ME, `${state}`)
}

