import React from "react";

export default ({ children, ...props }) => {
  return <div className="flex flex-col md:flex-row">{children}</div>;
};
