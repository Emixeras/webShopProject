import React from 'react';
import './App.css';
import { Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import ShoppingCart from "./components/ShoppingCart";
import Profile from "./components/Profile";
import Dev from "./components/Dev";
import ArticleView from "./components/ArticleView";
import SimpleReactFileUpload from "./components/SimpleReactFileUpload";
import {toast} from 'react-toastify'
import AlbumOverview from "./components/AlbumOverview";
import EditArticles from "./components/EditArticles";
import GenreOverview from "./components/GenreOverview";
import ArtistOverview from "./components/ArtistOverview";

toast.configure();
function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/" component={AlbumOverview} exact />
        <Route path="/login" component={Login} exact />
        <Route path="/register" component={Register} exact />
        <Route path="/shoppingCart" component={ShoppingCart} exact />
        <Route path="/profile" component={Profile} exact />
        <Route path="/upload" component={SimpleReactFileUpload} exact />
        <Route path="/editArticles" component={EditArticles} exact />
        <Route path="/dev" component={Dev} exact />
        <Route path="/articleView" component={ArticleView} exact />
        <Route path="/albums" component={AlbumOverview} exact />
        <Route path="/genres" component={GenreOverview} exact />
        <Route path="/artists" component={ArtistOverview} exact />
        <Route component={AlbumOverview}/>
      </Switch>
    </div>

  );
}

export default App;
