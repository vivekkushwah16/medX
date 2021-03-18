import React, { Component } from 'react';
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
import VideoManager from './Managers/VideoManager';

class App extends Component {

    componentDidMount() {
        this.getData()
        // VideoManager.addVideo('Inhaled Corticosteroids ', "Use of Inhaled Corticosteroids in Children", "https://vimeo.com/525395281/5753ae3d66", 'assets/images/video-thumb.jpg', [], ['covid', 'ciplaMed'], [{ time: 20, endTime: 10, title: 'MainIntro' }])
    }

    getData = async () => {
        const ref = await VideoManager.getVideoWithTag(['covid'])
        console.log(ref)
    }

    render() {
        const { initalCheck } = this.context;
        return (
            <>
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
            </>
        );
    }
}
App.contextType = UserContext;
export default App

//include lazy loading of componenets
//make speaker context, video context