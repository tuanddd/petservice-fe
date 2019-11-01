import React, { useEffect, useState, useContext } from "react";
import Table from "@components/Table";
import { API } from "@api-urls";
import api from "@api";
import { UserContext } from "@context/user";
import Button from "@components/Button";

export default props => {
  let [data, setData] = useState([]);
  let { userState } = useContext(UserContext);

  useEffect(() => {
    api
      .get(API.DISCOUNTS, {
        params: {
          userId: userState.user.id
        }
      })
      .then(res => setData(res.data));
  }, []);
  return (
    <div className="inline-block m-5 flex-1 h-mc flex flex-col">
      <div className="mb-6 flex justify-between">
        <h1 className="text-2xl text-gray-700">Discounts</h1>
        <Button href="/discounts/new">Create new discount</Button>
      </div>
      <Table
        name="discounts"
        more={["Edit"]}
        className="-mx-5"
        headers={[
          {
            text: "ID",
            accessor: "id"
          },
          {
            text: "Code",
            accessor: "code"
          },
          {
            text: "Status",
            accessor: "status"
          },
          // {
          //   text: "Description",
          //   accessor: "description"
          // },
          {
            text: "Value",
            accessor: "value"
          },
          {
            text: "Unit",
            accessor: "unit"
          },
          {
            text: "Valid from",
            accessor: "validFrom",
            type: "datetime"
          },
          {
            text: "Valid until",
            accessor: "validUntil",
            type: "datetime"
          },
          {
            text: ""
          }
        ]}
        data={data}
      ></Table>
    </div>
  );
};
