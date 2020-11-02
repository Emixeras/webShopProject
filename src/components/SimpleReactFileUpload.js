import React from 'react'
import axios from 'axios';


class SimpleReactFileUpload extends React.Component {

    constructor(props) {
        super(props);
        this.state ={
            file:null,
        }
        this.onFormSubmit = this.onFormSubmit.bind(this)
        this.onChange = this.onChange.bind(this)
        this.fileUpload = this.fileUpload.bind(this)
    }

    onFormSubmit(e){
        e.preventDefault() // Stop form submit
        this.fileUpload(this.state.file)
    }

    onChange(e) {
        this.setState({file:e.target.files[0]})
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
            <form onSubmit={this.onFormSubmit}>
                <h1>File Upload</h1>
                <input type="file" onChange={this.onChange} />
                <button type="submit">Upload</button>
            </form>
        )
    }
}

export default SimpleReactFileUpload