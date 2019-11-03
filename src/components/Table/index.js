import React from "react";
import { format } from "date-fns";
import { MoreHorizontal } from "react-feather";
import { useHistory } from "react-router-dom";

export default ({ more = [], name, shop, headers, data, ...props }) => {
  let history = useHistory();
  return (
    <table {...props}>
      <thead>
        <tr className="border-b border-gray-400 text-gray-600">
          {headers.map(h => {
            return (
              <th
                key={`${name}-table-head-${h.text}`}
                className="text-left p-4 font-normal"
              >
                {h.text}
              </th>
            );
          })}
          {more.length > 0 ? <th></th> : null}
        </tr>
      </thead>
      <tbody>
        {data.map((d, i) => {
          return (
            <tr
              style={{ transition: "background-color 0.2s ease-in-out" }}
              key={`${name}-table-body-row-${i}`}
              className={`${
                i === 0 ? "" : "border-t border-gray-400"
              } hover:bg-gray-200`}
            >
              {headers.map((h, i) => {
                let value = h.accessor
                  ? h.accessor.split(".").reduce((obj, p) => obj[p], d)
                  : null;
                let type = h.type;
                return (
                  <td
                    key={`${name}-table-data-${i}`}
                    className="p-4 text-gray-800"
                  >
                    {type === "datetime"
                      ? format(new Date(value), "hh:mm:ss, dd/MM/yyyy")
                      : value}
                  </td>
                );
              })}
              {more.length > 0 ? (
                <td>
                  <MoreHorizontal
                    tabIndex="0"
                    onClick={() => history.push(`/${name}/${d.id}/edit`)}
                    cursor={"pointer"}
                  ></MoreHorizontal>
                </td>
              ) : null}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
