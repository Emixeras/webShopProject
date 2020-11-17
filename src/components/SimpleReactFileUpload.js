import React from 'react'
import {updateArticle} from "../services/ItemApiUtil";
import {showToast} from "../Utilities/Utilities";
import Button from "@material-ui/core/Button";


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
                     style={!this.state.defaultVisibility ? {backgroundColor: "rgba(255,255,255,0.8)", height: "100%"} : undefined}>
                    {/*<Button style={{position: "absolute",}} onClick={event => document.getElementById("upload-photo-button").click()}>Öffnen</Button>*/}
                    <input /*style={{opacity: 1, position: "absolute", zIndex: -1}}*/
                           type="file" name="photo" id="upload-photo-button" onChange={this.onChangeHandler}/>
                </div>}
            </div>
        )
    }
}

export default SimpleReactFileUpload