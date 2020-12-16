import * as React from "react";
import {useState} from "react";
import {
    Button,
    Card,
    Grid,
    IconButton,
    InputAdornment,
    TextField, Tooltip,
    Typography,
} from "@material-ui/core";
import MenuDrawer from "./MenuDrawer";
import {
    deepEqual,
    isMobile,
    margin,
    padding,
    shallowEqual,
    showToast
} from "../Utilities/Utilities";
import SimpleReactFileUpload from "./SimpleReactFileUpload";
import {Combobox} from 'react-widgets'
import 'react-widgets/dist/css/react-widgets.css';
import EditIcon from '@material-ui/icons/Edit';
import ClearIcon from '@material-ui/icons/Clear';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import CopyIcon from '@material-ui/icons/FileCopy';
import SaveIcon from "@material-ui/icons/Save";
import {DialogBuilder} from "../Utilities/DialogBuilder";
import {
    base64ToDataUri,
    ContextType,
    filterArticle,
    LazyImage,
    loadSingleImage,
    artistOrGenre_comparator,
    Pair,
    RestrictedPage,  Article
} from "../Utilities/TsUtilities";
import {createNewArticle, deleteArticle, updateArticle} from "../services/ItemApiUtil";
import {createNewArtist, deleteArtist, updateArtist} from "../services/ArtistApiUtil";

interface IProps {
    // @ts-ignore
    location: history.Location;
}

interface IState {
    id: number;
    title: string
    description?: string
    ean: number;
    price: string;
    artists?: ArtistOrGenre;
    genre?: ArtistOrGenre;
    articlePicture?: { id: number };
}

interface ArtistOrGenre {
    id: number;
    name: string;
    file?: string;
}

const initialState = {
    id: -1,
    title: "",
    price: "",
    ean: -1,
    description: "",
    artists: undefined,
    genre: undefined,
    articlePicture: undefined,
};

export default class EditArticles extends React.Component<IProps, IState> {
    currentPicture: File | undefined = undefined;
    setFileUploadDefaultVisibility: (visibility: boolean) => void = visibility => {
    };
    articles: Array<Article> = [];
    artists: Array<ArtistOrGenre> = [];
    genres: Array<ArtistOrGenre> = [];
    selectArticle_input: string = "";
    selectedArticle?: Article;

    constructor(props: IProps, context: any) {
        super(props, context);
        this.state = initialState;

        if (this.props.location.state)
            this.state = this.selectedArticle = this.props.location.state.article;
        this.loadData();
        window.scrollTo(0, 0);
    }

    loadData() {
        let pendingRequests = 3;
        fetch(new Request(`http://${window.location.hostname}:8080/article`, {method: 'GET'}))
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error(`Fehler bei der Anfrage: ${response.status} ${response.statusText}`);
                }
            })
            .then((response: Array<Article>) => {
                response.sort((a, b) => a.id - b.id);

                this.articles = response;


                if (--pendingRequests === 0)
                    this.forceUpdate()
            })
            .catch(reason => {
                showToast(reason.message, "error")
            });

        this.loadArtists(() => {
            if (--pendingRequests === 0)
                this.forceUpdate()
        })

        fetch(new Request(`http://${window.location.hostname}:8080/genre`, {method: 'GET'}))
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error(`Fehler bei der Anfrage: ${response.status} ${response.statusText}`);
                }
            })
            .then((response: object) => {

                this.genres = [];
                Object.keys(response).forEach((key) => {
                    // @ts-ignore
                    this.genres.push(response[key].genre);
                });

                this.genres.sort(artistOrGenre_comparator)

                if (--pendingRequests === 0)
                    this.forceUpdate()
            })
            .catch(reason => {
                showToast(reason.message, "error")
            })
    }

    loadArtists(onLoaded: () => void) {
        fetch(new Request(`http://${window.location.hostname}:8080/artist`, {method: 'GET'}))
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error(`Fehler bei der Anfrage: ${response.status} ${response.statusText}`);
                }
            })
            .then((response: Array<ArtistOrGenre>) => {
                this.artists = response;
                this.artists.sort(artistOrGenre_comparator)

                onLoaded();
            })
            .catch(reason => {
                showToast(reason.message, "error")
            })
    }

    checkPriceError = (price: string) => price.length > 0 && !/^(\d+([.,]\d{1,2})?)$/.test(price);

    render() {
        const priceError: boolean = this.checkPriceError(this.state.price);
        const eanError: boolean = !/^(-1|\d{8})$/.test(this.state.ean + "");

        return (
            <RestrictedPage>
                <MenuDrawer >
                    <div style={{
                        marginTop: 5,
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <Grid container
                              style={{width: isMobile() ? '100%' : '85%', maxWidth: "800px"}}
                              spacing={3}>
                            <Grid item xs={12}>
                                <Typography style={{
                                    color: "rgba(0, 0, 0, 0.54)",
                                    fontWeight: 500
                                }}>Artikel</Typography>
                                <Grid container>
                                    <Grid item xs>
                                        <Combobox busy={this.articles.length === 0}
                                                  suggest
                                                  id={"editArticles_selectArticle"}
                                                  textField={(dataItem: Article | string) => typeof dataItem === 'string' ? dataItem :
                                                      'i: ' + dataItem.id +
                                                      ' | t: ' + dataItem.title +
                                                      ' | a: ' + dataItem.artists.name +
                                                      ' | g: ' + dataItem.genre.name +
                                                      ' | p: ' + dataItem.price +
                                                      ' | e: ' + dataItem.ean
                                                  }
                                                  itemComponent={({item}) => {
                                                      if ("true")
                                                          return (
                                                              <table>
                                                                  <tr>
                                                                      <td title={"ID"} style={{
                                                                          width: "60px",
                                                                          textAlign: "left"
                                                                      }}>
                                                                          <strong>i: </strong>
                                                                          {item.id}
                                                                      </td>
                                                                      <td title={"Titel"} style={{
                                                                          width: "210px",
                                                                          textAlign: "left"
                                                                      }}>
                                                                          <strong>t: </strong>
                                                                          {item.title}
                                                                      </td>
                                                                      <td title={"Künstler"}
                                                                          style={{
                                                                              width: "123px",
                                                                              textAlign: "left"
                                                                          }}>
                                                                          <strong>a: </strong>
                                                                          {item.artists.name}
                                                                      </td>
                                                                      <td title={"Genre"} style={{
                                                                          width: "123px",
                                                                          textAlign: "left"
                                                                      }}>
                                                                          <strong>g: </strong>
                                                                          {item.genre.name}
                                                                      </td>
                                                                      <td title={"Preis"} style={{
                                                                          width: "90px",
                                                                          textAlign: "left"
                                                                      }}>
                                                                          <strong>p: </strong>
                                                                          {item.price}
                                                                      </td>
                                                                      <td title={"EAN"} style={{
                                                                          width: "100px",
                                                                          textAlign: "left"
                                                                      }}>
                                                                          <strong>e: </strong>
                                                                          {item.ean}
                                                                      </td>
                                                                  </tr>
                                                              </table>
                                                          );
                                                      return (
                                                          <div>
                                                              <strong>i: </strong>
                                                              {item.id + " | "}
                                                              <strong>t: </strong>
                                                              {item.title + " | "}
                                                              <strong>a: </strong>
                                                              {item.artists.name + " | "}
                                                              <strong>g: </strong>
                                                              {item.genre.name + " | "}
                                                              <strong>p: </strong>
                                                              {item.price + " | "}
                                                              <strong>e: </strong>
                                                              {item.ean}
                                                          </div>
                                                      );
                                                  }}
                                                  filter={(dataItem: Article, searchItem: string): boolean => {
                                                      searchItem = searchItem.toLowerCase().replaceAll("|", "&");

                                                      return filterArticle(searchItem, dataItem);
                                                  }}
                                                  onSelect={(article: Article) => {
                                                      this.currentPicture = undefined;
                                                      this.selectedArticle = article;
                                                      this.setState(article)
                                                  }}
                                                  onChange={value => {
                                                      if (typeof value === "string") {
                                                          this.selectArticle_input = value;
                                                          this.forceUpdate()
                                                      }
                                                  }}
                                                  data={this.articles}
                                                  value={this.state.id !== -1 ? this.state : this.selectArticle_input ? this.selectArticle_input : undefined}
                                                  name={"test"}
                                        />
                                    </Grid>
                                    {(!shallowEqual(initialState, this.state) || this.currentPicture) &&
                                    <Grid item>
                                        <IconButton style={{maxHeight: 38, maxWidth: 38}}
                                                    onClick={event => {
                                                        this.selectArticle_input = "";
                                                        this.currentPicture = undefined;
                                                        this.selectedArticle = undefined;
                                                        this.setState(initialState);
                                                    }}>
                                            {<ClearIcon/>}
                                        </IconButton>
                                    </Grid>}
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Card style={padding(18)}>
                                    <Grid container spacing={2}>
                                        <Grid item sm={9} xs={12}>
                                            <TextField fullWidth
                                                       value={this.state.title}
                                                       label={"Album Titel"}
                                                       onChange={event => this.setState({title: event.target.value})}
                                                       variant={"outlined"}/>
                                        </Grid>
                                        <Grid item sm={3} xs={12}>
                                            <TextField fullWidth
                                                       variant="outlined"
                                                       onChange={event => {
                                                           let newPrice = event.target.value;
                                                           if (newPrice.length === 0 || /^(\d+([.,]\d{0,2})?)$/.test(newPrice))
                                                               this.setState({price: newPrice});
                                                       }}
                                                       error={priceError}
                                                       helperText={priceError ? "Nicht Valide" : ""}
                                                       label={"Preis"}
                                                       value={this.state.price}
                                                       InputProps={{
                                                           endAdornment: <InputAdornment
                                                               position="end">€</InputAdornment>,
                                                       }}
                                            />
                                        </Grid>
                                        <Grid item sm={6} xs={12}>
                                            <Typography style={{
                                                color: "rgba(0, 0, 0, 0.54)",
                                                fontWeight: 500
                                            }}>Künstler</Typography>
                                            <Grid container style={{alignItems: "center"}}
                                                  spacing={1}>
                                                <Grid item xs={11}>
                                                    <Combobox busy={this.articles.length === 0}
                                                              name={"Künstler"}
                                                              textField={"name"}
                                                              filter={"contains"}
                                                              placeholder={"Künstler eingeben"}
                                                              onChange={value => {
                                                                  return this.setState({artists: value});
                                                              }}
                                                              value={this.state.artists}
                                                              data={this.artists}
                                                    />
                                                </Grid>
                                                <Grid item xs={1}>
                                                    <DialogComponent context={this}/>
                                                </Grid>

                                            </Grid>
                                        </Grid>
                                        <Grid item sm={6} xs={12}>
                                            <Typography style={{
                                                color: "rgba(0, 0, 0, 0.54)",
                                                fontWeight: 500
                                            }}>Genre</Typography>
                                            <Combobox busy={this.articles.length === 0}
                                                      textField={"name"}
                                                      filter={"contains"}
                                                      placeholder={"Genre eingeben"}
                                                      onChange={value => this.setState({genre: value})}
                                                      value={this.state.genre}
                                                      data={this.genres}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField fullWidth
                                                       multiline
                                                       style={{height: "100%"}}
                                                       value={this.state.description ? this.state.description : ""}
                                                       onChange={event => this.setState({description: event.target.value})}
                                                       label={"Beschreibung"}
                                                       variant={"outlined"}/>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Grid container spacing={1} wrap={"wrap-reverse"}>
                                                <Grid item sm={8} xs={12}>
                                                    <Typography style={{
                                                        color: "rgba(0, 0, 0, 0.54)",
                                                        fontWeight: 500
                                                    }} variant="h6">Album Cover</Typography>
                                                    <div style={{width: 250, height: 250}}>
                                                        <div style={{
                                                            width: 250,
                                                            height: 250,
                                                            zIndex: 1,
                                                            position: "absolute"
                                                        }}>
                                                            <LazyImage
                                                                style={{
                                                                    width: "100%",
                                                                    height: "100%",
                                                                    zIndex: 5
                                                                }}
                                                                rounded
                                                                alt={this.state.title}
                                                                payload={Pair.make(this.state.id, this.currentPicture)}
                                                                shouldImageUpdate={(oldPayload: Pair<number, File>, newPayload: Pair<number, File>) => {
                                                                    return oldPayload.first !== newPayload.first || oldPayload.second !== newPayload.second
                                                                }}
                                                                getSrc={setImgSrc => {
                                                                    if (this.currentPicture) {
                                                                        setImgSrc(URL.createObjectURL(this.currentPicture));
                                                                        this.setFileUploadDefaultVisibility(false);
                                                                    } else if (this.state.id !== -1) {
                                                                        loadSingleImage("article", this.state.id, imageResponse => {
                                                                            if (imageResponse) {
                                                                                setImgSrc(base64ToDataUri(imageResponse.file));
                                                                                this.setFileUploadDefaultVisibility(false);
                                                                            } else
                                                                                this.setFileUploadDefaultVisibility(true);
                                                                        });
                                                                    } else
                                                                        this.setFileUploadDefaultVisibility(true);

                                                                }}
                                                            />
                                                        </div>
                                                        <div style={{
                                                            width: 250,
                                                            height: 250,
                                                            zIndex: 2,
                                                            position: "absolute",
                                                        }}>
                                                            <SimpleReactFileUpload
                                                                onFileSelected={(file: File) => {
                                                                    this.currentPicture = file;
                                                                    this.forceUpdate();
                                                                }}
                                                                setDefaultVisibility={((setVisibility: (visibility: boolean) => void) => this.setFileUploadDefaultVisibility = setVisibility)}
                                                            />
                                                        </div>
                                                    </div>
                                                </Grid>
                                                <Grid item sm={4} xs={12}>
                                                    <TextField fullWidth
                                                               value={this.state.ean === -1 ? "" : this.state.ean}
                                                               onChange={event => {
                                                                   let newValue = event.target.value;
                                                                   if (/^\d*$/.test(newValue))
                                                                       this.setState({ean: newValue ? +newValue : -1});
                                                               }}
                                                               error={eanError}
                                                               helperText={eanError ? "Keine valide EAN" : ""}
                                                               label={"EAN"}
                                                               variant={"outlined"}/>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <ActionButtons context={this}/>
                                        </Grid>

                                    </Grid>
                                </Card>
                            </Grid>
                        </Grid>
                    </div>
                </MenuDrawer>
            </RestrictedPage>
        )
    }
}

let setIsPictureNotSelected: (visibility: boolean) => void = visibility => {
};

/**
 *
 * @param {EditArticles} context
 * @return {JSX.Element} editButton, grid, addButton, text
 */
function DialogComponent({context}: ContextType<EditArticles>) {
    const artist: ArtistOrGenre = (context.state.artists as ArtistOrGenre);
    let editMode: boolean = typeof artist === "object";
    const [open, setOpen] = React.useState(false);
    const [picture, setPicture] = useState<File>();

    return (
        <div>
            <Tooltip
                title={`Künstler ${editMode ? "Bearbeiten" : "Anlegen"}`}
                placement="top">
                <IconButton style={{maxHeight: 30, maxWidth: 30}}
                            onClick={event => {
                                return setOpen(true);
                            }}
                            onMouseDown={(event) => {
                                event.preventDefault();
                            }}>
                    {<EditIcon/>}
                </IconButton>
            </Tooltip>
            {new DialogBuilder(open, (dialogBuilder: DialogBuilder) => {
                setPicture(undefined)
                setOpen(false);
            })
                .setTitle("Künstler " + (editMode ? `Bearbeiten (${artist.name})` : "Anlegen"))
                .setText(editMode ? "Die Daten des Künstlers bearbeiten und dann auf 'Speichern' klicken" : "Bitte den Namen des neuen Künstlers eingeben und auf 'Anlegen' klicken.")
                .setInput({
                    label: "Künstler Name",
                    initialValue: editMode ? artist.name : undefined,
                    inputValidator: text => {
                        let newInput = text.toLowerCase().trim();
                        if (editMode && artist.name.toLowerCase() === newInput)
                            return Pair.make("", false);
                        let result = "";
                        for (let artist of context.artists) {
                            if (artist.name.toLowerCase() === newInput) {
                                result = "Der Künstler existiert bereits";
                                break
                            }
                        }
                        return Pair.make(result, !text.trim() || !!result);
                    }

                })
                .setContent(dialogBuilder => {
                    return (
                        <Grid container>
                            <Grid item>
                                <div style={{width: 250, height: 250, marginTop: 15}}>
                                    <div style={{
                                        width: 250,
                                        height: 250,
                                        zIndex: 1,
                                        position: "absolute"
                                    }}>
                                        <LazyImage
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                zIndex: 5
                                            }}
                                            rounded
                                            alt={"Ausgewähltes Künstler-Bild"}
                                            payload={Pair.make(picture, artist)}
                                            shouldImageUpdate={(oldPayload: Pair<File, ArtistOrGenre>, newPayload: Pair<File, ArtistOrGenre>) => {
                                                return open && (oldPayload.first !== newPayload.first || !shallowEqual(oldPayload.second, newPayload.second))
                                            }}
                                            // shouldImageUpdate={oldPayload => true}
                                            getSrc={setImgSrc => {
                                                if (picture) {
                                                    setImgSrc(URL.createObjectURL(picture));
                                                    setIsPictureNotSelected(false);
                                                } else if (editMode) {
                                                    loadSingleImage("artist", artist.id, imageResponse => {
                                                        if (imageResponse && imageResponse.file) {
                                                            setImgSrc(base64ToDataUri(imageResponse.file));
                                                            setIsPictureNotSelected(false);
                                                        } else
                                                            setIsPictureNotSelected(false);
                                                    });
                                                } else
                                                    setIsPictureNotSelected(true);
                                            }}
                                        />
                                    </div>
                                    <div style={{
                                        width: 250,
                                        height: 250,
                                        zIndex: 2,
                                        position: "absolute",
                                    }}>
                                        <SimpleReactFileUpload
                                            onFileSelected={(file: File) => {
                                                // context.currentPicture = file;
                                                // context.forceUpdate()
                                                setPicture(file);
                                            }}
                                            setDefaultVisibility={((setVisibility: (visibility: boolean) => void) => setIsPictureNotSelected = setVisibility)}
                                        />
                                    </div>
                                </div>
                            </Grid>
                            {editMode &&
                            <Grid item>
                                <Button style={margin(15, 0, 0, 15)} variant={"contained"}
                                        color={"secondary"} endIcon={<DeleteIcon/>}
                                        onClick={event => {
                                            deleteArtist(artist.id, response => {
                                                context.loadArtists(() => {
                                                    showToast("Der Nutzer wurde gelöscht", "success");
                                                    dialogBuilder.dismiss();
                                                    context.forceUpdate();
                                                })
                                            }, error => {
                                                debugger
                                                showToast("Nay " + error.message, "error");
                                            })
                                        }}>Löschen</Button>
                            </Grid>}
                        </Grid>
                    )
                })
                .addButton("Abbrechen")
                .addButton({
                    label: editMode ? "Speichern" : "Anlegen",
                    isActionButton: true,
                    color: editMode ? "primary" : "green",
                    textColor: editMode ? undefined : "white",
                    icon: editMode ? <SaveIcon/> : <AddIcon/>,
                    onClick: dialogBuilder => {
                        if (editMode) {
                            let newName = dialogBuilder.getInputText().trim()
                            if (artist.name === newName && !picture)
                                showToast("Keine Änderungen wurden vorgenommen", "info");
                            else {
                                debugger
                                updateArtist({
                                    id: artist.id,
                                    name: newName
                                }, picture ? picture : null, response => {
                                    // showToast("Jay", "success");
                                    context.loadArtists(() => {
                                        context.forceUpdate();
                                        showToast("Der Künstler wurde geändert", "success")
                                    })
                                }, error => {
                                    console.log(error);
                                    showToast(error.message, "error");
                                    debugger
                                })
                            }
                        } else {
                            let netArtist = {
                                // id: context.artists.length + 1,
                                name: dialogBuilder.getInputText().trim(),
                            };
                            createNewArtist(netArtist, picture ? picture : null, response => {
                                // showToast("Jay", "success");
                                context.loadArtists(() => {
                                    context.forceUpdate();
                                    showToast("Der Künstler wurde angelegt", "success")
                                })
                            }, error => {
                                console.log(error);
                                showToast(error.message, "error");
                                debugger
                            });
                        }

                        // context.artists.push(netArtist);
                        // context.setState({artists: netArtist});
                    }
                })
                .build()
            }
        </div>
    )

}

/**
 *
 * @param {EditArticles} context
 * @return {JSX.Element} grid, addButton, text
 */
function ActionButtons({context}: ContextType<EditArticles>) {
    let state = context.state;
    let shouldButtonBeEnabled: boolean = Boolean(state.title && typeof state.artists === "object" && typeof state.genre === "object" && state.ean.toString().length === 8 && (context.currentPicture || state.id !== -1) && !context.checkPriceError(state.price))
    const [open, setOpen] = useState(false);
    return <Grid container>
        <Grid item xs>
            {context.selectedArticle &&
            <Grid container>
                <Grid item>
                    <Button endIcon={<DeleteIcon/>}
                            onClick={event => {
                                setOpen(true);
                            }}
                            variant="contained"
                            color="secondary">
                        Löschen
                    </Button>
                    {new DialogBuilder(open, setOpen)
                        .setTitle("Artikel Löschen")
                        .setText(`Möchten Sie wirklich den Artikel '${context.selectedArticle.title}' löschen?`)
                        .addButton("Abbrechen")
                        .addButton({
                            label: "Löschen", color: "secondary", icon: <DeleteIcon/>,
                            onClick: dialogBuilder => {
                                deleteArticle(context.state.id, (response: any) => {
                                    showToast("Der Artikel wurde gelöscht", "success");
                                    context.selectedArticle = undefined;
                                    context.setState(initialState);
                                }, (response: any) => {
                                    debugger
                                    showToast("Es Ist ein Fehler aufgetreten: " + response.message, "error");
                                })
                            }
                        })
                        .build()}
                </Grid>
                <Grid item>
                    <Tooltip
                        title="Artikel Kopieren"
                        placement="top">
                        <IconButton style={{width: 36, height: 36}} onClick={event => {
                            // addToShoppingCart(this.article);
                            // this.update();
                            context.selectedArticle = undefined;
                            context.setState({
                                id: -1,
                                ean: -1,
                                articlePicture: undefined,
                            });
                        }} color={"primary"}>{<CopyIcon/>}</IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
            }
        </Grid>
        <Grid item>
            {context.selectedArticle ?
                <Button endIcon={<SaveIcon/>}
                        disabled={!shouldButtonBeEnabled || deepEqual(context.selectedArticle, context.state)}
                        onClick={event => {
                            console.log(context.state.description);
                            updateArticle(context.state, context.currentPicture, (response: any) => {
                                showToast("Der Artikel wurde aktualisiert", "success");
                            }, (response: any) => {
                                debugger
                                showToast("Es Ist ein Fehler aufgetreten: " + response.message, "error");
                            })
                        }}
                        variant="contained"
                        color="primary">
                    Speichern
                </Button>
                :
                <Button endIcon={<AddIcon/>}
                        disabled={!shouldButtonBeEnabled}
                        onClick={event => {
                            console.log(context.state.description);
                            createNewArticle(context.state, context.currentPicture, (response: any) => {
                                showToast("Der Artikel wurde Erstellt", "success");
                            }, (response: any) => {
                                debugger
                                showToast("Es Ist ein Fehler aufgetreten: " + response.message, "error");
                            })
                        }}
                        variant="contained"
                        style={{
                            color: "white",
                            backgroundColor: shouldButtonBeEnabled ? "green" : "rgba(0, 0, 0, 0.26)"
                        }}>
                    Anlegen
                </Button>
            }
        </Grid>
    </Grid>
}