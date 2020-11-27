import React, {
    Component,
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
import {boolOr, Pair, Triple, ContextType} from "./TsUtilities";

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

let persistentErrorState: Triple<string, boolean, string> = Triple.make("", false, "");
let setPersistentErrorState: Dispatch<SetStateAction<Triple<string, boolean, string>>> = value => {};

export class DialogBuilder {
    readonly open: boolean;
    _title: string = "";
    _text: string = "";
    _buttonList: LinkedList<ButtonObject> = new LinkedList();
    actionButton: any = undefined;
    handleClose: DialogOnClick | Dispatch<SetStateAction<boolean>> = (dialogBuilder, event) => new DOMException("Handle Close nicht überschrieben");
    input: InputObject | undefined = undefined;
    content: ((dialogBuilder: DialogBuilder) => JSX.Element) | undefined = undefined;
    // persistentErrorState: Triple<string, boolean, string>


    //  ------------------------- Constructor ------------------------->
    constructor(open: boolean, handleClose: DialogOnClick | Dispatch<SetStateAction<boolean>>) {
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

    setHandleClose(handleClose: DialogOnClick | Dispatch<SetStateAction<boolean>>): DialogBuilder {
        this.handleClose = (dialogBuilder, event) => {
            if (handleClose.name === "bound dispatchAction")
                (handleClose as Dispatch<SetStateAction<boolean>>)(false);
            else
                (handleClose as DialogOnClick)(dialogBuilder, event);

            if (this.input) {
                this.validate(this.input.initialValue ? this.input.initialValue : "");
                setPersistentErrorState(persistentErrorState)
            } else
                setPersistentErrorState(Triple.make("", false, ""));
        };
        return this;
    }

    setInput(input: InputObject): DialogBuilder {
        this.input = input;
        if (input.initialValue) {
            persistentErrorState.third = input.initialValue;
            setPersistentErrorState(persistentErrorState)
        }
        return this;
    }

    getInputText() {
        return persistentErrorState.third;
    }

    setContent(content: (dialogBuilder: DialogBuilder) => JSX.Element): DialogBuilder {
        this.content = content;
        return this;
    }
    //  <------------------------- Getter & Setter -------------------------


    //  ------------------------- Build ------------------------->
    validate(newValue: string) {
        // @ts-ignore
        let result = this.input.inputValidator(newValue, persistentErrorState, this);
        if (typeof result === "string")
            persistentErrorState = Triple.make(result, !!result, newValue);
        else if (result instanceof Pair) {
            persistentErrorState = Triple.make(result.first, result.second, newValue)
        } else
            persistentErrorState = result;
    }

    // @ts-ignore
    build(): Dialog {
        return <Builder context={this}/>
    }
    //  <------------------------- Build -------------------------


    //  ------------------------- Convenience ------------------------->
    dismiss(event?: any): DialogBuilder {
        if (this.handleClose.name === "DialogOnClick")
            (this.handleClose as DialogOnClick)(this, event);
        else
            (this.handleClose as Dispatch<SetStateAction<boolean>>)(false);
        return this;
    }
    //  <------------------------- Convenience -------------------------
}

function Builder({context}: ContextType<DialogBuilder>) {
    let state = useState(() => {
        if (context.input) {
            if (context.input.inputValidator) {
                context.validate(context.input.initialValue ? context.input.initialValue : "")
            }
        } else
            persistentErrorState = Triple.make("", false, "");

        return persistentErrorState;
    });
    persistentErrorState = state[0];
    setPersistentErrorState = state[1];
    return (
        <Dialog open={context.open} onClose={event => context.dismiss(event)}>
            <DialogTitle id="form-dialog-title">{context.title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {context.text}
                </DialogContentText>
                {buildInput(context)}
                {context.content ? context.content(context) : null}
            </DialogContent>
            <DialogActions>
                {context._buttonList.toArray().map(buttonObject => {
                    let buttonColor: PropTypes.Color = (boolOr(buttonObject.color, 'inherit', 'primary', 'secondary', 'default') ? buttonObject.color : undefined) as PropTypes.Color;
                    if (!buttonColor && buttonObject.isActionButton && !buttonObject.color)
                        buttonColor = "primary";
                    return (
                        <Button variant={buttonColor ? "contained" : undefined}
                                color={buttonColor} onClick={event => {
                            if (buttonObject.onClick)
                                buttonObject.onClick(context, event)

                            if (boolOr(buttonObject.dismissOnClick, undefined, true))
                                context.dismiss(event)
                        }} id={buttonObject.id}
                                startIcon={buttonObject.iconAtStart && buttonObject.icon ? buttonObject.icon : undefined}
                                endIcon={!buttonObject.iconAtStart && buttonObject.icon ? buttonObject.icon : undefined}
                                style={{
                                    backgroundColor: !buttonColor && buttonObject.color ? buttonObject.color : undefined,
                                    color: buttonObject.textColor, ...buttonObject.style
                                }}
                                ref={element => {
                                    if (buttonObject.isActionButton) {
                                        context.actionButton = element;
                                    }
                                    if (buttonObject.getRef !== undefined) {
                                        // @ts-ignore
                                        buttonObject.getRef(element);
                                    }
                                }}
                                disabled={buttonObject.isActionButton && persistentErrorState.second}>
                            {buttonObject.label}
                        </Button>
                    )
                })}
            </DialogActions>
        </Dialog>
    )
}

function buildInput(context: DialogBuilder) {
    if (context.input === undefined)
        return null;
    // setPersistentErrorState = setPersistentErrorState;
    // persistentErrorState = persistentErrorState;

    return (
        <TextField
            autoFocus
            margin="dense"
            label={context.input.label}
            fullWidth
            onKeyPress={(event) => {
                if (event.key === 'Enter' && !persistentErrorState.second) {
                    if (context.actionButton) {
                        context.actionButton.click();
                    }
                }
            }}
            error={!!persistentErrorState.first}
            helperText={persistentErrorState.first}
            onChange={context.input.inputValidator ? event => {
                context.validate(event.target.value);
                setPersistentErrorState(persistentErrorState)
            } : undefined}
            value={persistentErrorState.third}
            placeholder={context.input.hint}
        />
    )
}
