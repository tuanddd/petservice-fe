import React, { useContext, useEffect } from "react";
import { UserContext } from "context/user";
import api from "api";
import { API } from "api-urls";
import Login from "components/Login";
import Dashboard from "components/Dashboard";
import { withRouter } from "react-router-dom";

export default withRouter(props => {
  let { userState, setUserState } = useContext(UserContext);

  useEffect(() => {
    let unlisten = props.history.listen(location => {
      console.log(location.pathname);
    });
    let token = localStorage.getItem("token");
    if (token) {
      api
        .get(API.ME)
        .then(res => {
          if (res.status === 200) {
            setUserState({
              isChecked: true,
              isLoggedIn: true,
              user: res.data.user,
              token: res.data.token
            });
          }
        })
        .catch(err => {
          console.log(err);
          setUserState({
            isChecked: true,
            isLoggedIn: false,
            user: {},
            token: ""
          });
        });
    } else {
      setUserState({
        isChecked: true,
        isLoggedIn: false,
        user: {},
        token: ""
      });
    }

    return () => unlisten();
  }, []);

  if (!userState.isChecked) return null;
  return userState.isLoggedIn ? <Dashboard></Dashboard> : <Login></Login>;
});
