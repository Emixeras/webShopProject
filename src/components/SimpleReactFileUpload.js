import React from 'react'
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";


/**
 * The main Component of SimpleReactFileUpload.js
 */
class SimpleReactFileUpload extends React.Component {

    inputRef;

    constructor(props) {
        super(props);
        this.state = {
            file: null,
            visible: false,
            defaultVisibility: true,
            onFileSelected: this.props.onFileSelected,
        };
        if (this.props.setDefaultVisibility) {
            this.props.setDefaultVisibility(visibility => this.setState({defaultVisibility: visibility}))
        }
    }

    /**
     * Drag and Drop Handlerfunktion
     * @param event
     */
    onDrop = event => {
        event.stopPropagation();
        event.preventDefault();

        let file;
        if (event.target && event.target.files)
            file = event.target.files[0];
        else
            file = event.dataTransfer.files[0];
        if (file) {
            if (this.state.onFileSelected) {
                this.state.onFileSelected(file);
            }
            this.setState({
                selectedFile: file,
                loaded: 0,
            })
        }
    };

    render() {
        let showUpload = this.state.defaultVisibility || this.state.visible;
        let preventDefault = (event) => {
            event.stopPropagation();
            event.preventDefault();
        };
        return (
            <div style={{width: "100%", height: "100%"}}
                 onMouseEnter={event => {
                     if (!this.state.defaultVisibility)
                        this.setState({visible: true});
                 }}
                 onMouseLeave={event => {
                     if (!this.state.defaultVisibility)
                         this.setState({visible: false});
                 }}>
                {
                <div className={`files ${this.state.defaultVisibility ? "" :"image-opacity"}`}
                     style={this.state.defaultVisibility ? {height: "100%"} : {
                         height: "100%",
                         opacity: +showUpload
                     }}>
                    <Button color={"primary"}
                            variant="contained"
                            style={{
                                position: "absolute",
                                opacity: (this.state.defaultVisibility ? 1 : 0.8),
                                fontWeight: 600
                            }}
                            onFocus={event => {
                                if (!this.state.defaultVisibility)
                                    this.setState({visible: true});
                            }}
                            onBlur={event => {
                                if (!this.state.defaultVisibility)
                                    this.setState({visible: false});
                            }}
                            onDragEnter={preventDefault}
                            onDragLeave={preventDefault}
                            onDragOver={preventDefault}
                            onDrop={this.onDrop}
                            onClick={event => this.inputRef ? this.inputRef.click() : null}>
                        Öffnen
                    </Button>
                    <input
                        style={{
                            opacity: 0,
                            position: "absolute",
                            zIndex: -1,
                            height: "100%",
                            width: "100%",

                        }}
                        tabIndex={-1}
                        ref={instance => this.inputRef = instance}
                        type="file" name="photo" id="upload-photo-button"
                        onChange={this.onDrop}/>
                    <Typography
                        style={{
                            width: "100%",
                            opacity: (this.state.defaultVisibility ? 1 : 0.8),
                            position: "absolute",
                            zIndex: 1,
                            textAlign: "center",
                            color: "white",
                            fontWeight: 600,
                            marginTop: "170px"
                        }}
                        onDragEnter={preventDefault}
                        onDragLeave={preventDefault}
                        onDragOver={preventDefault}
                        onDrop={this.onDrop}
                    >
                        oder hierher ziehen
                    </Typography>
                </div>}
            </div>
        )
    }
}

export default SimpleReactFileUpload