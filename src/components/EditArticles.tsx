import * as React from "react";
import {
    Box,
    Grid,
    Button,
    Card,
    TextField,
    InputAdornment,
    IconButton, Typography,
} from "@material-ui/core";
import MenuDrawer from "./MenuDrawer";
import {padding, showToast} from "../Utilities/Utilities";
import SimpleReactFileUpload from "./SimpleReactFileUpload";
import {Combobox, DropdownList} from 'react-widgets'
import 'react-widgets/dist/css/react-widgets.css';
import AddIcon from '@material-ui/icons/Add';
import {DialogBuilder} from "../Utilities/DialogBuilder";
import {
    base64ToDataUri,
    ContextType, filterArticle,
    LazyImage,
    Pair, RestrictedPage,
    Triple
} from "../Utilities/TsUtilities";
import {Save} from "@material-ui/icons";
import {updateArticle} from "../services/ItemApiUtil";
import context from "react-bootstrap/CardContext";
import {makeStyles} from "@material-ui/core/styles";
import zIndex from "@material-ui/core/styles/zIndex";
import {createNewArtist} from "../services/ArtistApiUtil";
import {useState} from "react";

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

export default class EditArticles extends React.Component<IProps, IState> {
    currentPicture: File | undefined = undefined;
    setFileUploaDefaultdVisibility: (visibility: boolean) => void = visibility => {
    };
    IMAGE_RESOLUTION: string = "IMAGE_RESOLUTION";
    articles: Array<Article> = [];
    artists: Array<ArtistOrGenre> = [];
    genres: Array<ArtistOrGenre> = [];

    constructor(props: IProps, context: any) {
        super(props, context);
        this.state = {
            id: -1,
            title: "",
            price: "",
            ean: -1,
            description: "",
            artists: undefined,
            genre: undefined
        };

        if (this.props.location.state) {
            const {article} = this.props.location.state;
            this.state = article;
        }
        this.loadArticles()
    }

    loadArticles() {
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
                this.forceUpdate()

                var flags = [], l = response.length, i;
                for (i = 0; i < l; i++) {
                    if (flags[response[i].artists.id]) continue;
                    flags[response[i].artists.id] = true;
                    this.artists.push(response[i].artists);
                }
                let nameComparetor = (a: ArtistOrGenre, b: ArtistOrGenre) => {
                    var nameA = a.name.toUpperCase();
                    var nameB = b.name.toUpperCase();
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }
                    return 0;
                };
                this.artists.sort(nameComparetor)

                var flags = [], l = response.length, i;
                for (i = 0; i < l; i++) {
                    if (flags[response[i].genre.id]) continue;
                    flags[response[i].genre.id] = true;
                    this.genres.push(response[i].genre);
                }
                this.genres.sort(nameComparetor)


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
                                <Combobox busy={this.articles.length === 0}
                                          suggest
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
                                                              <td title={"Künstler"} style={{
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
                                                  )
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
                                          data={this.articles}
                                          defaultValue={this.state.id !== -1 ? this.state : undefined}
                                />
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
                                                              onChange={value => this.setState({artists: value})}
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
                                                                this.setFileUploaDefaultdVisibility(false);
                                                            } else if (this.state.id !== -1) {
                                                                this.loadSingleImage(this.state.id, imageResponse => {
                                                                    if (imageResponse) {
                                                                        setImgSrc(base64ToDataUri(imageResponse.file));
                                                                        this.setFileUploaDefaultdVisibility(false);
                                                                    } else
                                                                        this.setFileUploaDefaultdVisibility(true);
                                                                });
                                                            } else
                                                                this.setFileUploaDefaultdVisibility(true);

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
                                                        setDefaultVisibility={((setVisibility: (visibility: boolean) => void) => this.setFileUploaDefaultdVisibility = setVisibility)}
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

    loadSingleImage(id: number, onFinish: (imageResponse?: ImageResponseType) => void) {
        fetch(new Request(`http://localhost:8080/article/range;start=${id};end=${id};quality=${300}`, {method: 'GET'}))
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error(`Fehler bei der Anfrage: ${response.status} ${response.statusText}`);
                }
            })
            .then((response: ImageResponseType[]) => onFinish(response[0]))
            .catch(reason => {
                showToast(reason.message, "error")
            })
    }
}

let setIsPictureNotSelected: (visibility: boolean) => void = visibility => {};
function DialogComponent(arg: any) {
    const that: EditArticles = arg.context;
    const [open, setOpen] = React.useState(false);
    // const [picture, setPicture] = useState<File>();


    // debugger

    return (
        <div>
            <IconButton style={{maxHeight: 30, maxWidth: 30}}
                        onClick={event => {
                            return setOpen(true);
                        }}
                        onMouseDown={(event) => {
                            event.preventDefault();
                        }}>
                {<AddIcon/>}
            </IconButton>

            {new DialogBuilder(open, dialogBuilder => setOpen(false))
                .setTitle("Künstler Anlegen")
                .setText("Bitte den Namen des neuen Künstlers eingeben und auf 'Anlegen' klicken.")
                .setInput({
                    label: "Künstler Name",
                    inputValidator: text => {
                        let newInput = text;
                        let result = "";
                        for (let artist of that.artists) {
                            if (artist.name.toLowerCase() === newInput.toLowerCase().trim()) {
                                result = "Der Künstler existiert bereits";
                                break
                            }
                        }
                        return Pair.make(result, !text.trim() || !!result);
                    }

                })
                .setContent(dialogBuilder => {
                    return (
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
                                    alt={"test"}
                                    payload={that.currentPicture}
                                    shouldImageUpdate={(oldPayload: File, newPayload: File) => {
                                        return oldPayload !== newPayload
                                    }}
                                    // shouldImageUpdate={oldPayload => true}
                                    getSrc={setImgSrc => {
                                        if (that.currentPicture) {
                                            setImgSrc(URL.createObjectURL(that.currentPicture));
                                            setIsPictureNotSelected(false);
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
                                        // debugger
                                        that.currentPicture = file;
                                        that.forceUpdate()
                                        // setPicture(file);
                                    }}
                                    setDefaultVisibility={((setVisibility: (visibility: boolean) => void) => setIsPictureNotSelected = setVisibility)}
                                />
                            </div>
                        </div>
                    )
                })
                .addButton("Abbrechen")
                .addButton({
                    label: "Anlegen",
                    isActionButton: true,
                    onClick: dialogBuilder => {
                        debugger
                        let netArtist = {
                            // id: that.artists.length + 1,
                            name: dialogBuilder.getInputText().trim(),
                        };
                        if (!that.currentPicture)
                            return;
                        createNewArtist(netArtist, null/*that.currentPicture*/, response => {
                            console.log(response);
                            showToast("Jay", "success");
                            debugger
                        }, error => {
                            console.log(error);
                            showToast("Nay", "error");
                            debugger
                        });

                        // that.artists.push(netArtist);
                        // that.setState({artists: netArtist});
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