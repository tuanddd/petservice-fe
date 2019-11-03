import React from "react";
import InputGroup from "../InputGroup";

export default ({ inputGroups = [], name, ...props }) => {
  return (
    <div className="w-full md:w-2/3 md:pl-2 mt-6 md:mt-0">
      <div className="flex flex-col">
        {inputGroups.map(ig => {
          return <InputGroup name={name} {...ig}></InputGroup>;
        })}
      </div>
    </div>
  );
};
