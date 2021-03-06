import React from "react";
import Input from "@components/Input";

export default ({
  name,
  first = true,
  type = "input",
  custom = null,
  label,
  supportingText,
  htmlFor,
  value,
  onChange,
  inputProps,
  ...props
}) => {
  return (
    <div className={`flex flex-col${first ? "" : " mt-6"}`}>
      <label className="mb-2 text-gray-800" htmlFor={`${name}-${htmlFor}`}>
        {label}
      </label>
      {supportingText && (
        <p className="-mt-2 mb-4 text-gray-700 text-sm">{supportingText}</p>
      )}
      {custom ? (
        custom()
      ) : type === "input" ? (
        <Input
          id={`${name}-${htmlFor}`}
          value={value}
          onChange={onChange}
          {...inputProps}
        ></Input>
      ) : type === "textarea" ? (
        <textarea
          id={`${name}-${htmlFor}`}
          cols="30"
          rows="10"
          value={value}
          onChange={onChange}
          style={{ transition: "all 0.2s ease-in-out" }}
          className="border border-gray-300 focus:border-gray-500 rounded bg-white outline-none text-base p-2"
          {...inputProps}
        ></textarea>
      ) : null}
    </div>
  );
};
