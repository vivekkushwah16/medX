import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import { UserContext } from "../../Context/Auth/UserContextProvider";

export default function ProtectedRoute(props) {
  const { user } = useContext(UserContext);
  const getRedirectLink = () => {
    let lnk = `${props.redirectTo}${
      window.location.pathname === "/"
        ? ""
        : `?return=${encodeURIComponent(
            window.location.pathname + window.location.search
          )}`
    }`;
    // console.log(lnk)
    return lnk;
  };
  if (user) {
    return (
      <Route exact={props.exact} path={props.path}>
        {props.children}
      </Route>
    );
  } else {
    return <Redirect to={getRedirectLink()}></Redirect>;
  }
}
