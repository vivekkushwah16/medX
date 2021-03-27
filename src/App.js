import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Switch } from "react-router-dom";
import Register from "./Pages/EventRegister/Register";
import Login from "./Pages/EventLogin/Login";
import Topics from "./Pages/Topics/Topics";
import { UserContext } from './Context/Auth/UserContextProvider';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import PreEvent from './Pages/PreEvent/PreEvent';
import NotLoggedInRoutes from './Components/NotLoggedInRoutes/NotLoggedInRoutes';
import { HOME_ROUTE, LOGIN_ROUTE, REGISTER_ROUTE, RootRoute, TOPIC_ROUTE, EVENT_ROUTE } from './AppConstants/Routes';
import Home from './Pages/Home/Home';

// import css
import './assets/css/modal.css'
import VideoManager from './Managers/VideoManager';
import Event from './Pages/Event/Event';
import EventManager from './Managers/EventManager';
import SpeakerManager from './Managers/SpeakerManager';

// 
const speakerProfileLink = 'https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg'

export default function App() {
    const { initalCheck } = useContext(UserContext)
    useEffect(() => {
        // SpeakerManager.makeSpeaker("Dr. Dave Singh","",[],speakerProfileLink,{})
        // SpeakerManager.makeSpeaker("Dr. Senthil Rajappa","",[],speakerProfileLink,{})
        // SpeakerManager.makeSpeaker("Dr. Nicholas Hart","",[],speakerProfileLink,{})
        // SpeakerManager.makeSpeaker("Dr. Dave Singh","",[],speakerProfileLink,{})
        // SpeakerManager.makeSpeaker("Dr. Param Nair","",[],speakerProfileLink,{})


        // EventManager.addEventTimeLine("event-kmde59n5","Post TB Lung Disease-An Unexplored Entitty", "Up to 50% of tuberculosis (TB) survivors have some form of persistent pulmonary dysfunction despite microbiologic cure. Pulmonary dysfunction, ranges from minor abnormalities to severe breathlessness, and can increase the risk of death from respiratory cause. Furthermore, treated TB patients appear to contribute substantially to the growing burden of COPD. "
        // ,["speaker-kmfz0vco"],
        // "1618688100000",
        // "30")
        // VideoManager.getVideoWithTag(['covid']).then(data => console.log(data))
        // VideoManager.addVideo('Tuberculosis - Use of Inhaled Corticosteroids in Children', 'A potentially serious infectious bacterial disease that mainly affects the lungs.', 'https://vimeo.com/525395281/5753ae3d66',
        //     'assets/images/video-thumb.jpg', ['speaker-kmfz0vco'], ['Tuberculosis'], [{ title: 'part1', endTime: '30', startTime: '10' }])
    }, [])
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
                    <ProtectedRoute redirectTo={LOGIN_ROUTE} path={EVENT_ROUTE + '/:id'}>
                        {/* event-kmde59n5 */}
                        <Event />
                    </ProtectedRoute>
                    <ProtectedRoute redirectTo={LOGIN_ROUTE} path={TOPIC_ROUTE}>
                        <Topics />
                    </ProtectedRoute>
                    <ProtectedRoute redirectTo={LOGIN_ROUTE} path={RootRoute}>
                        <PreEvent />
                        {/* <Home /> */}
                    </ProtectedRoute>
                </Switch>
            }
        </Router>
    )
}

//include lazy loading of componenets
//make speaker context, video context