import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "@context/user";
import { ChevronLeft, LogOut } from "react-feather";
import { useClickOutside } from "@hooks/useClickOutside";
import { useSpring, animated } from "react-spring";

export default props => {
  let { userState } = useContext(UserContext);
  let [expand, setExpand] = useState(false);
  let { isOutside, ref } = useClickOutside();
  let first = useRef(true);
  let chevronStyle = useSpring({ transform: `rotate(${expand ? -90 : 0}deg)` });

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (isOutside) {
      setExpand(false);
    }
  }, [isOutside]);
  return (
    <div
      ref={ref}
      onClick={() => setExpand(old => !old)}
      style={{ transition: "background-color 0.2s ease-in-out" }}
      className="rounded z-20 select-none relative py-1 px-2 bg-white flex cursor-pointer hover:bg-gray-200"
    >
      <span className="mr-3">{userState.user.email}</span>
      <animated.div style={chevronStyle}>
        <ChevronLeft></ChevronLeft>
      </animated.div>

      {expand && (
        <div
          style={{ top: "calc(100% + 10px)" }}
          className="absolute right-0 min-w-full w-mc bg-white rounded shadow-xl border border-gray-300"
        >
          <div
            style={{ transition: "background-color 0.2s ease-in-out" }}
            className="hover:bg-gray-200 py-1 px-2 flex justify-between"
          >
            <p>Role: {userState.user.role.name}</p>
          </div>
          <div
            onClick={() => {
              localStorage.clear();
              window.location.reload(true);
            }}
            style={{ transition: "background-color 0.2s ease-in-out" }}
            className="hover:bg-gray-200 py-1 px-2 flex justify-between"
          >
            <p>Logout</p>
            <LogOut style={{ transform: "scale(0.7)" }}></LogOut>
          </div>
        </div>
      )}
    </div>
  );
};
