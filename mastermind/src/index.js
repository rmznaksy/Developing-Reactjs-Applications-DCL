import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.css';
import {Route, BrowserRouter as Router} from "react-router-dom"
import reportWebVitals from './reportWebVitals';
import PlayerLoses from "./component/player-loses";
import PlayerWins from "./component/player-wins";

let routing = <Router>
    <Route path="/" exact component={App}></Route>
    <Route path="/wins" component={PlayerWins}></Route>
    <Route path="/loses" component={PlayerLoses}></Route>
</Router>;
ReactDOM.render(
    <React.StrictMode>
        {routing}
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
