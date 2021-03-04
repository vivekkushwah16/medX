import React, { Component } from 'react';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import About from "./About/About";
import Home from "./Home/Home";
import Register from "./Register/Register";
import Login from "./Login/Login";

class App extends Component {

    render() {
        return (
            <Router>
                <Switch>
                    <Route path="/about">
                        <About/>
                    </Route>
                    <Route path="/register">
                        <Register/>
                    </Route>
                    <Route path="/login">
                        <Login/>
                    </Route>
                    <Route path="/">
                        <Home/>
                    </Route>
                </Switch>
            </Router>
        );
    }

}

export default App
