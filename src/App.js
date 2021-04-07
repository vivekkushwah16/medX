import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { UserContext } from './Context/Auth/UserContextProvider';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import NotLoggedInRoutes from './Components/NotLoggedInRoutes/NotLoggedInRoutes';
import { HOME_ROUTE, LOGIN_ROUTE, REGISTER_ROUTE, RootRoute, EVENT_ROUTE } from './AppConstants/Routes';

// import css
import Home from './Pages/Home/Home';

import './assets/css/modal.css'

import loadable from '@loadable/component';
import LoadableFallback from './Components/LoadableFallback/LoadableFallback';
const RegisterLazy = loadable(() => import(/* webpackChunkName: "Register" */ "./Pages/EventRegister/Register"), { fallback: <LoadableFallback /> })
const LoginLazy = loadable(() => import(/* webpackChunkName: "Login" */ "./Pages/EventLogin/Login"), { fallback: <LoadableFallback /> })
const PreEventLazy = loadable(() => import(/* webpackChunkName: "PreEventLazy" */ './Pages/PreEvent/PreEvent'), { fallback: <LoadableFallback /> })
const MediaModalLazy = loadable(() => import(/* webpackChunkName: "MediaModal" */ './Containers/MediaModal/MediaModal'), { fallback: <LoadableFallback /> })
const EventLazy = loadable(() => import(/* webpackChunkName: "EventLazy" */ './Pages/Event/Event'), { fallback: <LoadableFallback /> })


// import VideoManager from './Managers/VideoManager';
// import EventManager from './Managers/EventManager';
// import EventManager from './Managers/EventManager';
// import Trending from './Components/Event/Trending/Trending';
// import { TRENDING_ITEM_TYPE } from './AppConstants/TrendingItemTypes';
// import { LOREM_TEXT } from './AppConstants/Lorem';
// import { PollManager } from './Managers/PollManager';
// import axios from 'axios';
// import { CONFIRMATIONENDPOINT } from './AppConstants/APIEndpoints';
// import SpeakerManager from './Managers/SpeakerManager';
// import SpeakerManager from './Managers/SpeakerManager';


const speakerProfileLink = 'https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg';

const preload = component => {
    component.preload && component.preload()
}

export default function App() {
    const { initalCheck, user } = useContext(UserContext)
    useEffect(() => {
        console.log("App Started - DJ")
        if (user) {
            preload(PreEventLazy)
        } else {
            preload(RegisterLazy)
            preload(LoginLazy)
        }
    }, [initalCheck, user])

    useEffect(() => {
        // SpeakerManager.makeSpeaker("Dr. Dave Singh","",[],speakerProfileLink,{})
        // SpeakerManager.makeSpeaker("Dr. Senthil Rajappa","",[],speakerProfileLink,{})
        // SpeakerManager.makeSpeaker("Dr. Nicholas Hart","",[],speakerProfileLink,{})
        // SpeakerManager.makeSpeaker("Dr. Dave Singh","",[],speakerProfileLink,{})
        // SpeakerManager.makeSpeaker("Dr. Param Nair","",[],speakerProfileLink,{})

        // SpeakerManager.makeSpeaker("Dr. Chris Ryerson","",["MD, FRCPC"],speakerProfileLink,{})
        // SpeakerManager.makeSpeaker("Dr. Brain Allwood","",["PhD, FCP"],speakerProfileLink,{})
        // SpeakerManager.makeSpeaker("Dr. Sally Singh","",["PhD, FCSP"],speakerProfileLink,{})
        // SpeakerManager.makeSpeaker("Dr. Gary Lee","",[""],speakerProfileLink,{})
        // SpeakerManager.makeSpeaker("Dr. Matteo Bassetti","",[""],speakerProfileLink,{})
        // SpeakerManager.makeSpeaker("Dr. Kumar Prabhash","",[""],speakerProfileLink,{})



        // EventManager.addEventTimeLine("event-kmde59n5",
        // "HP-Securing a Diagnosis", 
        // "Until now, there has been little consensus in terms of disease definition, diagnostic criteria and diagnostic approach for Hypersensitivity Pneumonitis (HP). More than 30 years after the last guidance, the American Thoracic Society has developed new guidelines that addresses challenges in diagnosing HP. In this talk the diagnostic approach suggested will be critically analysed. "
        // ,["speaker-kmfz0vco"],
        // "1618666200000",
        // "35")

        // EventManager.addEventTimeLine("event-kmde59n5",
        // "Post TB Lung Disease-An Unexplored Entitty", 
        // "Up to 50% of tuberculosis (TB) survivors have some form of persistent pulmonary dysfunction despite microbiologic cure. Pulmonary dysfunction, ranges from minor abnormalities to severe breathlessness, and can increase the risk of death from respiratory cause. Furthermore, treated TB patients appear to contribute substantially to the growing burden of COPD. "
        // ,["speaker-kmfz0vco"],
        // "1618668300000",
        // "30")

        // EventManager.addEventTimeLine("event-kmde59n5",
        // "The Virtual Pulmonary Rehabilitation Laboratory//Home Based Pulmonary Rehab", 
        // "Pulmonary rehabilitation (PR) is a proven comprehensive and multidisciplinary therapeutic strategy to improve healthcare related quality of life (HRQOL) and health care utilization in patients with COPD; however, there are multiple barriers to PR including insufficient capacity, lack of access, patient inconvenience and cost. Therefore, creative solutions to increase the availability and access of PR are necessary. This talk explores the various ways of conducting a successful and impactful virtual home based  PR.",
        // ["speaker-kmfz0vco"],
        // "1618670100000",
        // "35")

        // EventManager.addEventTimeLine("event-kmde59n5",
        // "The Rise and Fall of Medical Thoracoscopy", 
        // "",
        // ["speaker-kmfz0vco"],
        // "1618672200000",
        // "30")

        // EventManager.addEventTimeLine("event-kmde59n5",
        // "Colistin Sparing Therapies", 
        // "Antimicrobial resistance is on the rise across the globe. Increasing incidence of infections due to carbapenem resistant organisms is becoming difficult to treat, due to the limited availability of therapeutic agents. This talk will focus on important advancements with the handful of recently launched new antibiotics targeting some of the current most problematic Gram-negative pathogens. ",
        // ["speaker-kmfz0vco"],
        // "1618674000000",
        // "30")

        // EventManager.addTrendingItem("event-kmde59n5", TRENDING_ITEM_TYPE.VIDEO, "Presentation for Session 2", LOREM_TEXT, "https://vimeo.com/290674467","assets/images/video-thumb.jpg")

        // VideoManager.getVideoWithTag(['covid']).then(data => console.log(data))
        // VideoManager.addVideo('Tuberculosis - Use of Inhaled Corticosteroids in Children', 'A potentially serious infectious bacterial disease that mainly affects the lungs.', 'https://vimeo.com/525395281/5753ae3d66',
        //     'assets/images/video-thumb.jpg', ['speaker-kmfz0vco'], ['Tuberculosis'], [{ title: 'part1', endTime: '30', startTime: '10' }])

        // EventManager.addPartnerWithUs("event-kmde59n5","Clinical Trial Participation 1",LOREM_TEXT,"Clinical Trial Participation sub1", LOREM_TEXT, "/assets/images/doctors.jpg")
        // EventManager.addPartnerWithUs("event-kmde59n5","Clinical Trial Participation 2",LOREM_TEXT,"Clinical Trial Participation sub2", LOREM_TEXT, "/assets/images/doctors.jpg")
        // EventManager.addPartnerWithUs("event-kmde59n5","Clinical Trial Participation 3",LOREM_TEXT,"Clinical Trial Participation sub3", LOREM_TEXT, "/assets/images/doctors.jpg")
        // EventManager.addPartnerWithUs("event-kmde59n5","Clinical Trial Participation 4",LOREM_TEXT,"Clinical Trial Participation sub4", LOREM_TEXT, "/assets/images/doctors.jpg")

        // PollManager.addPollQuestion("event-kmde59n5",1,"HOW TO DESIGN A VIRTUAL EVENT?", ["By Understanding User", "By Thinking out of box","By doing nothing","By consulting DJ Virtual Event"])
        // PollManager.addPollQuestion("event-kmde59n5",2,"HOW TO RE-DESIGN A VIRTUAL EVENT?", ["By Understanding User Again", "By Thinking inside the box","By doing nothing again","By consulting DJ Virtual Event"])

    }, [])
    return (
        <>
            <MediaModalLazy />
            <Router>
                {
                    initalCheck &&
                    <Switch>
                        {/* Register Route */}
                        <NotLoggedInRoutes redirectTo={HOME_ROUTE} path={REGISTER_ROUTE + "/:event"}>
                            <RegisterLazy />
                        </NotLoggedInRoutes>
                        <NotLoggedInRoutes redirectTo={HOME_ROUTE} path={REGISTER_ROUTE}>
                            <RegisterLazy />
                        </NotLoggedInRoutes>

                        {/* Login Route */}
                        <NotLoggedInRoutes redirectTo={HOME_ROUTE} path={LOGIN_ROUTE + "/:event"}>
                            <LoginLazy />
                        </NotLoggedInRoutes>
                        <NotLoggedInRoutes redirectTo={HOME_ROUTE} path={LOGIN_ROUTE}>
                            <LoginLazy />
                        </NotLoggedInRoutes>

                        {/* Home Route */}

                        <ProtectedRoute redirectTo={LOGIN_ROUTE} path={HOME_ROUTE}>
                            <PreEventLazy />
                        </ProtectedRoute>

                        {/* event-kmde59n5 */}
                        <ProtectedRoute redirectTo={LOGIN_ROUTE} path={EVENT_ROUTE + '/:id'}>
                            <EventLazy />
                        </ProtectedRoute>

                        {/* <ProtectedRoute redirectTo={LOGIN_ROUTE} path={TOPIC_ROUTE}>
                            <Topics />
                        </ProtectedRoute> */}
                        {/* <ProtectedRoute redirectTo={LOGIN_ROUTE} path={RootRoute}>
                            <PreEventLazy />
                            <Home />
                        </ProtectedRoute> */}
                        <ProtectedRoute redirectTo={LOGIN_ROUTE} path={"*"}>
                            {/* <PreEventLazy /> */}
                            <Home />
                        </ProtectedRoute>
                    </Switch>
                }
            </Router>
        </>
    )
}

//include lazy loading of componenets
//make speaker context, video context