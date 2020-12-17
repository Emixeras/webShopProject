import React from "react";
import MenuDrawer from "./MenuDrawer";
import {isMobile} from "../Utilities/Utilities";
import {Card, Typography} from "@material-ui/core";

interface SideNotice_props {

}

interface SideNotice_state {

}

/**
 * The main Component of SideNotice.js
 */
export default class SideNotice extends React.Component<SideNotice_props, SideNotice_state>{
    render() {
        return (
            <MenuDrawer>
                <div style={{
                    marginTop: 8,
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <div
                          style={{width: isMobile() ? '100%' : '85%', maxWidth: "800px"}}
                          >
                        <Card style={{padding: 18, marginTop: 20}}>
                            <Typography variant={"h4"} style={{textAlign: "center"}}>
                                Hier könnte ihr Impressum stehen
                            </Typography>
                        </Card>
                    </div>
                </div>
            </MenuDrawer>
        )
    }
}