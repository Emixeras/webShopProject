import React from 'react'
import { Grid, Card, TextField, Button, Typography, hexToRgb, IconButton } from "@material-ui/core";
import MenuDrawer from "./MenuDrawer";
import { addDrawerCallback, isDrawerVisible, removeDrawerCallback } from "../services/StorageUtil";
import { padding, showToast } from "../Utilities/Utilities";



interface Article {
    id: number;
    title: string;
    description: string;
    ean: number;
    price: string;
    artists: string;
    genre: string;
}

class ArticleView extends React.Component {

    drawerState: boolean = isDrawerVisible();

    render() {
        return (

            this.Components.map(category => {
                return (
                    <div>
                        <MenuDrawer />
                        <div style={{
                            marginTop: 8,
                            marginInlineStart: (this.drawerState ? 240 : 0),
                            display: 'flex',
                            justifyContent: 'center'
                        }}>
                            <Grid container
                                style={{ width: '85%', maxWidth: "800px" }}
                                spacing={3}>
                                <Grid item xs={12}>
                                    <Typography component="h1" variant="h2" align={"center"}>
                                        {category.title}
                                    </Typography>
                                    <Card style={padding(18)}>
                                        <Grid container spacing={4}>
                                            <Grid item xs={12}>
                                                <Card style={padding(18)}>
                                                    <Grid container spacing={2}>
                                                    <Grid item sm={8} xs={12}>
                                                            <Typography component="h1" variant="h4" align={"left"}>
                                                                {"Artist:"}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item sm={4} xs={12}>
                                                            <Typography component="h1" variant="h4" align={"left"}>
                                                                {"Genre:"}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item sm={8} xs={12}>
                                                            <Typography component="h1" variant="h5" align={"left"}>
                                                                {category.artist}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item sm={4} xs={12}>
                                                            <Typography component="h1" variant="h5" align={"left"}>
                                                                {category.genre}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item sm={6} xs={12}>
                                                            <Grid container style={{ alignItems: "center" }} spacing={1}>
                                                            <Grid item xs={11}>
                                                                    <Typography component="h1" variant="h4" align={"left"}>
                                                                        {"Preis:"}
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item xs={11}>
                                                                    <Typography component="h1" variant="h5" align={"left"}>
                                                                        {category.price}
                                                                    </Typography>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Card>
                                                <Grid item>
                                                <Button style={{
                                                    backgroundColor: "#61affe",
                                                    fontWeight: "bold",
                                                    color: "#FFFFFF",
                                                    alignItems: "center"
                                                }} onClick={(event) => {
                                                            showToast("Artikel Erfolgreich hinzugefügt", "success");
                                                }}>
                                                    {"Artikel in den Warenkorb hinzufügen"}
                                                </Button>
                                            </Grid>
                                                <Card style={padding(18)}>
                                                    <Grid container spacing={2}>
                                                        <Grid item sm={12} xs={12}>
                                                            <Typography component="h1" variant="h6" align={"left"}>
                                                                {category.description}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Card>
                                            </Grid>
                                        </Grid>
                                    </Card>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                )
            }
            ))
    }

    Components = [
        {
            title: "The Show Must Go On",
            artist: "Rammstein",
            genre: "Rock",
            price: "16.20€",
            description: "test Api - provides basic test Functions and example Data. test Api - provides basic test Functions and example Data. test Api - provides basic test Functions and example Data"
        }
    ]


}
export default ArticleView;