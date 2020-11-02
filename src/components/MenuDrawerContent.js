import React from "react";
import {isDrawerVisible, setDrawerVisible} from "../services/StorageUtil";


export default function MenuDrawerContent() {

    const [open, setOpen] = React.useState(isDrawerVisible);

    const handleDrawerOpen = () => {
        setOpen(true);
        setDrawerVisible(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
        setDrawerVisible(false);
    };

    console.log(this.props.isVisible);
    if(this.props.isVisible){ return (<div style={drawerStateOutStyle} >
        test
    </div>)}else{
        return (<div style={drawerStateInStyle} >
            test
        </div>)
    }
}

const drawerStateInStyle = {
    marginLeft: 0,
};

const drawerStateOutStyle = {
    marginLeft: 240,
};