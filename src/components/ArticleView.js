import React from 'react'
import {Grid, Card, TextField, Button, Typography, hexToRgb, IconButton} from "@material-ui/core";
import MenuDrawer from "./MenuDrawer";






class ArticleView extends React.Component {



    render() {
        return (
            <div>
                <MenuDrawer/>
                <div style={{
                    marginTop: 8,
                    marginInlineStart: (this.drawerState ? 240 : 0),
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <Grid container
                          style={{width: '85%', maxWidth: "800px"}}
                          spacing={5}>
                        {this.generateView()}
                    </Grid>
                </div>
            </div>
        )
    }


    generateView(){
       


    }






}
export default ArticleView;