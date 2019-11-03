import React from "react";
import { Link } from "react-router-dom";

export default ({ children, href, disabled = false, ...props }) => {
  if (href && !disabled) {
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
      className={`rounded py-2 px-4 shadow ${
        disabled
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-indigo-700 cursor-pointer"
      } text-white`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
