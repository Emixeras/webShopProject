import React from "react";
import MenuDrawer from "./MenuDrawer";
import Grid from "@material-ui/core/Grid";
import {isMobile} from "../Utilities/Utilities";
import {Card, Typography} from "@material-ui/core";

interface Impressum_props {

}

interface Impressum_state {

}

export default class SideNotice extends React.Component<Impressum_props, Impressum_state>{
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