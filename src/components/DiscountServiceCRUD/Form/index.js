import React, {
  useReducer,
  useMemo,
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
import { ChevronLeft } from "react-feather";
import Form, {
  Row,
  SectionName,
  SectionContent,
  Divider
} from "@components/Form";
import List from "@components/List";
import { clamp } from "lodash";

export default props => {
  let { userState } = useContext(UserContext);
  let { id } = useParams();
  let history = useHistory();

  const schema = yup.object().shape({
    id: yup.number().required(),
    shopId: yup.number().required(),
    shopDiscountId: yup.number().required(),
    shopServiceId: yup.number().required(),
    createdAt: yup.date().required(),
    updatedAt: yup.date().required()
  });
  let [state, setState] = useReducer(
    (state, action) => {
      if (action.bulk) return action.value;
      return { ...state, [action.key]: action.value };
    },
    {
      shopId: -1,
      shopDiscountId: -1,
      shopServiceId: -1,
      updatedAt: new Date(),
      createdAt: new Date()
    }
  );

  let [shops, setShops] = useState([]);

  let [servicesAndDiscounts, setServicesAndDiscounts] = useState({
    services: [],
    discounts: []
  });

  const setWrapper = key => e => setShop({ key, value: e.target.value });

  const remove = id => {
    let confirmed = confirm("Are you sure you want to remove this?");
    if (confirmed) {
      api.delete(`${API.SHOP_DISCOUNT_SERVICES}/${id}`).then(res => {
        history.push("/shop-discount-services");
      });
    } else {
      alert("Cancelling...");
    }
  };

  useEffect(() => {
    api.get(API.SHOPS).then(res => setShops(res.data));
    if (id) {
      api.get(`${API.SHOP_DISCOUNT_SERVICES}/${id}`).then(async res => {
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

  useEffect(() => {
    if (state.shopId === -1) {
      setServicesAndDiscounts({ services: [], discounts: [] });
    } else {
      api
        .get(API.GET_UNAPPLIED_BY_SHOP_ID, { params: { shopId: state.shopId } })
        .then(res => {
          setServicesAndDiscounts({
            services: res.data.services.map(({ shop_service }) => ({
              ...shop_service
            })),
            discounts: res.data.discounts.map(({ shop_discount }) => ({
              ...shop_discount
            }))
          });
        });
    }
  }, [state]);

  let service = useMemo(() => {
    return servicesAndDiscounts.services.find(
      s => s.id === state.shopServiceId
    );
  }, [state.shopServiceId]);

  let discount = useMemo(() => {
    return servicesAndDiscounts.discounts.find(
      d => d.id === state.shopDiscountId
    );
  }, [state.shopDiscountId]);

  return (
    <div className="flex flex-col mx-6 my-4 flex-1 h-mc">
      <Link
        to={"/shop-discount-services"}
        style={{ transition: "color 0.2s ease-in-out" }}
        className="flex items-center text-gray-600 hover:text-gray-700 w-mc mb-8"
      >
        <ChevronLeft></ChevronLeft>
        <span className="ml-1 text-lg">Back to list</span>
      </Link>
      <h1 className="text-2xl text-gray-700">
        {id ? `Applied discount service` : "Apply new"}
      </h1>
      <div className="bg-gray-400 mb-8 mt-2 h-px"></div>
      <Form
        onSubmit={() => {
          if (id) {
          } else {
            api.post(API.SHOP_DISCOUNT_SERVICES, state).then(res => {
              history.push("/shop-discount-services");
            });
          }
        }}
        className="flex flex-col"
      >
        <Row>
          <SectionName subHeading={!id && "Select one shop from list..."}>
            Shop
          </SectionName>
          <SectionContent>
            {!id ? (
              <div className="flex flex-col">
                <p className="text-gray-800 mb-2">Your shops:</p>
                <List
                  currentlySelected={state.shopId}
                  items={shops.map(s => ({ id: s.id, display: () => s.name }))}
                  name="apply-shop"
                  onClick={s =>
                    setState({
                      bulk: true,
                      value: {
                        ...state,
                        shopId: state.shopId === s.id ? -1 : s.id,
                        shopDiscountId:
                          state.shopId === s.id ? -1 : state.shopDiscountId,
                        shopServiceId:
                          state.shopId === s.id ? -1 : state.shopServiceId
                      }
                    })
                  }
                ></List>
              </div>
            ) : (
              <p className="text-gray-800 mb-2">
                {state.shop && state.shop.name}
              </p>
            )}
          </SectionContent>
        </Row>
        <Divider></Divider>
        <Row>
          <SectionName
            subHeading={!id && "...then choose discount and service pair."}
          >
            Discount &amp; Service
          </SectionName>
          <SectionContent>
            <div className="flex justify-between">
              <div className="w-2/5 flex flex-col">
                {!id ? (
                  <>
                    <p className="text-gray-800 mb-2">Your services:</p>
                    <List
                      currentlySelected={state.shopServiceId}
                      items={servicesAndDiscounts.services.map(s => ({
                        id: s.id,
                        display: () => s.name
                      }))}
                      name="apply-service"
                      onClick={s =>
                        setState({
                          key: "shopServiceId",
                          value: state.shopServiceId === s.id ? -1 : s.id
                        })
                      }
                    ></List>
                  </>
                ) : (
                  <p className="text-gray-800 mb-2">
                    {state.shop_service && state.shop_service.name}
                  </p>
                )}
              </div>
              <div className="w-2/5 flex flex-col">
                {!id ? (
                  <>
                    <p className="text-gray-800 mb-2">Your discounts:</p>
                    <List
                      currentlySelected={state.shopDiscountId}
                      items={servicesAndDiscounts.discounts.map(d => ({
                        id: d.id,
                        display: () => d.code
                      }))}
                      name="apply-discount"
                      onClick={d =>
                        setState({
                          key: "shopDiscountId",
                          value: state.shopDiscountId === d.id ? -1 : d.id
                        })
                      }
                    ></List>
                  </>
                ) : (
                  <p className="text-gray-800 mb-2">
                    {state.shop_discount && state.shop_discount.code}
                  </p>
                )}
              </div>
            </div>
            {service && discount && (
              <div className="mt-6">
                <h1 className="text-gray-800">Final result:</h1>
                <p className="text-gray-800">
                  Service {service.name} has a price of {service.price} when
                  applied with code {discount.code} ({discount.value}
                  {discount.type === 1 ? "%" : " - raw value"}) will be
                </p>
                <div className="mt-5 text-xl rounded shadow bg-gray-200 text-gray-800 p-4 border border-indigo-800">
                  {discount.type === 1
                    ? `${service.price} - (${service.price} x ${
                        discount.value
                      }%) = ${service.price} - ${parseInt(service.price) *
                        (parseInt(discount.value) / 100)} = ${service.price -
                        parseInt(service.price) *
                          (parseInt(discount.value) / 100)}`
                    : `${service.price} - ${discount.value} = ${clamp(
                        service.price - discount.value,
                        0,
                        Infinity
                      )}`}
                </div>
              </div>
            )}
          </SectionContent>
        </Row>
        <Divider></Divider>
        <Row>
          <SectionName subHeading={"Miscellaneous."}>Metadata</SectionName>
          <SectionContent
            name="shop"
            inputGroups={[
              {
                label: "Updated at",
                htmlFor: "update-at",
                value: format(state.updatedAt, "hh:mm:ss dd/MM/yyyy"),
                inputProps: {
                  readOnly: true
                }
              },
              {
                label: "Created at",
                htmlFor: "created-at",
                value: format(state.createdAt, "hh:mm:ss dd/MM/yyyy"),
                inputProps: {
                  readOnly: true
                }
              }
            ]}
          ></SectionContent>
        </Row>
        {id && (
          <>
            <Divider></Divider>
            <div className="flex">
              <div className="w-1/3 pr-2">
                <h2 className="text-xl text-gray-800">Dangerous Zone</h2>
                <p className="text-sm text-gray-600 mt-3">
                  Remove this shop from the system. This action cannnot be undo.
                </p>
              </div>
              <div className="w-2/3 pl-2">
                <Button onClick={() => remove(state.id)} type="button">
                  Delete
                </Button>
              </div>
            </div>
          </>
        )}

        {!id && (
          <>
            <Divider></Divider>
            <div className="w-mc self-end">
              <Button
                disabled={
                  state.shopId === -1 ||
                  state.shopDiscountId === -1 ||
                  state.shopServiceId === -1
                }
                type="submit"
              >
                Create
              </Button>
            </div>
          </>
        )}
      </Form>
    </div>
  );
};
