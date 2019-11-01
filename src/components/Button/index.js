import React from "react";
import { Link } from "react-router-dom";

export default ({ children, href, ...props }) => {
  if (href) {
    return (
      <Link
        className="rounded py-2 px-4 shadow bg-indigo-700 text-white"
        to={href}
        {...props}
      >
        {children}
      </Link>
    );
  }
  return (
    <button
      {...props}
      className="rounded py-2 px-4 shadow bg-indigo-700 text-white"
    >
      {children}
    </button>
  );
};
