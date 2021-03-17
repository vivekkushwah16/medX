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
import NotLoggedInRoutes from './Component/NotLoggedInRoutes/NotLoggedInRoutes';

class App extends Component {
    render() {
        const { initalCheck } = this.context;
        return (
            <>
                <Router>
                    {
                        initalCheck &&
                        <Switch>
                            <NotLoggedInRoutes redirectTo="/home" path="/register">
                                <Register />
                            </NotLoggedInRoutes>
                            <NotLoggedInRoutes redirectTo="/home" path="/login">
                                <Login />
                            </NotLoggedInRoutes>
                            <ProtectedRoute redirectTo="/login" path="/home">
                                <PreEvent />
                            </ProtectedRoute>
                            <ProtectedRoute redirectTo="/login" path="/topics">
                                <About />
                            </ProtectedRoute>
                            <ProtectedRoute redirectTo="/login" path="/about">
                                <Topics />
                            </ProtectedRoute>
                            <ProtectedRoute redirectTo="/login" path="/">
                                <PreEvent />
                            </ProtectedRoute>
                        </Switch>
                    }
                    {/* {
                        !initalCheck &&
                        <Login />
                    } */}
                </Router>
            </>
        );
    }
}
App.contextType = UserContext;
export default App
