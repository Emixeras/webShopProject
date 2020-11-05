import * as React from "react";
import {
    Grid,
    Paper,
    Button,
    Card,
    TextField,
    InputAdornment,
    OutlinedInput, FormControl
} from "@material-ui/core";
import MenuDrawer from "./MenuDrawer";
import {addDrawerCallback, isDrawerVisible, removeDrawerCallback} from "../services/StorageUtil";
import {padding, showToast} from "../services/Utilities";
import SimpleReactFileUpload from "./SimpleReactFileUpload";
import {Combobox} from 'react-widgets'
import 'react-widgets/dist/css/react-widgets.css';

interface IProps {
}

interface IState {
    title: string
    description?: string
    ean: number;
    price: string;
    artists?: ArtistOrGenre;
    genre?: ArtistOrGenre;
}

interface Article {
    id: number;
    title: string;
    description: string;
    ean: number;
    price: string;
    artists: ArtistOrGenre;
    genre: ArtistOrGenre;
}

interface ArtistOrGenre {
    id: number;
    name: string;
}

export default class EditArticles extends React.Component<IProps, IState> {

    drawerState: boolean = isDrawerVisible();
    articles: Array<Article> = [];
    artists: Array<ArtistOrGenre> = [];
    genres: Array<ArtistOrGenre> = [];

    drawerCallback = (state: boolean) => {
        this.drawerState = state;
        this.forceUpdate()
    };

    constructor(props: IProps, context: any) {
        super(props, context);
        this.state = {
            title: "",
            price: "",
            ean: 0,
            description: "",
            artists: undefined,
            genre: undefined
        };
        addDrawerCallback(this.drawerCallback);
        this.loadArticles()
    }

    loadArticles() {
        fetch(new Request("http://localhost:8080/article", {method: 'GET'}))
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error('Fehler bei der Anfrage: ' + response.status + " " + response.statusText);
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
                showToast("Beim laden der Artikel ist ein Fehler aufgetreten", "error")
            })

    }

    render() {
        const priceError = this.state.price.length > 0 && !/^(\d+([.,]\d{1,2})?)$/.test(this.state.price);
        return (
            <div>
                <MenuDrawer/>
                <div style={{
                    marginTop: 8,
                    marginInlineStart: (this.drawerState ? 240 : 0),
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <Grid container
                          style={{width: '85%', maxWidth: "800px"}}
                          spacing={3}>
                        <Grid item xs={12}>
                            <Combobox busy={this.articles.length === 0}
                                      suggest
                                      textField={(dataItem: Article | string) => typeof dataItem === 'string' ? dataItem :
                                          'i: ' + dataItem.id +
                                          '; t: ' + dataItem.title +
                                          '; a: ' + dataItem.artists.name +
                                          '; g: ' + dataItem.genre.name +
                                          '; p: ' + dataItem.price +
                                          '; e: ' + dataItem.ean
                                      }
                                      itemComponent={({item}) => {
                                          return (
                                              <span style={{
                                                  minWidth: 740,
                                                  alignSelf: "self-start"/*, backgroundColor:"red"*/
                                              }}>
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
                                            </span>
                                          );
                                      }}
                                      filter={(dataItem: Article, searchItem: string): boolean => {
                                          searchItem = searchItem.toLowerCase();

                                          let subArray = searchItem.split("&");
                                          let length = subArray.length;
                                          let found = 0;
                                          for (let sub of subArray) {
                                              sub = sub.trim();
                                              let type: boolean | string = sub.length > 1 && sub.charAt(1) === ":";
                                              if (type) {
                                                  type = sub.substr(0, 2);
                                                  sub = sub.substr(2);
                                              }

                                              if (sub.length === 0 && length > 1) {
                                                  if (++found >= length)
                                                      return true;
                                                  continue
                                              }

                                              if ((!type || type.startsWith("i")) && dataItem.id.toString().toLowerCase().includes(sub)) {
                                                  if (++found >= length) {
                                                      debugger
                                                      return true;
                                                  }
                                              }
                                              if ((!type || type.startsWith("t")) && dataItem.title.toLowerCase().includes(sub)) {
                                                  if (++found >= length) {
                                                      debugger
                                                      return true;
                                                  }
                                              }
                                              if ((!type || type.startsWith("a")) && dataItem.artists.name.toLowerCase().includes(sub)) {
                                                  // debugger
                                                  if (++found >= length) {
                                                      return true;
                                                  }
                                              }
                                              if ((!type || type.startsWith("g")) && dataItem.genre.name.toLowerCase().includes(sub)) {
                                                  if (++found >= length)
                                                      return true;
                                              }
                                              if ((!type || type.startsWith("d")) && dataItem.description && dataItem.description.toLowerCase().includes(sub)) {
                                                  if (++found >= length)
                                                      return true;
                                              }
                                              if ((!type || type.startsWith("e")) && dataItem.ean.toString().includes(sub)) {
                                                  if (++found >= length)
                                                      return true;
                                              }
                                          }
                                          return false;
                                      }}
                                      onSelect={(article: Article) => {
                                          this.setState({
                                              title: article.title,
                                              price: article.price,
                                              artists: article.artists,
                                              genre: article.genre,
                                              ean: article.ean,
                                              description: article.description
                                          })
                                      }}
                                      data={this.articles}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Card style={padding(18)}>
                                <Grid container spacing={2}>
                                    <Grid item sm={9} xs={12}>
                                        <TextField fullWidth
                                                   value={this.state.title}
                                                   label={"Album Titel"}
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
                                        <Combobox busy={this.articles.length === 0}
                                                  name={"Künstler"}
                                                  textField={"name"}
                                                  filter={"contains"}
                                                  value={this.state.artists}
                                                  data={this.artists}
                                        />
                                    </Grid>
                                    <Grid item sm={6} xs={12}>
                                        <Combobox busy={this.articles.length === 0}
                                                  textField={"name"}
                                                  filter={"contains"}
                                                  value={this.state.genre}
                                                  data={this.genres}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField fullWidth
                                                   multiline
                                                   style={{height: "100%"}}
                                                   value={this.state.description ? this.state.description : ""}
                                                   label={"Beschreibung"}
                                                   variant={"outlined"}/>
                                    </Grid>
                                    <Grid item sm={8} xs={12}>
                                        <SimpleReactFileUpload/>
                                    </Grid>
                                    <Grid item>
                                        <TextField fullWidth
                                                   value={this.state.ean === 0 ? "" : this.state.ean}
                                                   label={"EAN"}
                                                   variant={"outlined"}/>
                                    </Grid>
                                </Grid>
                            </Card>
                        </Grid>
                    </Grid>
                </div>
            </div>
        )
    }

    componentWillUnmount() {
        removeDrawerCallback(this.drawerCallback)
    }
}