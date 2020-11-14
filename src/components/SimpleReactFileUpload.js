import React from 'react'
import {updateArticle} from "../services/ItemApiUtil";
import {showToast} from "../Utilities/Utilities";


class SimpleReactFileUpload extends React.Component {
    onFileSelected;
    constructor(props) {
        super(props);
        this.state ={
            file:null,
        };
        this.onFileSelected = this.props.onFileSelected;
        this.onClickHandler = this.onClickHandler.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this)
    }

    onFormSubmit(e){
        e.preventDefault(); // Stop form submit
        this.onClickHandler();
    }


    onChangeHandler=event=>{
        let file = event.target.files[0];
        this.onFileSelected(file);
        this.setState({
            selectedFile: file,
            loaded: 0,
        })
    };
    onClickHandler = () => {
        var payload =  {
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
        updateArticle(payload, this.state.selectedFile, ()=>{
            showToast('Artikel wurde erfolgreich erstellt', "success");
        }, (error)=>{
            showToast('Artikel erstellen fehlgeschlagen: ' + error.message, "error");
        })
    };
    render() {
        return (
            <div>
                <div className="form-group files">
                    <label>Artikelbild hochladen </label>
                    <input type="file" name="file" onChange={this.onChangeHandler}/>
                </div>
            </div>
            )
    }
}

export default SimpleReactFileUpload