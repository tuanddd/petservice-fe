import React from "react";

export default ({ onChange, value, ...props }) => {
  return (
    <input
      style={{ transition: "all 0.2s ease-in-out" }}
      className="rounded bg-white outline-none border border-gray-300 focus:border-gray-500 px-3 py-2 text-base"
      {...props}
      value={value}
      onChange={onChange}
    />
  );
};
