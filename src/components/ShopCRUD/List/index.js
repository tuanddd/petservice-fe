import React, { useEffect, useState, useContext } from "react";
import Table from "@components/Table";
import Button from "@components/Button";
import { API } from "@api-urls";
import api from "@api";
import { UserContext } from "@context/user";

export default props => {
  let [data, setData] = useState([]);
  let { userState } = useContext(UserContext);

  useEffect(() => {
    api
      .get(API.SHOPS, {
        params: {
          userId: userState.user.id
        }
      })
      .then(res => setData(res.data));
  }, []);
  return (
    <div className="inline-block m-5 flex-1 h-mc flex flex-col">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl text-gray-700">Shops</h1>
        <Button href="/shops/new">Create new shop</Button>
      </div>
      <Table
        more={["Edit"]}
        name="shops"
        className="-mx-5"
        headers={[
          {
            text: "ID",
            accessor: "id"
          },
          {
            text: "Name",
            accessor: "name"
          },
          {
            text: "Description",
            accessor: "description"
          },
          {
            text: "Status",
            accessor: "status"
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
