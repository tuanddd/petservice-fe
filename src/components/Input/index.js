import React from "react";

export default ({ onChange, readOnly, value, ...props }) => {
  return (
    <input
      style={{ transition: "all 0.2s ease-in-out" }}
      className={`rounded ${
        readOnly ? "bg-gray-200 cursor-default" : "bg-white"
      } outline-none border border-gray-300 focus:border-gray-500 px-3 py-2 text-base w-full`}
      {...props}
      readOnly={readOnly}
      value={value}
      onChange={onChange}
    />
  );
};
