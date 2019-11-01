import React, { useEffect, useState, useContext } from "react";
import Table from "@components/Table";
import { API } from "@api-urls";
import api from "@api";
import { UserContext } from "@context/user";
import Button from "@components/button";

export default props => {
  let [data, setData] = useState([]);
  let { userState } = useContext(UserContext);

  useEffect(() => {
    api
      .get(API.SERVICES, {
        params: {
          userId: userState.user.id
        }
      })
      .then(res => setData(res.data));
  }, []);
  return (
    <div className="inline-block m-5 flex-1 h-mc flex flex-col">
      <div className="mb-6 flex justify-between">
        <h1 className="text-2xl text-gray-700">Services</h1>
        <Button href="/services/new">Create new service</Button>
      </div>
      <Table
        name="services"
        className="-mx-5"
        more={["Edit"]}
        headers={[
          {
            text: "ID",
            accessor: "id"
          },
          {
            text: "Name",
            accessor: "name"
          },
          // {
          //   text: "Description",
          //   accessor: "description"
          // },
          {
            text: "Price",
            accessor: "price"
          },
          {
            text: "Unit",
            accessor: "unit"
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
          },
          {
            text: "Shop ID",
            accessor: "shop.id"
          }
        ]}
        data={data}
      ></Table>
    </div>
  );
};
