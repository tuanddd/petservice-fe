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
import { ROLES, DEFAULT_SHOP_ICON } from "@const";
import Form, {
  Row,
  SectionName,
  SectionContent,
  Divider
} from "@components/Form";
import Input from "@components/Input";

export default props => {
  let { userState } = useContext(UserContext);
  let { id } = useParams();
  let history = useHistory();

  const schema = yup.object().shape({
    id: yup.number().required(),
    name: yup.string().required(),
    notes: yup.string().default(""),
    createdAt: yup.date().required(),
    updatedAt: yup.date().required()
  });
  let [state, setState] = useReducer(
    (state, action) => {
      if (action.bulk) return action.value;
      return { ...state, [action.key]: action.value };
    },
    {
      name: "",
      notes: "",
      updatedAt: new Date(),
      createdAt: new Date()
    }
  );

  const setWrapper = key => e => setState({ key, value: e.target.value });

  const remove = id => {
    let name = prompt("Type the medicine name to confirm", "");
    let confirmed = name === state.name;
    if (confirmed) {
      api.delete(`${API.MEDICINES}/${id}`).then(res => {
        history.push("/medicines");
      });
    } else {
      alert("Mismatched name, cancelling...");
    }
  };

  useEffect(() => {
    if (id) {
      api.get(`${API.MEDICINES}/${id}`).then(async res => {
        try {
          let casted = schema.cast(res.data);
          let valid = await schema.isValid(casted);
          if (valid) {
            setState({ bulk: true, value: casted });
          } else {
            await schema.validate(casted);
          }
        } catch (error) {
          console.log(error);
        }
      });
    }
  }, []);
  return (
    <div className="flex flex-col mx-6 my-4 flex-1 h-mc">
      <Link
        to={"/medicines"}
        style={{ transition: "color 0.2s ease-in-out" }}
        className="flex items-center text-gray-600 hover:text-gray-700 w-mc mb-8"
      >
        <ChevronLeft></ChevronLeft>
        <span className="ml-1 text-lg">Back to medicine list</span>
      </Link>
      <h1 className="text-2xl text-gray-700">
        {id ? `Medicine - ${state.name}` : "New medicine"}
      </h1>
      <div className="bg-gray-400 mb-8 mt-2 h-px"></div>
      <Form
        onSubmit={() => {
          if (id) {
            api.put(`${API.MEDICINES}/${id}`, state).then(res => {
              history.push("/medicines");
            });
          } else {
            api.post(API.MEDICINES, state).then(res => {
              history.push("/medicines");
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
            name="medicines"
            inputGroups={[
              {
                label: "Name",
                htmlFor: "name",
                value: state.name,
                onChange: setWrapper("name")
              },
              {
                label: "Notes",
                htmlFor: "notes",
                value: state.notes,
                onChange: setWrapper("notes")
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
                  Remove this medicine from the system. This action cannnot be
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
