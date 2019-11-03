import React from "react";
import InputGroup from "../InputGroup";

export default ({ inputGroups = [], name, children, ...props }) => {
  return (
    <div className="w-full md:w-2/3 md:pl-2 mt-6 md:mt-0">
      {inputGroups.map((ig, i) => {
        return (
          <InputGroup
            key={`${name}-input-group-${i}`}
            first={i === 0}
            name={name}
            {...ig}
          ></InputGroup>
        );
      })}
      {children}
    </div>
  );
};
