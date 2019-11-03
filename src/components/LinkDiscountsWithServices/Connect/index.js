import React, { useState, useEffect } from "react";
import api from "@api";
import { API } from "@api-urls";
import List from "@components/List";
import { animated } from "react-spring";
import Back from "../Back";
import Button from "@components/Button";
import { difference } from "lodash";

export default ({ data, style, previousStep, ...props }) => {
  let [discounts, setDiscounts] = useState([]);
  let [services, setServices] = useState([]);
  let { shopId } = data.find(s => s.step === 3).data;

  const getShopServicesAndDiscounts = () => {
    api.get(`${API.SHOPS}/${shopId}`).then(res => {
      let used = res.data.shopDiscountServices.map(sds => ({
        sId: sds.shopServiceId,
        dId: sds.shopDiscountId
      }));
      let allowedDiscounts = difference(
        res.data.shop_discounts.map(sd => sd.id),
        used.map(u => u.dId)
      );
      let allowedServices = difference(
        res.data.shop_services.map(ss => ss.id),
        used.map(u => u.sId)
      );
      setDiscounts(
        res.data.shop_discounts
          .filter(sd => allowedDiscounts.indexOf(sd.id) !== -1)
          .map(sd => ({ ...sd, isSelected: false }))
      );
      setServices(
        res.data.shop_services
          .filter(ss => allowedServices.indexOf(ss.id) !== -1)
          .map(ss => ({ ...ss, isSelected: false }))
      );
    });
  };

  useEffect(getShopServicesAndDiscounts, []);
  let discountId = discounts.find(d => d.isSelected);
  let serviceId = services.find(s => s.isSelected);
  return (
    <animated.div style={style} className="absolute top-0 left-0 w-full h-full">
      <div className="relative w-full h-full flex">
        <div style={{ top: 20, left: 20 }} className="absolute">
          <Back type="div" onClick={previousStep}>
            Back
          </Back>
        </div>
        <div className="flex flex-1 items-center p-10">
          <div className="flex flex-1 flex-wrap justify-around">
            <div className="w-full flex flex-col items-center mb-12">
              <h1 className="text-3xl text-gray-800 mb-6">
                Select the discount and service you want to link, then click
                Connect.
              </h1>

              <Button
                onClick={() => {
                  if (discountId === undefined || serviceId === undefined)
                    return;

                  api
                    .post(API.SHOP_DISCOUNT_SERVICES, {
                      shopId,
                      shopDiscountId: discountId.id,
                      shopServiceId: serviceId.id
                    })
                    .then(res => {
                      getShopServicesAndDiscounts();
                    });
                }}
                disabled={discountId === undefined || serviceId === undefined}
              >
                Connect
              </Button>
            </div>
            <div className="w-2/5">
              <List
                name="discounts"
                currentlySelected={
                  discounts.some(d => d.isSelected)
                    ? discounts.find(d => d.isSelected).id
                    : -1
                }
                onClick={d => {
                  setDiscounts(old =>
                    old.map(od => ({
                      ...od,
                      isSelected: od.id === d.id ? !od.isSelected : false
                    }))
                  );
                }}
                items={discounts.map(d => ({
                  id: d.id,
                  display: () => d.code
                }))}
              ></List>
            </div>
            <div className="w-2/5">
              <List
                name="services"
                currentlySelected={
                  services.some(s => s.isSelected)
                    ? services.find(s => s.isSelected).id
                    : -1
                }
                onClick={s => {
                  setServices(old =>
                    old.map(os => ({
                      ...os,
                      isSelected: os.id === s.id ? !os.isSelected : false
                    }))
                  );
                }}
                items={services.map(s => ({ id: s.id, display: () => s.name }))}
              ></List>
            </div>
          </div>
        </div>
      </div>
    </animated.div>
  );
};
