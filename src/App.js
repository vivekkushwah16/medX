import React, { useContext } from 'react';
import { BrowserRouter as Router, Switch } from "react-router-dom";
import About from "./Pages/About/About";
import Register from "./Pages/EventRegister/Register";
import Login from "./Pages/EventLogin/Login";
import Topics from "./Pages/Topics/Topics";
import { UserContext } from './Context/Auth/UserContextProvider';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import PreEvent from './Pages/PreEvent/PreEvent';
import NotLoggedInRoutes from './Components/NotLoggedInRoutes/NotLoggedInRoutes';
import { HOME_ROUTE, LOGIN_ROUTE, REGISTER_ROUTE, RootRoute, TOPIC_ROUTE, EVENT_ROUTE } from './AppConstants/Routes';
import Home from './Pages/Home/Home';


export default function App() {
    const { initalCheck } = useContext(UserContext)
    return (
        <Router>
            {
                initalCheck &&
                <Switch>
                    <NotLoggedInRoutes redirectTo={HOME_ROUTE} path={REGISTER_ROUTE}>
                        <Register />
                    </NotLoggedInRoutes>
                    <NotLoggedInRoutes redirectTo={HOME_ROUTE} path={LOGIN_ROUTE}>
                        <Login />
                    </NotLoggedInRoutes>
                    <ProtectedRoute redirectTo={LOGIN_ROUTE} path={HOME_ROUTE}>
                        <PreEvent />
                    </ProtectedRoute>
                    <ProtectedRoute redirectTo={LOGIN_ROUTE} path={EVENT_ROUTE}>
                        <About />
                    </ProtectedRoute>
                    <ProtectedRoute redirectTo={LOGIN_ROUTE} path={TOPIC_ROUTE}>
                        <Topics />
                    </ProtectedRoute>
                    <ProtectedRoute redirectTo={LOGIN_ROUTE} path={RootRoute}>
                        <Home />
                    </ProtectedRoute>
                </Switch>
            }
        </Router>
    )
}

//include lazy loading of componenets
//make speaker context, video context