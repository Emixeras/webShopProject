import React from 'react'
import {createNewArticle, updateArticle} from "../services/ItemApiUtil";
import {showToast} from "../Utilities/Utilities";


class SimpleReactFileUpload extends React.Component {

    constructor(props) {
        super(props);
        this.state ={
            file:null,
        }
        this.onClickHandler = this.onClickHandler.bind(this)
        this.onChangeHandler = this.onChangeHandler.bind(this)
    }

    onFormSubmit(e){
        e.preventDefault() // Stop form submit
        this.onClickHandler();
    }


    onChangeHandler=event=>{
        this.setState({
            selectedFile: event.target.files[0],
            loaded: 0,
        })
    }
    onClickHandler = () => {
        var payload = {

            "artists": {
                "name": "POSTMAN"
            },
            "id":1,
            "description": "penis",
            "ean": 123,
            "genre": {
                "name": "rock"
            },
            "price": 12.98,
            "title": "desc1"
        }
        updateArticle(payload, this.state.selectedFile, ()=>{
            showToast('Artikel wurde erfolgreich erstellt', "success");
        }, (error)=>{
            showToast('Artikel erstellen fehlgeschlagen: ' + error.message, "error");
        })
    }
    render() {
        return (
            <div  className="container">
                <div className="row">
                    <div style={{alignSelf: 'center'}}  className="col-md-6">
                        <form style={{alignSelf: 'center'}}   method="post" action="#" id="#">
                            <div className="form-group files">
                                <label>Upload Your File </label>
                                <input type="file" name="file" onChange={this.onChangeHandler}/>
                            </div>
                            <button type="button" className="btn btn-success btn-block"
                                    onClick={this.onClickHandler}>Upload
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            )
    }
}

export default SimpleReactFileUpload