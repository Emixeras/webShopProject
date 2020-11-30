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
import Order from "./components/Order";
import PaymentMethod from "./components/PaymentMethod";
import OrderSummary from "./components/OrderSummary";
import OrderComplete from "./components/OrderComplete";
import OrderDetails from "./components/OrderDetails";

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
        <Route path="/ordersummary" component={OrderSummary} exact />
        <Route path="/artists" component={ArtistOverview} exact />
        <Route path="/placeorder" component={Order} exact />
        <Route path="/payment" component={PaymentMethod} exact />
        <Route path="/ordercomplete" component={OrderComplete} exact />
        <Route path="/orderdetails" component={OrderDetails} exact />
        <Route component={AlbumOverview}/>
      </Switch>
    </div>

  );
}

export default App;
