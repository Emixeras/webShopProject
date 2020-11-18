import React from 'react'
import {updateArticle} from "../services/ItemApiUtil";
import {showToast} from "../Utilities/Utilities";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";


class SimpleReactFileUpload extends React.Component {
    onFileSelected;

    constructor(props) {
        super(props);
        this.state = {
            file: null,
            visible: false,
            defaultVisibility: true,
        };
        this.onFileSelected = this.props.onFileSelected;
        if (this.props.setDefaultVisibility) {
            this.props.setDefaultVisibility(visibility => this.setState({defaultVisibility: visibility}))
        }
        this.onClickHandler = this.onClickHandler.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this)
    }

    onFormSubmit(e) {
        e.preventDefault(); // Stop form submit
        this.onClickHandler();
    }


    onChangeHandler = event => {
        let file = event.target.files[0];
        this.onFileSelected(file);
        this.setState({
            selectedFile: file,
            loaded: 0,
        })
    };
    onClickHandler = () => {
        var payload = {
            "artists": {
                "id": 2,
                "name": "Britney Spears"
            },
            "description": "Fusce consequat.",
            "ean": 2967861,
            "genre": {
                "id": 14,
                "name": "Techno"
            },
            "id": 2,
            "price": 38.44,
            "title": "Graham, Beahan and Jacobs"
        };
        updateArticle(payload, this.state.selectedFile, () => {
            showToast('Artikel wurde erfolgreich erstellt', "success");
        }, (error) => {
            showToast('Artikel erstellen fehlgeschlagen: ' + error.message, "error");
        })
    };

    render() {
        let showUpload = this.state.defaultVisibility || this.state.visible;
        return (
            <div style={{width: "100%", height: "100%"}}
                 onMouseEnter={event => this.setState({visible: true})}
                 onMouseLeave={event => this.setState({visible: false})}>
                {showUpload &&
                    <div className="form-group files"
                         style={!this.state.defaultVisibility ? {/*backgroundColor: "rgba(255,255,255,0.8)",*/
                             height: "100%"
                         } : {height: "100%"}}>
                        <Button color={"primary"} variant="contained" style={{
                            position: "absolute",
                            opacity: (this.state.defaultVisibility ? 1 : 0.8),
                            fontWeight: 600
                        }}
                                onClick={event => document.getElementById("upload-photo-button").click()}>Öffnen</Button>
                        <input style={{opacity: 0, position: "absolute", zIndex: -1}}
                               type="file" name="photo" id="upload-photo-button"
                               onChange={this.onChangeHandler}/>
                               <Typography style={{width: "100%", opacity: 1, position: "absolute", zIndex: 1, textAlign: "center", color: "white", fontWeight: 600, marginTop: "170px"}}>
                                   oder hierher ziehen
                               </Typography>
                    </div>}
            </div>
        )
    }
}

export default SimpleReactFileUpload