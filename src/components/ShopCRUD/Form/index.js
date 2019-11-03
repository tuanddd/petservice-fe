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

export default props => {
  let { userState } = useContext(UserContext);
  let { id } = useParams();
  let history = useHistory();

  const schema = yup.object().shape({
    id: id ? yup.number().required() : yup.number(),
    userId: yup.number().required(),
    name: yup.string(),
    description: yup
      .string()
      .transform((value, original) => (value === null ? "" : value)),
    lat: yup.string().default(""),
    long: yup.string().default(""),
    createdAt: yup.date().required(),
    updatedAt: yup.date().required(),
    status: yup.number().required()
  });
  let [shop, setShop] = useReducer(
    (state, action) => {
      if (action.bulk) return action.value;
      return { ...state, [action.key]: action.value };
    },
    {
      userId: userState.user.role.name === ROLES.ADMIN ? "" : userState.user.id,
      name: "",
      description: "",
      image: DEFAULT_SHOP_ICON,
      status: 1,
      lat: "",
      long: "",
      updatedAt: new Date(),
      createdAt: new Date()
    }
  );

  const setWrapper = key => e => setShop({ key, value: e.target.value });

  const remove = id => {
    let name = prompt("Type the shop name to confirm", "");
    let confirmed = name === shop.name;
    if (confirmed) {
      api.delete(`${API.SHOPS}/${id}`).then(res => {
        history.push("/shops");
      });
    } else {
      alert("Mismatched name, cancelling...");
    }
  };

  useEffect(() => {
    if (id) {
      api.get(`${API.SHOPS}/${id}`).then(async res => {
        try {
          let casted = schema.cast(res.data);
          let valid = await schema.isValid(casted);
          if (valid) {
            setShop({ bulk: true, value: casted });
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
        to={"/shops"}
        style={{ transition: "color 0.2s ease-in-out" }}
        className="flex items-center text-gray-600 hover:text-gray-700 w-mc mb-8"
      >
        <ChevronLeft></ChevronLeft>
        <span className="ml-1 text-lg">Back to shop list</span>
      </Link>
      <h1 className="text-2xl text-gray-700">
        {id ? `Shop - ${shop.name}` : "New shop"}
      </h1>
      <div className="bg-gray-400 mb-8 mt-2 h-px"></div>
      <Form
        onSubmit={() => {
          if (id) {
            api.put(`${API.SHOPS}/${id}`, shop).then(res => {
              history.push("/shops");
            });
          } else {
            api.post(API.SHOPS, shop).then(res => {
              history.push("/shops");
            });
          }
        }}
        className="flex flex-col"
      >
        {userState.user.role.name === ROLES.ADMIN && (
          <>
            <Row>
              <SectionName subHeading="This section is for admin only.">
                Admin
              </SectionName>
              <SectionContent
                name="shop"
                inputGroups={[
                  {
                    label: "User Id",
                    htmlFor: "user-id",
                    value: shop.userId,
                    onChange: setWrapper("userId"),
                    inputProps: {
                      required: true,
                      readOnly: !!id
                    }
                  },
                  {
                    label: "Status",
                    htmlFor: "status",
                    custom: () => {
                      return (
                        <Dropdown
                          name="shop-status"
                          onClick={opt =>
                            setShop({ key: "status", value: opt.value })
                          }
                          options={[
                            {
                              name: "Inactive",
                              value: 1,
                              isSelected: true
                            },
                            {
                              name: "Active",
                              value: 2,
                              isSelected: false
                            }
                          ].map(opt => ({
                            ...opt,
                            isSelected: opt.value === shop.status
                          }))}
                        ></Dropdown>
                      );
                    }
                  }
                ]}
              ></SectionContent>
            </Row>
            <Divider></Divider>
          </>
        )}

        <Row>
          <SectionName
            subHeading={
              "Some basic settings to get stared with. These information will be shown publicly to users."
            }
          >
            Basics
          </SectionName>
          <SectionContent
            name="shop"
            inputGroups={[
              {
                label: "Name",
                htmlFor: "name",
                value: shop.name,
                onChange: setWrapper("name"),
                inputProps: {
                  required: true
                }
              },
              {
                type: "textarea",
                label: "Description",
                htmlFor: "description",
                value: shop.description,
                onChange: setWrapper("description")
              }
            ]}
          >
            <div className="flex flex-col mt-6">
              <p className="text-gray-800 mb-2">Image</p>

              <img src={shop.image} alt="shop icon" className="w-1/2" />
              <div className="mt-6 flex flex-wrap items-start -mx-3">
                <div className="mx-3">
                  <Button type="button" className="">
                    Upload
                  </Button>
                </div>
                <div className="mx-3">
                  <Button
                    type="button"
                    onClick={() =>
                      setShop({ key: "image", value: DEFAULT_SHOP_ICON })
                    }
                  >
                    Use default
                  </Button>
                </div>
              </div>
            </div>
          </SectionContent>
        </Row>
        <Divider></Divider>
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/3 md:pr-2">
            <h2 className="text-xl text-gray-800">Geolocation</h2>
            <p className="text-sm text-gray-600 mt-3">
              Location info of your shop.
            </p>
          </div>
          <div className="w-full md:w-2/3 md:pl-2 mt-6 md:mt-0">
            <div className="flex justify-between">
              <div className="flex flex-col flex-1 pr-3">
                <label className="mb-2 text-gray-800" htmlFor="shop-lat">
                  Latitude
                </label>
                <input
                  id="shop-lat"
                  style={{ transition: "all 0.2s ease-in-out" }}
                  className="rounded bg-white outline-none border border-gray-300 focus:border-gray-500 px-3 py-2 text-base"
                  type="text"
                  value={shop.lat}
                  onChange={setWrapper("lat")}
                />
              </div>
              <div className="flex flex-col flex-1 pl-3">
                <label className="mb-2 text-gray-800" htmlFor="shop-long">
                  Longtitude
                </label>
                <input
                  id="shop-long"
                  style={{ transition: "all 0.2s ease-in-out" }}
                  className="rounded bg-white outline-none border border-gray-300 focus:border-gray-500 px-3 py-2 text-base"
                  type="text"
                  value={shop.long}
                  onChange={setWrapper("long")}
                />
              </div>
            </div>
          </div>
        </div>
        <Divider></Divider>
        <Row>
          <SectionName subHeading={"Miscellaneous."}>Metadata</SectionName>
          <SectionContent
            name="shop"
            inputGroups={[
              {
                label: "Updated at",
                htmlFor: "update-at",
                value: format(shop.updatedAt, "hh:mm:ss dd/MM/yyyy"),
                inputProps: {
                  readOnly: true
                }
              },
              {
                label: "Created at",
                htmlFor: "created-at",
                value: format(shop.createdAt, "hh:mm:ss dd/MM/yyyy"),
                inputProps: {
                  readOnly: true
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
                  Remove this shop from the system. This action cannnot be undo.
                </p>
              </div>
              <div className="w-2/3 pl-2">
                <Button onClick={() => remove(shop.id)} type="button">
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
