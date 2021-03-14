import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import About from "./Component/About/About";
import Home from "./Component/Home/Home";
import Register from "./Component/Event/Register/Register";
import Login from "./Component/Event/Login/Login";
import Topics from "./Component/Topics/Topics";
import { UserContext } from './Context/Auth/UserContextProvider';
import ProtectedRoute from './Component/ProtectedRoute/ProtectedRoute';
import PreEvent from './Component/Event/PreEvent/PreEvent';
import EventManager from './Managers/EventManager/EventManager';

class App extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route path="/register">
                        <Register />
                    </Route>
                    <Route path="/login">
                        <Login />
                    </Route>
                    {/* <ProtectedRoute redirectTo="/login" path="/home">
                        <About />
                    </ProtectedRoute> */}
                    <Route path="/home">
                        <PreEvent />
                    </Route>
                    <ProtectedRoute redirectTo="/login" path="/topics">
                        <About />
                    </ProtectedRoute>
                    <ProtectedRoute redirectTo="/login" path="/about">
                        <Topics />
                    </ProtectedRoute>
                    <ProtectedRoute redirectTo="/login" path="/">
                        <Home />
                    </ProtectedRoute>
                </Switch>
            </Router>
        );
    }
}
export default App
