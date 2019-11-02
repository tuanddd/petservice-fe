import React from "react";

export default ({ items, name, onClick, currentlySelected = -1, ...props }) => {
  if (!items) return null;
  return (
    <div
      {...props}
      className="rounded-lg bg-white shadow px-2 py-1 flex flex-col overflow-auto"
    >
      {items.map((i, index) => {
        return (
          <div
            key={`list-option-${name}-${index}`}
            onClick={() => onClick(i)}
            style={{ transition: "background-color 0.2s ease-in-out" }}
            tabIndex="0"
            className={`rounded-lg my-1 outline-none px-3 py-2 text-gray-800 ${
              i.id === currentlySelected ? "bg-gray-300" : "bg-white"
            } hover:bg-gray-300 cursor-pointer`}
          >
            {i.display()}
          </div>
        );
      })}
    </div>
  );
};
