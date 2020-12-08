import React from "react";
import {
    ContextType, hasCurrentUserRoleLevel,
    RestrictedPage,
    roleMap,
    ROLES,
    useForceUpdate,
    User
} from "../Utilities/TsUtilities";
import MenuDrawer from "./MenuDrawer";
import axios from "axios";
import {getSessionUser} from "../services/StorageUtil";
import {isMobile, padding, showToast} from "../Utilities/Utilities";
import {
    Button,
    ButtonGroup,
    Card,
    ClickAwayListener,
    Grid,
    Grow, IconButton, MenuItem, MenuList,
    Paper,
    Popper,
    Typography
} from "@material-ui/core";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import UserIcon from '@material-ui/icons/LocalMall';
import EmployeeIcon from '@material-ui/icons/Person';
import AdminIcon from '@material-ui/icons/SupervisorAccount';
import SaveIcon from "@material-ui/icons/Save";
import {updateUser} from "../services/UserApiUtil";

interface RoleManagement_State {

}

interface RoleManagement_Props {

}

export default class RoleManagement extends React.Component<RoleManagement_State, RoleManagement_Props> {

    userArray: User[] = [];

    constructor(props: RoleManagement_State, context: any) {
        super(props, context);
        if (hasCurrentUserRoleLevel("ADMIN"))
            this.loadUsers();
    }

    loadUsers() {
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

        axios.get(`http://${window.location.hostname}:8080/user/all`, config)
            .then(response => {
                console.log(response);
                this.userArray = response.data
                // debugger;
                // showToast("Jay", "success");
                this.forceUpdate();
            })
            .catch(error => {
                console.log(error);
                debugger;
                showToast("Beim Laden der Nutzer ist ein Fehler aufgetreten: " + error.message, "error");
            });

    }

    render() {
        return (
            <RestrictedPage roleLevel={ROLES.ADMIN}>
                <MenuDrawer>
                    <div style={{
                        marginTop: 5,
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <div style={{width: isMobile() ? '93%' : '85%', maxWidth: "800px"}}>
                            <RoleList context={this}/>
                        </div>
                    </div>
                </MenuDrawer>
            </RestrictedPage>
        )
    }
}

function RoleList({context}: ContextType<RoleManagement>) {
    return (
        <Grid container spacing={2}>
            {context.userArray.map((user, index) => {
                return <RoleListItem context={context} user={user} index={index}/>
            })}
        </Grid>
    );
}

function RoleListItem({context, user, index}: { context: RoleManagement, user: User, index: number }) {
    return (
        <Grid item alignItems="center" xs={12}>
            <Card
                style={{...padding(18), ...(index % 2 === 1 ? {backgroundColor: "rgba(0,0,0,0.05)"} : {})}}>
                <Grid container spacing={2}>
                    <Grid item>
                        <div style={{
                            display: "flex",
                            height: "100%",
                            // justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <Typography><b>{user.email}</b></Typography>
                        </div>
                    </Grid>
                    <Grid item xs>
                        <div style={{
                            display: "flex",
                            height: "100%",
                            // justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <Grid container spacing={1}>
                                <Grid item>
                                    {user.firstName}
                                </Grid>
                                <Grid item>
                                    {user.lastName}
                                </Grid>
                            </Grid>
                        </div>
                    </Grid>
                    <Grid item>
                        <RoleListItemButton context={context} user={user}/>
                    </Grid>
                </Grid>
            </Card>
        </Grid>
    )
}

const options = ['Nutzer', 'Angestellter', 'Admin'];
const icons = [<UserIcon/>, <EmployeeIcon/>, <AdminIcon/>];

function RoleListItemButton({context, user}: { context: RoleManagement, user: User }) {
    let forceUpdate = useForceUpdate();
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef<HTMLDivElement>(null);
    // @ts-ignore
    let roleIndex = roleMap[user.role] as number;
    const [selectedIndex, setSelectedIndex] = React.useState(roleIndex);

    const handleMenuItemClick = (
        event: React.MouseEvent<HTMLLIElement, MouseEvent>,
        index: number,
    ) => {
        setSelectedIndex(index);
        setOpen(false);
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: React.MouseEvent<Document, MouseEvent>) => {
        if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
            return;
        }

        setOpen(false);
    };

    return (
        <Grid container direction="row" alignItems="center" spacing={1}>
            <Grid item xs>
                <ButtonGroup variant="contained" color="primary" ref={anchorRef}
                             aria-label="split button">
                    <Button startIcon={icons[selectedIndex]}
                            onClick={handleToggle}>{options[selectedIndex]}</Button>
                    <Button
                        color="primary"
                        size="small"
                        aria-controls={open ? 'split-button-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-label="select merge strategy"
                        aria-haspopup="menu"
                        onClick={handleToggle}
                    >
                        <ArrowDropDownIcon/>
                    </Button>
                </ButtonGroup>
                <Popper style={{zIndex: 2}} open={open} anchorEl={anchorRef.current}
                        role={undefined} transition
                        disablePortal>
                    {({TransitionProps, placement}) => (
                        <Grow
                            {...TransitionProps}
                            style={{
                                transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                            }}
                        >
                            <Paper>
                                <ClickAwayListener onClickAway={handleClose}>
                                    <MenuList id="split-button-menu">
                                        {options.map((option, index) => (
                                            <MenuItem
                                                key={option}
                                                selected={index === selectedIndex}
                                                onClick={(event) => handleMenuItemClick(event, index)}
                                            >
                                                {icons[index]}{"⠀"}{option}
                                            </MenuItem>
                                        ))}
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </Grid>
            {roleIndex !== selectedIndex &&
            <Grid item>
                <IconButton onClick={event => {
                    user.role = ROLES[selectedIndex];
                    updateUser(user, (response: any) => {
                        console.log(response);
                        debugger
                        showToast(`Der Nutzer wurde geupdated`, "success");
                        forceUpdate();
                    }, (error: any) => {
                        console.log(error);
                        debugger
                        showToast("Es ist ein Fehler aufgetreten: " + error.message, "error");
                    })
                }} style={{
                    height: 36,
                    width: 36, color: "green"
                }}>{<SaveIcon/>}</IconButton>
            </Grid>}
        </Grid>
    );
}
