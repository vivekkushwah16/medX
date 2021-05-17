import React, { useContext, useEffect, useState } from 'react';
import { Redirect, Route, Switch, useHistory, useParams, useRouteMatch } from 'react-router-dom';
import { BACKSTAGE_COLLECTION, PLATFORM_BACKSTAGE_DOC } from '../../AppConstants/CollectionConstants';
import { HOME_ROUTE } from '../../AppConstants/Routes';
import { UserContext } from '../../Context/Auth/UserContextProvider';
import { firestore } from '../../Firebase/firebase';
import LoadableFallback from '../LoadableFallback/LoadableFallback';
import NotLoggedInRoutes from '../NotLoggedInRoutes/NotLoggedInRoutes';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';


const EventStausType = {
    NotLive: 'notLive',
    Live: 'live',
    Finished: 'finished'
}

export const EventChecker = (props) => {
    //to wait till we reead values from firesbase
    const [doneCheck, setCheckDonw] = useState(false)
    const [eventStatus, setEventStatus] = useState(false)


    //Router hooks
    let { url } = useRouteMatch();
    const { event } = useParams();
    const history = useHistory();

    useEffect(() => {
        getEventNameAndCrossCheck()
    }, [event])

    const getEventNameAndCrossCheck = async () => {
        console.log(event)
        let ref = firestore.collection(BACKSTAGE_COLLECTION).doc(PLATFORM_BACKSTAGE_DOC)
        const doc = await ref.get()
        if (!doc.exists) {
            history.push(`/home`);
        }
        const activeEventList = doc.data().activeEventList
        if (activeEventList.hasOwnProperty(event)) {
            setEventStatus(activeEventList[event].status)
            console.log(activeEventList[event].status)
            setCheckDonw(true)
        } else {
            history.push(`/home`);
        }
    }

    if (!doneCheck) {
        return <LoadableFallback />
    }

    return (
        <>
            <Switch>
                <NotLoggedInRoutes redirectTo={url} path={`${url}/login`}>
                    {props.login ?
                        <props.login event={event} />
                        : 'login'}
                </NotLoggedInRoutes>

                <NotLoggedInRoutes redirectTo={url} path={`${url}/register`}>
                    {props.register ?
                        <props.register event={event} />
                        : 'register'}
                </NotLoggedInRoutes>

                <ProtectedRoute redirectTo={`${url}/login`} path={url}>
                    {
                        eventStatus === EventStausType.NotLive &&
                        <>
                            {props.notLive ?
                                <props.notLive event={event} />
                                : 'NotLive Event'}
                        </>
                    }
                    {
                        eventStatus === EventStausType.Live &&
                        <>
                            {props.liveEvent ?
                                <props.liveEvent event={event} />
                                : 'Live Event'}
                        </>
                    }
                    {
                        eventStatus === EventStausType.Finished &&
                        <>
                            {props.finishedEvent ?
                                <props.finishedEvent event={event} />
                                : 'Finished Event'}
                        </>
                    }
                </ProtectedRoute>
                <Redirect to={HOME_ROUTE}></Redirect>
            </Switch>
        </>
    )
}

export default function EventRoute(props) {
    return (
        <>
            <Route exact={props.exact} path={'/:event'}>
                <EventChecker login={props.login} register={props.register} notLive={props.notLive} liveEvent={props.liveEvent} finishedEvent={props.finishedEvent}>
                    {props.children}
                </EventChecker>
            </Route>
            <Route exact path={'/'}>
                <Redirect to={props.redirectTo}></Redirect>
            </Route>
        </>
    )
}