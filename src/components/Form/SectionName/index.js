import React from "react";

export default ({ children, subHeading, ...props }) => {
  return (
    <div className="w-full md:w-1/3 md:pr-2">
      <h2 className="text-xl text-gray-800">{children}</h2>
      <p className="text-sm text-gray-600 mt-3">{subHeading}</p>
    </div>
  );
};
