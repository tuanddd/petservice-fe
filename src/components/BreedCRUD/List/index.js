import React, { useEffect, useState, useRef } from "react";
import Table from "@components/Table";
import Button from "@components/Button";
import { API } from "@api-urls";
import api from "@api";

export default props => {
  let [data, setData] = useState([]);
  let fileUploadRef = useRef();

  useEffect(() => {
    api.get(API.BREEDS).then(res => setData(res.data));
  }, []);
  return (
    <div className="inline-block m-5 flex-1 h-mc flex flex-col">
      <div className="flex mb-6">
        <h1 className="text-2xl text-gray-700">Breeds</h1>
        <div className="flex flex-1 justify-end">
          <div className="flex mr-6">
            <Button href="/breeds/new">Create new breed</Button>
          </div>
          <Button
            onClick={() => {
              if (fileUploadRef.current) {
                fileUploadRef.current.click();
              }
            }}
          >
            Import CSV file
          </Button>
        </div>
        <input
          onChange={e => {
            let formData = new FormData();
            formData.append("csv", e.target.files[0]);
            api
              .post(`${API.BREEDS}/custom/import-csv`, formData, {
                headers: {
                  "Content-Type": "multipart/form-data"
                }
              })
              .then(res => res.data && window.location.reload(true));
            fileUploadRef.current.value = "";
          }}
          accept="text/csv"
          ref={fileUploadRef}
          type="file"
          className="absolute invisible top-0 right-0 z-0"
        />
      </div>
      <Table
        more={["Edit"]}
        name="breeds"
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
            text: "Notes",
            accessor: "notes"
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