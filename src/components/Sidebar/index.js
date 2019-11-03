import React, { useContext } from "react";
import { SidebarContext } from "@context/sidebar";
import { UserContext } from "@context/user";

export default props => {
  let { sidebarState, setSidebarState } = useContext(SidebarContext);
  let { userState } = useContext(UserContext);
  // let styles = useSpring({
  //   transform: `translate3d(0px, ${100 *
  //     sidebarState.find(s => s.isMatched).id -
  //     100}%, 0px) scaleY(0.7)`,
  //   width: 2,
  //   height: 48
  // });

  return (
    <div
      // style={{ gridColumn: "1 / span 1", gridRow: "1 / span 2" }}
      className="flex -mx-3"
    >
      {/* <div className="bg-gray-800" style={{ width: "30px" }}></div> */}
      {/* <div className="flex"> */}
      {/* <h1 className="text-2xl text-center my-2 text-gray-800">Pet Service</h1> */}
      <div className="flex flex-1 relative">
        {/* <animated.div
            className={"absolute top-0 right-0 bg-gray-800"}
            style={styles}
          ></animated.div> */}
        {sidebarState.map(({ id, Link, showWhenRoles }) => {
          if (showWhenRoles.indexOf(userState.user.role.name) === -1)
            return null;
          return (
            <Link
              onClick={() =>
                setSidebarState(
                  sidebarState.map(s => ({ ...s, isMatched: s.id === id }))
                )
              }
              key={`sidebar-link-${id}`}
              className={`text-base py-1 px-3 mx-3 no-underline${
                id === sidebarState.find(s => s.isMatched).id
                  ? " bg-gray-900 rounded text-white"
                  : " text-gray-500"
              }`}
            ></Link>
          );
        })}
      </div>
      {/* </div> */}
    </div>
  );
};
