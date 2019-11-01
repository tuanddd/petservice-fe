import React, { useState, useContext } from "react";
import api from "api";
import { UserContext } from "context/user";
import { API } from "api-urls";

export default props => {
  let [state, setState] = useState({
    username: "",
    password: ""
  });
  let [isAuthorizing, setIsAuthorizing] = useState(false);
  let [error, setError] = useState({
    code: 200,
    text: ""
  });
  let { setUserState } = useContext(UserContext);
  return (
    <div className="min-h-screen w-full bg-indigo-500 flex justify-center items-center">
      <div className="container mx-4 max-w-sm">
        <form
          onSubmit={e => {
            e.preventDefault();
            if (isAuthorizing) return;
            setIsAuthorizing(true);
            setError({ code: 200 });
            api
              .post(API.LOGIN, state)
              .then(res => {
                if (res.status === 200) {
                  setError({ code: 200 });
                  setUserState({
                    isChecked: true,
                    isLoggedIn: true,
                    user: res.data.user,
                    token: res.data.token
                  });
                  localStorage.setItem("token", res.data.token);
                }
              })
              .catch(err => {
                setError({
                  code: err.response ? err.response.status : 400,
                  text: err.response ? err.response.data : err
                });
                setIsAuthorizing(false);
              });
          }}
          className="max-w-full rounded-lg shadow-md bg-white p-5 flex flex-col items-center"
        >
          <h1 className="mb-6 text-2xl">Petservice Admin</h1>
          <input
            value={state.username}
            onChange={e => setState({ ...state, username: e.target.value })}
            className="w-full mb-2 outline-none px-1 py-1 border-b-2 border-indigo-300"
            type="text"
            placeholder="Username"
          />
          <input
            value={state.password}
            onChange={e => setState({ ...state, password: e.target.value })}
            className="w-full mb-6 outline-none px-1 py-1 border-b-2 border-indigo-300"
            type="password"
            placeholder="Password"
          />
          <button className="cursor-pointer rounded shadow-md px-6 py-2 bg-indigo-500 text-white w-mc outline-none">
            Login
          </button>
          {error.code !== 200 && (
            <p className="mt-4 bg-red-500 text-white px-3 py-2 rounded">
              {error.text}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};
