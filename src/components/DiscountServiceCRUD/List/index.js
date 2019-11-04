import React, { useEffect, useState, useContext } from "react";
import Table from "@components/Table";
import Button from "@components/Button";
import { API } from "@api-urls";
import api from "@api";
import { UserContext } from "@context/user";
import { ROLES } from "@const";

export default props => {
  let [data, setData] = useState([]);
  let { userState } = useContext(UserContext);

  useEffect(() => {
    api
      .get(API.GET_SHOP_DISCOUNT_SERVICES_BY_USER_ID, {
        params: {
          userId: userState.user.id
        }
      })
      .then(res => setData(res.data));
  }, []);
  return (
    <div className="inline-block m-5 flex-1 h-mc flex flex-col">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl text-gray-700">Applied discount services</h1>
        <Button href="/shop-discount-services/new">Create new</Button>
      </div>
      <Table
        more={["Edit"]}
        name="shop-discount-services"
        className="-mx-5"
        headers={[
          {
            text: "ID",
            accessor: "id"
          },
          {
            text: "Shop",
            accessor: "shop.name"
          },
          {
            text: "Discount",
            accessor: "shop_discount.code"
          },
          {
            text: "Service",
            accessor: "shop_service.name"
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
