import React, { useEffect, useState, useRef } from "react";
import Table from "@components/Table";
import Button from "@components/Button";
import { API } from "@api-urls";
import api from "@api";

export default props => {
  let [data, setData] = useState([]);
  let fileUploadRef = useRef();

  useEffect(() => {
    api.get(API.MEDICINES).then(res => setData(res.data));
  }, []);
  return (
    <div className="inline-block m-5 flex-1 h-mc flex flex-col">
      <div className="flex mb-6">
        <h1 className="text-2xl text-gray-700">Medicines</h1>
        <div className="flex flex-1 justify-end">
          <div className="flex mr-6">
            <Button href="/medicines/new">Create new medicine</Button>
          </div>
          <div className="flex mr-6">
            <Button
              onClick={() =>
                window.open(
                  `http://localhost:5000/api${API.MEDICINES}/custom/export-json`,
                  "_blank"
                )
              }
            >
              Export JSON
            </Button>
          </div>
          <Button
            onClick={() => {
              if (fileUploadRef.current) {
                fileUploadRef.current.click();
              }
            }}
          >
            Import CSV
          </Button>
        </div>
        <input
          onChange={e => {
            let formData = new FormData();
            formData.append("csv", e.target.files[0]);
            api
              .post(`${API.MEDICINES}/custom/import-csv`, formData, {
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
        name="medicines"
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
