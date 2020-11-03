import * as React from "react";
import {Grid, Paper,Button} from "@material-ui/core";

export default class EditArticles extends React.Component {
    test = ["DELETE", "GET", "PUT", "POST", "DELETE"];

    buttonColors = {
        "GET":"#61affe",
        "PUT":"#fca130",
        "POST":"#49cc90",
        "DELETE":"#f93e3e"
    };

    render() {

        return (
            <Grid container spacing={3}>
                {
                    this.test.map(value => {
                        return (
                            <Grid item xs={12}>
                                <Button color={"#ff5c5c"}>{value}</Button>
                            </Grid>
                        )
                    })
                }
            </Grid>
        )

    }

}