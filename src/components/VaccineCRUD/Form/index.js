import React, {
  useReducer,
  useRef,
  useState,
  useEffect,
  useContext
} from "react";
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
import List from "@components/List";

export default props => {
  let { userState } = useContext(UserContext);
  let { id } = useParams();
  let history = useHistory();

  const schema = yup.object().shape({
    id: yup.number().required(),
    name: yup.string().required(),
    notes: yup.string().default(""),
    petTypeId: yup.number(),
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
      type: 1,
      viri: [],
      petTypeId: 1,
      updatedAt: new Date(),
      createdAt: new Date()
    }
  );

  let [viruses, setViruses] = useState([]);

  const setWrapper = key => e => setState({ key, value: e.target.value });

  const remove = id => {
    let name = prompt("Type the vaccine name to confirm", "");
    let confirmed = name === state.name;
    if (confirmed) {
      api.delete(`${API.VACCINES}/${id}`).then(res => {
        history.push("/vaccines");
      });
    } else {
      alert("Mismatched name, cancelling...");
    }
  };

  useEffect(() => {
    api.get(API.VIRUSES).then(res => setViruses(res.data));
    if (id) {
      api.get(`${API.VACCINES}/${id}`).then(async res => {
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
        to={"/vaccines"}
        style={{ transition: "color 0.2s ease-in-out" }}
        className="flex items-center text-gray-600 hover:text-gray-700 w-mc mb-8"
      >
        <ChevronLeft></ChevronLeft>
        <span className="ml-1 text-lg">Back to vaccine list</span>
      </Link>
      <h1 className="text-2xl text-gray-700">
        {id ? `Vaccine - ${state.name}` : "New vaccine"}
      </h1>
      <div className="bg-gray-400 mb-8 mt-2 h-px"></div>
      <Form
        onSubmit={() => {
          if (id) {
            api
              .put(`${API.VACCINES}/${id}`, {
                ...state,
                viri: undefined
              })
              .then(res => {
                api
                  .delete(`${API.VACCINE_VIRUS}`, { params: { vaccineId: id } })
                  .then(resDelete => {
                    api
                      .post(
                        API.VACCINE_VIRUS,
                        state.viri.map(v => ({ vaccineId: id, virusId: v.id })),
                        { params: { bulk: true } }
                      )
                      .then(resInsert => history.push("/vaccines"));
                  });
              });
          } else {
            api
              .post(API.VACCINES, {
                ...state,
                viri: undefined,
                vaccineViri: state.viri.map(v => ({ virusId: v.id }))
              })
              .then(res => {
                history.push("/vaccines");
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
            name="vaccines"
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
              },
              {
                label: 'Pet type',
                custom: () => <Dropdown options={Object.entries(PET_TYPE_ID).map(([key, value]) => ({ isSelected: state.petTypeId === Number(key), name: value, value: Number(key) }))} onClick={opt => setState({ key: 'petTypeId', value: opt.value })}></Dropdown>
              },
              {
                label: "Type",
                htmlFor: "type",
                custom: () => {
                  return (
                    <List
                      name="vaccine-type"
                      currentlySelected={[{ id: state.type }]}
                      onClick={t => setState({ key: "type", value: t.id })}
                      items={[
                        {
                          id: 1,
                          display: () => "Single"
                        },
                        {
                          id: 2,
                          display: () => "Multiple"
                        }
                      ]}
                    ></List>
                  );
                }
              }
            ]}
          ></SectionContent>
        </Row>
        <Divider></Divider>
        <Row>
          <SectionName subHeading="Use of vaccine.">Medical</SectionName>
          <SectionContent
            name="vaccines"
            inputGroups={[
              {
                label: "Strong against:",
                htmlFor: "counter-virus",
                custom: () => {
                  return (
                    <List
                      multiple={state.type === 2}
                      items={viruses.map(v => ({
                        id: v.id,
                        display: () => v.name
                      }))}
                      currentlySelected={state.viri.map(v => ({ id: v.id }))}
                      onClick={viri => {
                        if (state.type === 1) {
                          setState({ key: "viri", value: [viri] });
                        } else {
                          setState({
                            key: "viri",
                            value: viri
                          });
                        }
                      }}
                    ></List>
                  );
                }
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
                  Remove this vaccine from the system. This action cannnot be
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
          <Button
            disabled={
              state.viri.length === 0 ||
              state.name === "" ||
              (state.type === 1 && state.viri.length > 1)
            }
            type="submit"
          >
            {id ? "Save" : "Create"}
          </Button>
        </div>
      </Form>
    </div>
  );
};
