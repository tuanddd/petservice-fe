import React, { useEffect, useState, useRef } from "react";
import Table from "@components/Table";
import Button from "@components/Button";
import { API } from "@api-urls";
import api from "@api";

export default props => {
  let [data, setData] = useState([]);

  useEffect(() => {
    api.get(API.ACCOUNTS).then(res => setData(res.data));
  }, []);
  return (
    <div className="inline-block m-5 flex-1 h-mc flex flex-col">
      <div className="flex mb-6">
        <h1 className="text-2xl text-gray-700">Accounts</h1>
        <div className="flex flex-1 justify-end">
          <div className="flex mr-6">
            <Button href="/accounts/new">Create new account</Button>
          </div>
        </div>
      </div>
      <Table
        name="accounts"
        className="-mx-5"
        headers={[
          {
            text: "ID",
            accessor: "id"
          },
          {
            text: "Email",
            accessor: "email"
          },
          {
            text: "Name",
            accessor: "name"
          },
          {
            text: 'Provider',
            accessor: 'provider',
            render: provider => provider
          },
          {
            text: 'Role',
            accessor: 'role.name'
          },
          {
            text: "Created",
            accessor: "createdAt",
            type: "datetime"
          },
          {
            text: "Updated",
            accessor: "updatedAt",
            type: "datetime"
          }
        ]}
        data={data}
      ></Table>
    </div>
  );
};
