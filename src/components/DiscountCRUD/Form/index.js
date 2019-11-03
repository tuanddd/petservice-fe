import React, { useReducer, useState, useEffect, useContext } from "react";
import api from "@api";
import { API } from "@api-urls";
import Button from "@components/Button";
import { UserContext } from "@context/user";
import { useParams, useHistory, Link } from "react-router-dom";
import * as yup from "yup";
import { format, addDays } from "date-fns";
import randomstring from "randomstring";
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
    code: yup.string().required(),
    value: yup
      .string()
      .required()
      .default("0"),
    unit: yup
      .string()
      .required()
      .default("VND"),
    status: yup
      .number()
      .required()
      .default(1),
    validFrom: yup
      .date()
      .required()
      .default(new Date()),
    validUntil: yup.date().default(addDays(new Date(), 5)),
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
      code: randomstring.generate({ capitalization: true, length: 5 }),
      value: "0",
      unit: "VND",
      status: 1,
      validFrom: new Date(),
      validUntil: addDays(new Date(), 5),
      updatedAt: new Date(),
      createdAt: new Date()
    }
  );

  let [shops, setShops] = useState([]);

  const setWrapper = key => e => setState({ key, value: e.target.value });

  const remove = id => {
    let code = prompt("Type the discount code to confirm", "");
    let confirmed = code === state.code;
    if (confirmed) {
      api.delete(`${API.DISCOUNTS}/${id}`).then(res => {
        history.push("/discounts");
      });
    } else {
      alert("Mismatched name, cancelling...");
    }
  };

  useEffect(() => {
    api
      .get(API.SHOPS, { params: { userId: userState.user.id } })
      .then(res => setShops(res.data));
    if (id) {
      api.get(`${API.DISCOUNTS}/${id}`).then(async res => {
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
        to={"/discounts"}
        style={{ transition: "color 0.2s ease-in-out" }}
        className="flex items-center text-gray-600 hover:text-gray-700 w-mc mb-8"
      >
        <ChevronLeft></ChevronLeft>
        <span className="ml-1 text-lg">Back to discount list</span>
      </Link>
      <h1 className="text-2xl text-gray-700">
        {id ? `Discount - ${state.code}` : "New discount"}
      </h1>
      <div className="bg-gray-400 mb-8 mt-2 h-px"></div>
      <Form
        onSubmit={async () => {
          if (state.shopId === -1 && state.shop.name === "") {
            alert("Please choose a shop or provide shop name.");
            return;
          }
          if (id) {
            await api.put(`${API.DISCOUNTS}/${id}`, state).then(res => {});
          } else {
            await api
              .post(API.DISCOUNTS, {
                ...state,
                shop: state.shopId !== -1 ? undefined : state.shop
              })
              .then(res => {});
          }
          history.push("/discounts");
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
              <label className="mb-2 text-gray-800" htmlFor="state-code">
                Code
              </label>
              <input
                id="state-code"
                className="rounded bg-white outline-none border border-gray-300 px-3 py-2 text-base"
                type="text"
                required
                value={state.code}
                onChange={setWrapper("code")}
              />
            </div>
            <div className="flex flex-col mt-6">
              <label className="mb-2 text-gray-800" htmlFor="state-value">
                Value
              </label>
              <input
                id="state-value"
                className="rounded bg-white outline-none border border-gray-300 px-3 py-2 text-base"
                type="number"
                min="0"
                required
                value={state.value}
                onChange={setWrapper("value")}
              />
            </div>
            <div className="flex flex-col mt-6">
              <label className="mb-2 text-gray-800" htmlFor="state-unit">
                Unit
              </label>
              <input
                id="state-unit"
                className="rounded bg-white outline-none border border-gray-300 px-3 py-2 text-base"
                type="text"
                required
                value={state.unit}
                value="VND"
                onChange={setWrapper("unit")}
              />
            </div>
            <div className="flex flex-col mt-6">
              <label className="mb-2 text-gray-800" htmlFor="state-valid-form">
                Valid from
              </label>
              <input
                id="state-valid-form"
                className="rounded bg-white outline-none border border-gray-300 px-3 py-2 text-base"
                type="text"
                required
                value={format(new Date(state.validFrom), "hh:mm:ss dd/MM/yyyy")}
                onChange={setWrapper("validFrom")}
              />
            </div>
            <div className="flex flex-col mt-6">
              <label className="mb-2 text-gray-800" htmlFor="state-valid-until">
                Valid to
              </label>
              <input
                id="state-valid-until"
                className="rounded bg-white outline-none border border-gray-300 px-3 py-2 text-base"
                type="text"
                required
                value={format(
                  addDays(new Date(state.validUntil), 5),
                  "hh:mm:ss dd/MM/yyyy"
                )}
                onChange={setWrapper("validUnitl")}
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
                  Create a shop on-the-fly that will have this discount, all you
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
                  name="discount"
                  label="Shop"
                  htmlFor="shop-name"
                  value={state.shop.name}
                  onChange={setWrapper("shop.name")}
                ></InputGroup>
                <p className="mt-6 mb-4 text-gray-700 text-sm">
                  ...or choose from list:
                </p>
                <List
                  name="discount-choose-shop"
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
                  This discount belongs to shop {state.shop.name}
                </p>
              </>
            ) : (
              "unsed"
            )}
          </SectionContent>
        </Row>
        {/* <div className="flex">
          <div className="w-1/3 pr-2">
            <h2 className="text-xl text-gray-800">Reference</h2>
            <p className="text-sm text-gray-600 mt-3">
              {id
                ? "Which shop has this discount?"
                : "Create a shop on-the-fly that will hold this dicount. All you need is just the shop's name."}
            </p>
          </div>
          <div className="w-2/3 pl-2">
            {!id ? (
              <div className="flex flex-col">
                <label className="mb-2 text-gray-800" htmlFor="state-shop-name">
                  Shop
                </label>
                <input
                  id="state-lat"
                  className="rounded bg-white outline-none border border-gray-300 px-3 py-2 text-base"
                  type="text"
                  value={state.shop.name}
                  required
                  onChange={setWrapper("shop.name")}
                />
              </div>
            ) : (
              <p className="text-base text-gray-800">
                This discount is unused in any shops.
              </p>
            )}
          </div>
        </div> */}
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
                  Remove this discount from the system. This action cannnot be
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
