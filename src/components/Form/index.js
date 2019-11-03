import React from "react";

export { default as Row } from "./Row";
export { default as Divider } from "./Divider";
export { default as SectionName } from "./SectionName";
export { default as SectionContent } from "./SectionContent";
export { default as InputGroup } from "./InputGroup";

export default ({ onSubmit, children, ...props }) => {
  return (
    <form
      onSubmit={async e => {
        e.preventDefault();
        await onSubmit();
      }}
      className="flex flex-col"
    >
      {children}
    </form>
  );
};
