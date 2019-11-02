import React, { useState } from "react";
import { animated } from "react-spring";
import Input from "@components/Input";
import Back from "../Back";
import api from "@api";
import { API } from "@api-urls";
import { Frown } from "react-feather";
import List from "@components/List";

export default ({ style, previousStep, nextStep, setData, ...props }) => {
  let [name, setName] = useState("");
  let [firstTime, setFirstTime] = useState(true);
  let [fetching, setFetching] = useState(false);
  let [result, setResult] = useState([]);
  return (
    <animated.div style={style} className="absolute top-0 left-0 w-full h-full">
      <div className="relative w-full h-full flex">
        <div style={{ top: 20, left: 20 }} className="absolute">
          <Back type="div" onClick={previousStep}>
            Back
          </Back>
        </div>
        <div className="flex flex-1 flex-col justify-center items-center">
          <h1 className="text-3xl text-gray-800 mb-4">
            What is your shop's name?
          </h1>
          <form
            onSubmit={e => {
              e.preventDefault();
              setFetching(true);
              api
                .get(API.SEARCH_SHOPS_BY_NAME, { params: { name } })
                .then(res => {
                  setFirstTime(false);
                  setFetching(false);
                  setResult(res.data);
                })
                .catch(() => setFetching(false));
            }}
          >
            <Input value={name} onChange={e => setName(e.target.value)}></Input>
          </form>
          {!firstTime && (
            <div
              className={`flex flex-col items-center ${
                fetching ? "invisible" : "visible"
              }`}
            >
              {result.length > 0 ? (
                <>
                  <h2 className="text-2xl text-gray-800 mt-10 mb-2 text-center">
                    Here's what we've found,
                    <br />
                    chose one to continue.
                  </h2>
                  <List
                    name="gather-shop-id"
                    style={{ width: "100%" }}
                    name="search-shops-result"
                    onClick={i => {
                      setData(old =>
                        old.map(s =>
                          s.step === 3 ? { ...s, data: { shopId: i.id } } : s
                        )
                      );
                      nextStep();
                    }}
                    items={result.map(s => ({
                      id: s.id,
                      display: () => s.name
                    }))}
                  ></List>
                </>
              ) : (
                <>
                  <h2 className="text-2xl text-gray-800 mt-4">
                    No shops found.
                  </h2>
                  <Frown></Frown>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </animated.div>
  );
};
