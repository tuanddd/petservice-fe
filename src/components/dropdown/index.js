import React, { useState, useEffect, useRef } from "react";
import { useClickOutside } from "@hooks/useClickOutside";
import { ChevronLeft } from "react-feather";
import { useSpring, animated } from "react-spring";

export default ({ options = [], onClick, ...props }) => {
  let [expand, setExpand] = useState(false);
  let { isOutside, ref } = useClickOutside();
  let first = useRef(true);

  let chevronStyle = useSpring({ transform: `rotate(${expand ? -90 : 0}deg)` });

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }

    if (isOutside) setExpand(false);
  }, [isOutside]);
  return (
    <div
      ref={ref}
      onClick={() => setExpand(o => !o)}
      className="relative flex h-mc w-mc"
    >
      <div
        tabIndex="0"
        style={{ transition: "background-color,color 0.3s ease-in-out" }}
        className={`px-3 py-2 ${
          expand ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        } rounded z-10 relative flex justify-between border border-gray-300 outline-none select-none cursor-pointer`}
      >
        <span className="mr-4">{options.find(opt => opt.isSelected).name}</span>
        <animated.div style={chevronStyle}>
          <ChevronLeft></ChevronLeft>
        </animated.div>
      </div>
      {expand && (
        <div
          style={{ top: "calc(100% + 10px)" }}
          className="min-w-full absolute bg-white border border-gray-200 rounded shadow-lg p-2"
        >
          {options.map(opt => {
            return (
              <div
                key={`dropdown-${name}-${opt.name}`}
                onClick={() => onClick(opt)}
                style={{ transition: "all 0.2s ease-in-out" }}
                className="rounded cursor-pointer p-2 hover:bg-gray-300"
              >
                {opt.name}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
