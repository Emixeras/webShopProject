import React from 'react'
import axios from 'axios';


class SimpleReactFileUpload extends React.Component {

    constructor(props) {
        super(props);
        this.state ={
            file:null,
        }
        this.onClickHandler = this.onClickHandler.bind(this)
        this.onChangeHandler = this.onChangeHandler.bind(this)
        this.fileUpload = this.fileUpload.bind(this)
    }

    onFormSubmit(e){
        e.preventDefault() // Stop form submit
        this.fileUpload(this.state.file)
    }


    onChangeHandler=event=>{
        this.setState({
            selectedFile: event.target.files[0],
            loaded: 0,
        })
    }
    onClickHandler = () => {
        const data = new FormData()
        data.append('file', this.state.selectedFile)
        this.fileUpload(data)
    }
    fileUpload(file){
        //todo insert data from UI here
        var payload = {

            "artists": {
                "name": "POSTMAN"
            },
            "description": "PENIS",
            "ean": 123,
            "genre": {

                "name": "rock"
            },
            "price": 12.99,
            "title": "desc1"
        }
        const json = JSON.stringify(payload);
        const blob = new Blob([json], {
            type: 'application/json'
        });
        const url = 'http://localhost:8080/article';
        const formData = new FormData();
        formData.append('ArticlePicture',file)
        formData.append('ArticleMetadata',blob)
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        axios.post(url, formData,config)
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
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