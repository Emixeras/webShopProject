import React from 'react';
import './App.css';
import { Route, Switch } from "react-router-dom";
import Home from './components/Home'
import Login from "./components/Login";
import Register from "./components/Register";
import ShoppingCart from "./components/ShoppingCart";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/login" component={Login} exact />
        <Route path="/register" component={Register} exact />
        <Route path="/shoppingcart" component={ShoppingCart} exact />
      </Switch>
    </div>

  );
}

export default App;
