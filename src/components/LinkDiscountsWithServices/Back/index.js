import React from "react";
import { ChevronLeft } from "react-feather";

export default ({ type = "link", to, children, onClick, ...props }) => {
  return type === "link" ? (
    <Link
      tabIndex="0"
      to={to}
      style={{ transition: "color 0.2s ease-in-out" }}
      className="flex items-center text-gray-600 hover:text-gray-700 w-mc cursor-pointer"
      {...props}
    >
      <ChevronLeft></ChevronLeft>
      <span className="ml-1 text-lg">{children}</span>
    </Link>
  ) : type === "div" ? (
    <div
      tabIndex="0"
      onClick={onClick}
      className="flex items-center text-gray-600 hover:text-gray-700 w-mc cursor-pointer"
      {...props}
    >
      <ChevronLeft></ChevronLeft>
      <span className="ml-1 text-lg">{children}</span>
    </div>
  ) : null;
};
