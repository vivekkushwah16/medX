import React, { useContext } from 'react';
import { Redirect, Route, useLocation } from 'react-router-dom';
import { UserContext } from '../../Context/Auth/UserContextProvider';

export default function NotLoggedInRoutes(props) {
    //this hook will be used to get the return url from link
    let urlQuery = useQuery();
    function useQuery() {
        return new URLSearchParams(useLocation().search);
    }

    const { user } = useContext(UserContext)
    if (!user) {
        return (<Route exact path={props.path}>{props.children}</Route>)
    } else {
        return (<Redirect to={urlQuery.get("return") ? urlQuery.get("return") : props.redirectTo}></Redirect>)
    }
}