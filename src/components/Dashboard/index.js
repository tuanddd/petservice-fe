import React, { useContext } from "react";
import { SidebarContext } from "@context/sidebar";
import { UserContext } from "@context/user";
import Sidebar from "../Sidebar";
import styled from "styled-components";
import ProfileDropdown from "@components/profile-dropdown";
import { Switch, Route, Redirect } from "react-router-dom";

const Dashboard = styled.div`
  /* display: grid;
  grid-template-columns: minmax(150px, 200px) 1fr;
  grid-template-rows: 50px calc(100vh - 50px); */
  flex: 1;
  display: flex;
  position: relative;
`;

const Content = styled.div`
  /* grid-column: 2 / span 1;
  grid-row: 2 / span 1; */
  overflow: auto;
  display: flex;
`;

export default props => {
  let { sidebarState } = useContext(SidebarContext);
  let { userState } = useContext(UserContext);

  return (
    <Dashboard className="bg-gray-200 max-h-screen max-w-full">
      <div
        style={{ height: "50vh" }}
        className="absolute bg-indigo-900 w-full"
      ></div>
      <div className="max-w-full py-4 px-6 pb-6 flex-1 flex flex-col z-10">
        <div className="flex justify-between">
          <Sidebar></Sidebar>
          <ProfileDropdown></ProfileDropdown>
        </div>
        <Content className="bg-white flex-1 rounded mt-6 shadow-md">
          <Switch>
            {sidebarState.map(({ id, route, Component, showWhenRoles }) => {
              if (showWhenRoles.indexOf(userState.user.role.name) === -1)
                return null;
              return (
                <Route exact path={route} key={`sidebar-route-${id}`}>
                  <Component></Component>
                </Route>
              );
            })}
            <Redirect exact from="/" to="/shops"></Redirect>
          </Switch>
        </Content>
      </div>
      {/* <Sidebar></Sidebar>
      <Navigator></Navigator>
      <Content className="bg-gray-100">
        <Switch>
          {sidebarState.map(({ id, route, Component }) => {
            return (
              <Route path={route} key={`sidebar-route-${id}`}>
                <Component></Component>
              </Route>
            );
          })}
          <Redirect exact from="/" to="/shops"></Redirect>
        </Switch>
      </Content> */}
    </Dashboard>
  );
};
