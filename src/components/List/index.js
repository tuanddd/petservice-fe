import React, { useState, useRef, useEffect } from "react";
import { flattenDeep, differenceBy } from "lodash";

export default ({
  items,
  name,
  multiple,
  onClick,
  currentlySelected = [-1],
  ...props
}) => {
  if (!items) return null;
  let first = useRef(true);
  let [selected, setSelected] = useState(
    flattenDeep([currentlySelected]).map(c => ({ id: c }))
  );

  // useEffect(() => {
  //   if (first.current) {
  //     first.current = false;
  //     return;
  //   }

  //   multiple && onClick(currentlySelected);
  // }, [currentlySelected]);

  // useEffect(() => {
  //   !multiple && setSelected([]);
  // }, [multiple]);

  // useEffect(() => {
  //   setSelected(flattenDeep([currentlySelected]).map(c => ({ id: c })));
  // }, [currentlySelected]);

  return (
    <div
      style={{ maxHeight: 300 }}
      {...props}
      className="rounded-lg bg-white shadow px-2 py-1 flex flex-col overflow-auto"
    >
      {items.map((i, index) => {
        return (
          <div
            key={`list-option-${name}-${index}`}
            onClick={() => {
              if (multiple) {
                onClick(
                  currentlySelected.map(s => s.id).indexOf(i.id) !== -1
                    ? differenceBy(currentlySelected, [i], "id")
                    : currentlySelected.concat([i])
                );
              } else {
                onClick(i);
              }
            }}
            style={{ transition: "background-color 0.1s ease-in-out" }}
            tabIndex="0"
            className={`rounded-lg my-1 outline-none px-3 py-2 text-gray-800 ${
              flattenDeep([currentlySelected])
                .map(c => c.id)
                .indexOf(i.id) !== -1
                ? "bg-gray-300"
                : "bg-white"
            } hover:bg-gray-300 cursor-pointer`}
          >
            {i.display()}
          </div>
        );
      })}
    </div>
  );
};
