import React from "react";

export default ({ onSubmit, children, ...props }) => {
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit();
      }}
      className="flex flex-col"
    >
      {children}
    </form>
  );
};
