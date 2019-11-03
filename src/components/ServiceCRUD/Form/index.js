import React, { useReducer, useState, useEffect, useContext } from "react";
import api from "@api";
import { API } from "@api-urls";
import Button from "@components/Button";
import { UserContext } from "@context/user";
import { useParams, useHistory, Link } from "react-router-dom";
import * as yup from "yup";
import { format } from "date-fns";
import { set, cloneDeep } from "lodash";
import { ChevronLeft } from "react-feather";
import Form, {
  Row,
  Divider,
  SectionName,
  SectionContent,
  InputGroup
} from "@components/Form";
import List from "@components/List";

export default props => {
  let { userState } = useContext(UserContext);
  let { id } = useParams();
  let history = useHistory();

  const schema = yup.object().shape({
    id: id ? yup.number().required() : yup.number(),
    userId: yup.number().required(),
    shop: yup.object(),
    shopId: yup.number(),
    name: yup.string().required(),
    price: yup
      .string()
      .required()
      .default("0"),
    unit: yup
      .string()
      .required()
      .default("VND"),
    description: yup
      .string()
      .transform((value, original) => (value === null ? "" : value)),
    createdAt: yup.date().required(),
    updatedAt: yup.date().required()
  });

  let [state, setState] = useReducer(
    (state, action) => {
      if (action.bulk) return action.value;
      let cloned = cloneDeep(state);
      set(cloned, action.key, action.value);
      return { ...state, ...cloned };
    },
    {
      userId: userState.user.id,
      shopId: -1,
      shop: {
        name: "",
        userId: userState.user.id
      },
      name: "",
      description: "",
      price: "0",
      unit: "VND",
      updatedAt: new Date(),
      createdAt: new Date()
    }
  );

  let [shops, setShops] = useState([]);

  const setWrapper = key => e => setState({ key, value: e.target.value });

  const remove = id => {
    let name = prompt("Type the service name to confirm", "");
    let confirmed = name === state.name;
    if (confirmed) {
      api.delete(`${API.SERVICES}/${id}`).then(res => {
        history.push("/services");
      });
    } else {
      alert("Mismatched name, cancelling...");
    }
  };

  useEffect(() => {
    api.get(API.SHOPS, { params: { userId: userState.user.id } }).then(res => {
      setShops(res.data);
    });
    if (id) {
      api.get(`${API.SERVICES}/${id}`).then(async res => {
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
        to={"/services"}
        style={{ transition: "color 0.2s ease-in-out" }}
        className="flex items-center text-gray-600 hover:text-gray-700 w-mc mb-8"
      >
        <ChevronLeft></ChevronLeft>
        <span className="ml-1 text-lg">Back to service list</span>
      </Link>
      <h1 className="text-2xl text-gray-700">
        {id ? `Service - ${state.name}` : "New service"}
      </h1>
      <div className="bg-gray-400 mb-8 mt-2 h-px"></div>
      <Form
        onSubmit={async () => {
          if (state.shopId === -1 && state.shop.name === "") {
            alert("Please choose a shop or create a new shop.");
            return;
          }
          if (id) {
            await api.put(`${API.SERVICES}/${id}`, state).then(res => {});
          } else {
            await api
              .post(API.SERVICES, {
                ...state,
                shop: state.shopId !== -1 ? undefined : state.shop
              })
              .then(res => {});
          }
          history.push("/services");
        }}
        className="flex flex-col"
      >
        <div className="flex">
          <div className="w-1/3 pr-2">
            <h2 className="text-xl text-gray-800">Basics</h2>
            <p className="text-sm text-gray-600 mt-3">
              Some basic settings to get stared with. These information will be
              shown publicly to users.
            </p>
          </div>
          <div className="w-2/3 pl-2">
            <div className="flex flex-col">
              <label className="mb-2 text-gray-800" htmlFor="state-name">
                Name
              </label>
              <input
                id="state-name"
                style={{ transition: "all 0.2s ease-in-out" }}
                className="rounded bg-white outline-none border border-gray-300 focus:border-gray-500 px-3 py-2 text-base"
                type="text"
                required
                value={state.name}
                onChange={setWrapper("name")}
              />
            </div>
            <div className="flex flex-col mt-6">
              <label className="mb-2 text-gray-800" htmlFor="state-description">
                Description
              </label>
              <textarea
                style={{ transition: "all 0.2s ease-in-out" }}
                className="rounded bg-white outline-none border border-gray-300 focus:border-gray-500 px-3 py-2 text-base"
                name=""
                id="state-description"
                cols="30"
                rows="10"
                value={state.description}
                onChange={setWrapper("description")}
              ></textarea>
            </div>
            <div className="flex flex-col mt-6">
              <label className="mb-2 text-gray-800" htmlFor="state-price">
                Price
              </label>
              <input
                id="state-price"
                style={{ transition: "all 0.2s ease-in-out" }}
                className="rounded bg-white outline-none border border-gray-300 focus:border-gray-500 px-3 py-2 text-base"
                type="number"
                min="0"
                required
                value={state.price}
                onChange={setWrapper("price")}
              />
            </div>
            <div className="flex flex-col mt-6">
              <label className="mb-2 text-gray-800" htmlFor="state-unit">
                Unit
              </label>
              <input
                id="state-unit"
                style={{ transition: "all 0.2s ease-in-out" }}
                className="rounded bg-white outline-none border border-gray-300 focus:border-gray-500 px-3 py-2 text-base"
                type="text"
                required
                value="VND"
                onChange={setWrapper("unit")}
              />
            </div>
          </div>
        </div>
        <div className="bg-gray-400 my-8 h-px"></div>
        <Row>
          <SectionName
            subHeading={
              id ? (
                "Where has this service been used?"
              ) : (
                <>
                  Create a shop on-the-fly that will have this service, all you
                  need is just the shop's name.
                  <br />
                  Or you could choose existing shop in the list.
                </>
              )
            }
          >
            Reference
          </SectionName>
          <SectionContent>
            {!id ? (
              <>
                <InputGroup
                  supportingText={"Provide the new shop's name..."}
                  name="service"
                  label="Shop"
                  htmlFor="shop-name"
                  value={state.shop.name}
                  onChange={setWrapper("shop.name")}
                ></InputGroup>
                <p className="mt-6 mb-4 text-gray-700 text-sm">
                  ...or choose from list:
                </p>
                <List
                  name="service-choose-shop"
                  currentlySelected={state.shopId}
                  items={shops.map(s => ({ id: s.id, display: () => s.name }))}
                  onClick={s => {
                    setState({
                      key: "shop.id",
                      value: state.shopId === s.id ? -1 : s.id
                    });
                    setState({
                      key: "shopId",
                      value: state.shopId === s.id ? -1 : s.id
                    });
                  }}
                ></List>
              </>
            ) : state.shop.id !== -1 ? (
              <>
                <p className="text-gray-800">
                  This service belongs to shop {state.shop.name}
                </p>
              </>
            ) : (
              "unsed"
            )}
          </SectionContent>
        </Row>
        <div className="bg-gray-400 my-8 h-px"></div>
        <div className="flex">
          <div className="w-1/3 pr-2">
            <h2 className="text-xl text-gray-800">Metadata</h2>
            <p className="text-sm text-gray-600 mt-3">Miscellaneous.</p>
          </div>
          <div className="w-2/3 pl-2">
            <div className="flex flex-col">
              <label className="mb-2 text-gray-800" htmlFor="state-updated-at">
                Updated at
              </label>
              <input
                readOnly
                id="state-updated-at"
                className="rounded bg-gray-200 outline-none border border-gray-300 px-3 py-2 text-base"
                value={format(state.updatedAt, "hh:mm:ss dd/MM/yyyy")}
                type="text"
              />
            </div>
            <div className="flex flex-col mt-6">
              <label className="mb-2 text-gray-800" htmlFor="state-created-at">
                Created at
              </label>
              <input
                readOnly
                id="state-created-at"
                className="rounded bg-gray-200 outline-none border border-gray-300 px-3 py-2 text-base"
                value={format(state.createdAt, "hh:mm:ss dd/MM/yyyy")}
                type="text"
              />
            </div>
          </div>
        </div>
        <div className="bg-gray-400 my-8 h-px"></div>
        {id && (
          <>
            <div className="flex">
              <div className="w-1/3 pr-2">
                <h2 className="text-xl text-gray-800">Dangerous</h2>
                <p className="text-sm text-gray-600 mt-3">
                  Remove this service from the system. This action cannnot be
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
