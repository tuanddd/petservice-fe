import React, { useReducer, useEffect, useContext } from "react";
import api from "@api";
import { API } from "@api-urls";
import Button from "@components/Button";
import { UserContext } from "@context/user";
import { useParams, useHistory, Link } from "react-router-dom";
import * as yup from "yup";
import { format } from "date-fns";
import Dropdown from "@components/dropdown";
import { ChevronLeft } from "react-feather";
import { ROLES, DEFAULT_SHOP_ICON, PET_TYPE_ID } from "@const";
import Form, {
  Row,
  SectionName,
  SectionContent,
  Divider
} from "@components/Form";
import Input from "@components/Input";

export default props => {
  let { id } = useParams();
  let history = useHistory();

  let [state, setState] = useReducer(
    (state, action) => {
      if (action.bulk) return action.value;
      return { ...state, [action.key]: action.value };
    },
    {
      email: '',
      name: "",
      password: "",
      roleId: 2,
      updatedAt: new Date(),
      createdAt: new Date()
    }
  );

  const setWrapper = key => e => setState({ key, value: e.target.value });

  const remove = id => {
    let name = prompt("Type the user email to confirm", "");
    let confirmed = name === state.name;
    if (confirmed) {
      api.delete(`${API.ACCOUNTS}/${id}`).then(res => {
        history.push("/accounts");
      });
    } else {
      alert("Mismatched name, cancelling...");
    }
  };

  return (
    <div className="flex flex-col mx-6 my-4 flex-1 h-mc">
      <Link
        to={"/accounts"}
        style={{ transition: "color 0.2s ease-in-out" }}
        className="flex items-center text-gray-600 hover:text-gray-700 w-mc mb-8"
      >
        <ChevronLeft></ChevronLeft>
        <span className="ml-1 text-lg">Back to account list</span>
      </Link>
      <h1 className="text-2xl text-gray-700">
        {id ? `Account - ${state.name}` : "New shop manager"}
      </h1>
      <div className="bg-gray-400 mb-8 mt-2 h-px"></div>
      <Form
        onSubmit={() => {
          if (id) {
            api.put(`${API.ACCOUNTS}/${id}`, state).then(res => {
              history.push("/accounts");
            });
          } else {
            api.post(API.ACCOUNTS, state).then(res => {
              history.push("/accounts");
            });
          }
        }}
        className="flex flex-col"
      >
        <Row>
          <SectionName subHeading="Some information to get started.">
            Basics
          </SectionName>
          <SectionContent
            name="accounts"
            inputGroups={[
              {
                label: "Name",
                htmlFor: "name",
                value: state.name,
                onChange: setWrapper("name")
              },
              {
                label: "Email",
                htmlFor: "email",
                value: state.email,
                onChange: setWrapper("email")
              },
              {
                label: "Password",
                htmlFor: "password",
                inputProps: {
                  type: 'password'
                },
                value: state.password,
                onChange: setWrapper("password")
              },
              {
                label: 'Role',
                htmlFor: 'role',
                custom: () => <Dropdown options={[{ isSelected: true, name: 'SHOP_MANAGER', value: 2 }]} onClick={opt => setState({ key: 'roleId', value: 2 })}></Dropdown>
              }
            ]}
          ></SectionContent>
        </Row>
        <Divider></Divider>
        {id && (
          <>
            <div className="flex">
              <div className="w-1/3 pr-2">
                <h2 className="text-xl text-gray-800">Dangerous Zone</h2>
                <p className="text-sm text-gray-600 mt-3">
                  Remove this breed from the system. This action cannnot be
                  undo.
                </p>
              </div>
              <div className="w-2/3 pl-2">
                <Button onClick={() => remove(state.id)} type="button">
                  Delete
                </Button>
              </div>
            </div>
            <div className="bg-gray-400 my-8 h-px"></div>
          </>
        )}

        <div className="w-mc self-end">
          <Button type="submit">{id ? "Save" : "Create"}</Button>
        </div>
      </Form>
    </div>
  );
};
