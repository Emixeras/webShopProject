import React, {Component} from 'react';
import {NavigationComponent} from "../Utilities/Utilities";
import Grid from "@material-ui/core/Grid";
import {
    Card,
    Button,
    FormControl,
} from '@material-ui/core';
import MenuDrawer from "./MenuDrawer";
import 'react-toastify/dist/ReactToastify.css';
import {padding} from "../Utilities/Utilities";
import {
    isUserLoggedIn
} from "../services/StorageUtil";
import HorizontalLabelPositionBelowStepper from "./Stepper";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import {useHistory} from "react-router-dom";


class PaymentMethod extends Component {

    user = {};

    constructor(props) {
        super(props);
        this.state = {
            paymentMethod: -1,
        };

    }

    render() {
        if (isUserLoggedIn()) {
            return (
                <MenuDrawer>
                    <HorizontalLabelPositionBelowStepper index={1}/>
                    <div style={{
                        marginTop: 8,
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <Grid container
                              style={{width: '85%', maxWidth: "800px"}}
                              spacing={3}>
                            <Grid item xs={12}>
                                <Card style={padding(18)}>
                                    <Grid
                                        container
                                        direction="column">
                                        <Grid item fullWidth>
                                            <div style={{
                                                textAlign: "start",
                                                fontSize: 22,
                                                marginBottom: 3
                                            }}>
                                                Bezahlmethode wählen
                                            </div>
                                        </Grid>
                                        <Grid item>
                                            <RadioButtonsGroup/>
                                        </Grid>
                                    </Grid>
                                </Card>
                            </Grid>
                            <Grid item>
                                <div style={{marginBottom: 8}}/>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container
                                      justify="space-between"
                                      wrap={"wrap-reverse"}
                                      direction="row"
                                      spacing={3}>
                                    <Grid item>
                                        <BackButton context={this}/>
                                    </Grid>
                                    <Grid item>
                                        <ContinueButton context={this}/>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </div>
                </MenuDrawer>
            )
        } else {
            return <NavigationComponent to={"/login"}/>;
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.scrollHelper.first !== this.editMode) {
            this.scrollHelper.first = this.editMode;
            if (this.scrollHelper.third)
                window.scrollBy(0, this.scrollHelper.third.getBoundingClientRect().top - this.scrollHelper.second)
        }
    }
    handleChange = event => this.setState({title: event.target.value.trim()});

}
function BackButton(){
    const history = useHistory();
    let backToShoppingCart = () => {
        history.push("/placeorder")
    };

    return (
        <Button
            variant="contained"
            color="secondary"
            onClick={() => {
                backToShoppingCart()
            }
            }>
            Zurück
        </Button>
    )
}
function ContinueButton(){
    const history = useHistory();
    let continueToSummary = () => {
        history.push("/ordersummary")
    };

    return (
        <Button
            style={{backgroundColor: "green"}}
            variant="contained"
            color="primary"
            onClick={() => {
                continueToSummary()
            }
            }>
            Weiter
        </Button>
    )
}
function RadioButtonsGroup() {
    const [value, setValue] = React.useState('female');

    const handleChange = (event) => {
        console.log(event.target.value)
        setValue(event.target.value);
    };

    return (
        <FormControl component="fieldset">
            <FormLabel component="legend"/>
            <RadioGroup aria-label="gender" name="gender1" value={value} onChange={handleChange}>
                <FormControlLabel value="0" control={<Radio />} label="Vorkasse" />
                <FormControlLabel value="1" control={<Radio />} label="Rechnung" />
                <FormControlLabel value="2" disabled control={<Radio />} label="(Kreditkarte)" />
                <FormControlLabel value="3" disabled control={<Radio />} label="(Paypal)" />
                <FormControlLabel value="3" disabled control={<Radio />} label="(Bitcoins)" />
            </RadioGroup>
        </FormControl>
    );
}

export default PaymentMethod;