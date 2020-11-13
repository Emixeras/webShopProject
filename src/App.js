import React from 'react';
import './App.css';
import { Route, Switch } from "react-router-dom";
import Home from './components/Home'
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

toast.configure();
function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/login" component={Login} exact />
        <Route path="/register" component={Register} exact />
        <Route path="/shoppingcart" component={ShoppingCart} exact />
        <Route path="/profile" component={Profile} exact />
        <Route path="/upload" component={SimpleReactFileUpload} exact />
        <Route path="/editArticles" component={EditArticles} exact />
        <Route path="/dev" component={Dev} exact />
<<<<<<< HEAD
        <Route path="/articleview" component={ArticleView} exact />
=======
        <Route path="/albums" component={AlbumOverview} exact />
>>>>>>> 952c50c02689488c9b60b2ccda100a215dc170cc
        <Route component={Home}/>
      </Switch>
    </div>

  );
}

export default App;
