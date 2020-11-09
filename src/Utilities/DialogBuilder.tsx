import React, {
    Dispatch,
    MouseEventHandler,
    ReactNode,
    RefObject,
    SetStateAction,
    useState
} from "react";
import * as Collections from 'typescript-collections';
import {LinkedList} from "typescript-collections";
import Dialog from "@material-ui/core/Dialog";
import {
    Button,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, InputProps as StandardInputProps, PropTypes,
    TextField
} from "@material-ui/core";
import {boolOr, Pair, Triple} from "./TsUtilities";

interface ButtonObject {
    label: string;
    color?: PropTypes.Color | string;
    textColor?: string
    icon?: ReactNode;
    iconAtStart?: boolean;
    onClick?: DialogOnClick;
    dismissOnClick?: boolean;
    id?: string
    style?: React.CSSProperties;
    getRef?: (button?: any) => void;
    isActionButton?: boolean;
}

interface DialogOnClick {
    (dialogBuilder: DialogBuilder, event?: any): void;
}

interface InputObject {
    label?: string;
    initialValue?: string
    inputValidator?: (text: string, dialogErrorState: Triple<string, boolean, string>, dialogBuilder: DialogBuilder) => Triple<string, boolean, string> | Pair<string, boolean> | string
    hint?: string;
}

export class DialogBuilder {
    private readonly open: boolean;
    private _title: string = "";
    private _text: string = "";
    private _buttonList: LinkedList<ButtonObject> = new LinkedList();
    private actionButton: any = undefined;
    private handleClose: DialogOnClick = (dialogBuilder, event) => new DOMException("Handle Close nicht überschrieben");
    private input: InputObject | undefined = undefined;
    private dialogErrorState: Triple<string, boolean, string> = Triple.make("", false, "");
    private setPersistentErrorState:Dispatch<SetStateAction<Triple<string, boolean, string>>> = value => {};


    //  ------------------------- Constructor ------------------------->
    constructor(open: boolean, handleClose: DialogOnClick) {
        this.open = open;
        if (handleClose)
            this.setHandleClose(handleClose);
    }
    //  <------------------------- Constructor -------------------------


    //  ------------------------- Getter & Setter ------------------------->
    get title(): string {
        return this._title;
    }

    set title(value: string) {
        this._title = value;
    }

    setTitle(title: string): DialogBuilder {
        this.title = title;
        return this;
    }

    get text(): string {
        return this._text;
    }

    set text(value: string) {
        this._text = value;
    }

    setText(text: string): DialogBuilder {
        this.text = text;
        return this;
    }

    addButton(button: ButtonObject | string): DialogBuilder {
        if (typeof button === "string")
            this._buttonList.add({label: (button as string)});
        else
            this._buttonList.add((button as ButtonObject));
        return this;
    }

    setHandleClose(handleClose: (dialogBuilder: DialogBuilder, event: any) => void): DialogBuilder {
        this.handleClose = (dialogBuilder, event) => {
            handleClose(dialogBuilder, event);
            if (this.input) {
                this.validate(this.input.initialValue ? this.input.initialValue : "");
                this.setPersistentErrorState(this.dialogErrorState)
            }
        };
        return this;
    }

    setInput(input: InputObject): DialogBuilder {
        this.input = input;
        return this;
    }

    getInputText() {
        return this.dialogErrorState.third;
    }
    //  <------------------------- Getter & Setter -------------------------


    //  ------------------------- Build ------------------------->
    // @ts-ignore
    private buildInput(): TextField {
        if (this.input === undefined)
            return null;
        const [persistentErrorState, setPersistentErrorState] = useState(() => {
            if (this.input){
                if (this.input.inputValidator) {
                    this.validate(this.input.initialValue? this.input.initialValue : "")
                }
            }
            return this.dialogErrorState;
        });
        this.setPersistentErrorState = setPersistentErrorState;
        this.dialogErrorState = persistentErrorState;
        return (
            <TextField
                autoFocus
                margin="dense"
                label={this.input.label}
                fullWidth
                onKeyPress={(event) => {
                    if (event.key === 'Enter' && !persistentErrorState.second) {
                        if (this.actionButton) {
                            this.actionButton.click();
                        }
                    }
                }}
                error={!!this.dialogErrorState.first}
                helperText={this.dialogErrorState.first}
                onChange={this.input.inputValidator ? event => {
                    this.validate(event.target.value)
                    setPersistentErrorState(this.dialogErrorState)
                } : undefined}
                value={this.dialogErrorState.third}
                placeholder={this.input.hint}
            />
        )
    }

    validate(newValue: string) {
        // @ts-ignore
        let result = this.input.inputValidator(newValue, this.dialogErrorState, this);
        if (typeof result === "string")
            this.dialogErrorState = Triple.make(result, !!result, newValue);
        else if (result instanceof Pair) {
            this.dialogErrorState = Triple.make(result.first, result.second, newValue)
        } else
            this.dialogErrorState = result;
    }

    // @ts-ignore
    build(): Dialog {
        return (
            <Dialog open={this.open} onClose={event => this.handleClose(this, event)}>
                <DialogTitle id="form-dialog-title">{this.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {this.text}
                    </DialogContentText>
                    {this.buildInput()}
                </DialogContent>
                <DialogActions>
                    {this._buttonList.toArray().map(buttonObject => {
                        let buttonColor: PropTypes.Color = (boolOr(buttonObject.color, 'inherit', 'primary', 'secondary', 'default') ? buttonObject.color : undefined) as PropTypes.Color;
                        if (!buttonColor && buttonObject.isActionButton)
                            buttonColor = "primary";
                        return (
                            <Button variant={buttonColor ? "contained" : undefined}
                                    color={buttonColor} onClick={event => {
                                if (buttonObject.onClick)
                                    buttonObject.onClick(this, event)

                                if (boolOr(buttonObject.dismissOnClick, undefined, true))
                                    this.handleClose(this, event)
                            }} id={buttonObject.id}
                                    startIcon={buttonObject.iconAtStart && buttonObject.icon ? buttonObject.icon : undefined}
                                    endIcon={!buttonObject.iconAtStart && buttonObject.icon ? buttonObject.icon : undefined}
                                    style={{
                                        backgroundColor: !buttonColor && buttonObject.color ? buttonObject.color : undefined,
                                        color: buttonObject.textColor, ...buttonObject.style
                                    }}
                                    ref={element => {
                                        if (buttonObject.isActionButton) {
                                            this.actionButton = element;
                                        }
                                        if (buttonObject.getRef !== undefined) {
                                            // @ts-ignore
                                            buttonObject.getRef(element);
                                        }
                                    }}
                                    disabled={buttonObject.isActionButton && this.dialogErrorState.second}>
                                {buttonObject.label}
                            </Button>
                        )
                    })}
                </DialogActions>
            </Dialog>
        )
    }

    //  <------------------------- Build -------------------------


    //  ------------------------- Convenience ------------------------->
    dismiss(): DialogBuilder {
        this.handleClose(this);
        return this;
    }

    //  <------------------------- Convenience -------------------------
}