import React, { createContext, useState } from "react";

const initialState = {
  isChecked: false,
  isLoggedIn: false,
  user: {},
  token: ""
};

export const UserContext = createContext();

export default ({ children, ...props }) => {
  let [userState, setUserState] = useState(initialState);
  return (
    <UserContext.Provider value={{ userState, setUserState }}>
      {children}
    </UserContext.Provider>
  );
};
