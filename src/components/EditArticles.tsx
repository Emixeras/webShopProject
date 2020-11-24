import * as React from "react";
import {useState} from "react";
import {
    Button,
    Card,
    Grid,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
} from "@material-ui/core";
import MenuDrawer from "./MenuDrawer";
import {margin, padding, shallowEqual, showToast} from "../Utilities/Utilities";
import SimpleReactFileUpload from "./SimpleReactFileUpload";
import {Combobox} from 'react-widgets'
import 'react-widgets/dist/css/react-widgets.css';
import EditIcon from '@material-ui/icons/Edit';
import ClearIcon from '@material-ui/icons/Clear';
import DeleteIcon from '@material-ui/icons/Delete';
import {DialogBuilder} from "../Utilities/DialogBuilder";
import {
    base64ToDataUri,
    ContextType,
    filterArticle,
    LazyImage,
    loadSingleImage,
    artistOrGenre_comparator,
    Pair,
    RestrictedPage,
    RETURN_MODE
} from "../Utilities/TsUtilities";
import {Save} from "@material-ui/icons";
import {updateArticle} from "../services/ItemApiUtil";
import {createNewArtist, deleteArtist, updateArtist} from "../services/ArtistApiUtil";

interface IProps {
    // @ts-ignore
    location: history.Location;
}

interface ImageResponseType {
    article: Article;
    file: string;
}

interface IState {
    id: number;
    title: string
    description?: string
    ean: number;
    price: string;
    artists?: ArtistOrGenre;
    genre?: ArtistOrGenre;
}

export interface Article {
    id: number;
    title: string;
    description: string;
    ean: number;
    price: string;
    artists: ArtistOrGenre;
    genre: ArtistOrGenre;
    picture?: { id: number, data: string };
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
    genre: undefined
};

export default class EditArticles extends React.Component<IProps, IState> {
    currentPicture: File | undefined = undefined;
    setFileUploadDefaultVisibility: (visibility: boolean) => void = visibility => {
    };
    IMAGE_RESOLUTION: string = "IMAGE_RESOLUTION";
    articles: Array<Article> = [];
    artists: Array<ArtistOrGenre> = [];
    genres: Array<ArtistOrGenre> = [];
    selectArticle_input: string = "";

    constructor(props: IProps, context: any) {
        super(props, context);
        this.state = initialState;

        if (this.props.location.state)
            this.state = this.props.location.state.article;
        this.loadData();
        window.scrollTo(0, 0);
    }

    loadData() {
        let pendingRequests = 3;
        fetch(new Request("http://localhost:8080/article", {method: 'GET'}))
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

        fetch(new Request("http://localhost:8080/genre", {method: 'GET'}))
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
        fetch(new Request("http://localhost:8080/artist", {method: 'GET'}))
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

    checkPrice = (price: string) => price.length > 0 && !/^(\d+([.,]\d{1,2})?)$/.test(price);

    render() {
        const priceError: boolean = this.checkPrice(this.state.price);
        const eanError: boolean = !/^(-1|\d{8}|\d{13})$/.test(this.state.ean + "");

        return (
            <RestrictedPage>
                <MenuDrawer>
                    <div style={{
                        marginTop: 5,
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <Grid container
                              style={{width: '85%', maxWidth: "800px"}}
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
                                                      this.setState({
                                                          id: article.id,
                                                          title: article.title,
                                                          price: article.price,
                                                          artists: article.artists,
                                                          genre: article.genre,
                                                          ean: article.ean,
                                                          description: article.description
                                                      })
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
                                        <Grid item md={9} sm={12}>
                                            <TextField fullWidth
                                                       value={this.state.title}
                                                       label={"Album Titel"}
                                                       onChange={event => this.setState({title: event.target.value})}
                                                       variant={"outlined"}/>
                                        </Grid>
                                        <Grid item md={3} sm={12}>
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
                                        <Grid item md={6} sm={12}>
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
                                        <Grid item md={6} sm={12}>
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
                                        <Grid item md={8} sm={12}>
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
                                        <Grid item md={4} sm={12}>
                                            <TextField fullWidth
                                                       value={this.state.ean === -1 ? "" : this.state.ean}
                                                       onChange={event => {
                                                           let newValue = event.target.value;
                                                           if (/\d*/.test(newValue))
                                                               this.setState({ean: newValue ? +newValue : -1});
                                                       }}
                                                       error={eanError}
                                                       helperText={eanError ? "Keine valide EAN" : ""}
                                                       label={"EAN"}
                                                       variant={"outlined"}/>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Grid container justify="flex-end">
                                                <Grid item>
                                                    <ActionButtons context={this}/>
                                                </Grid>
                                            </Grid>
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

    // loadSingleImage(id: number, onFinish: (imageResponse?: ImageResponseType) => void) {
    //     fetch(new Request(`http://localhost:8080/article/range;start=${id};end=${id};quality=${300}`, {method: 'GET'}))
    //         .then(response => {
    //             if (response.status === 200) {
    //                 return response.json();
    //             } else {
    //                 throw new Error(`Fehler bei der Anfrage: ${response.status} ${response.statusText}`);
    //             }
    //         })
    //         .then((response: ImageResponseType[]) => onFinish(response[0]))
    //         .catch(reason => {
    //             showToast(reason.message, "error")
    //         })
    // }
}

let setIsPictureNotSelected: (visibility: boolean) => void = visibility => {
};

function DialogComponent(arg: any) {
    const context: EditArticles = arg.context;
    const artist: ArtistOrGenre | undefined = context.state.artists;
    const [open, setOpen] = React.useState(false);
    const [picture, setPicture] = useState<File>();

    return (
        <div>
            <IconButton style={{maxHeight: 30, maxWidth: 30}}
                        onClick={event => {
                            return setOpen(true);
                        }}
                        onMouseDown={(event) => {
                            event.preventDefault();
                        }}>
                {<EditIcon/>}
            </IconButton>

            {new DialogBuilder(open, dialogBuilder => {
                setPicture(undefined)
                setOpen(false);
            })
                .setTitle("Künstler " + (artist ? `Bearbeiten (${artist.name})` : "Anlegen"))
                .setText(!artist ? "Bitte den Namen des neuen Künstlers eingeben und auf 'Anlegen' klicken." :
                    "Die Daten des Künstlers bearbeiten und dann auf 'Speichern' klicken")
                .setInput({
                    label: "Künstler Name",
                    initialValue: artist ? artist.name : undefined,
                    inputValidator: text => {
                        let newInput = text.toLowerCase().trim();
                        if (artist && artist.name.toLowerCase() === newInput)
                            return Pair.make("" , false);
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
                                            shouldImageUpdate={(oldPayload: Pair<File,ArtistOrGenre>, newPayload: Pair<File,ArtistOrGenre>) => {
                                                return open && (oldPayload.first !== newPayload.first ||  !shallowEqual(oldPayload.second, newPayload.second))
                                            }}
                                            // shouldImageUpdate={oldPayload => true}
                                            getSrc={setImgSrc => {
                                                if (picture) {
                                                    setImgSrc(URL.createObjectURL(picture));
                                                    setIsPictureNotSelected(false);
                                                } else if (artist) {
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
                            {artist &&
                            <Grid item>
                                <Button style={margin(15,0,0,15)} variant={"contained"} color={"secondary"} endIcon={<DeleteIcon/>} onClick={event => {
                                    deleteArtist(artist.id, response => {
                                        context.loadArtists(() => {
                                            showToast("Der Nutzer wurde gelöscht", "success");
                                            dialogBuilder.dismiss();
                                            context.forceUpdate();
                                        })
                                    }, error => {
                                        showToast("Nay " + error.message, "error");
                                    })
                                }}>Löschen</Button>
                            </Grid>}
                        </Grid>
                    )
                })
                .addButton("Abbrechen")
                .addButton({
                    label: artist ? "Speichern" : "Anlegen",
                    isActionButton: true,
                    onClick: dialogBuilder => {
                        if (!artist) {
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
                        } else {
                            let newName = dialogBuilder.getInputText().trim()
                            if (artist.name === newName && !picture)
                                showToast("Keine Änderungen wurden vorgenommen", "info");
                            else {
                                debugger
                                updateArtist({id: artist.id, name: newName}, picture ? picture : null, response => {
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

function ActionButtons(props: ContextType<EditArticles>) {
    let that: EditArticles = props.context;
    return (
        <Button endIcon={<Save/>}
                onClick={event => {
                    console.log(that.state.description);
                    updateArticle(that.state, that.currentPicture, (response: any) => {
                        showToast("Artikel wurde aktualisiert", "success");
                    }, (response: any) => {
                        debugger
                    })
                }}
                variant="contained"
                color="primary">
            Speichern
        </Button>
    )
}