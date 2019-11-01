import React from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import UserContextProvider from "context/user";
import SidebarContextProvider from "context/sidebar";
import Petservice from "./Petservice";
import { BrowserRouter as Router } from "react-router-dom";

class App extends React.Component {
  render() {
    return (
      <Router>
        <UserContextProvider>
          <SidebarContextProvider>
            <div className="min-h-screen min-w-full flex">
              <Petservice></Petservice>
            </div>
          </SidebarContextProvider>
        </UserContextProvider>
      </Router>
    );
  }
}

ReactDOM.render(<App></App>, document.getElementById("root"));

if (module.hot) {
  module.hot.accept();
}
