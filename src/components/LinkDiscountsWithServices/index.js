import React, {
  useState,
  useEffect,
  useReducer,
  useCallback,
  useRef
} from "react";
import { useTransition } from "react-spring";
import Onboarding from "./Onboarding";
import GatherShopId from "./GatherShopId";
import Connect from "./Connect";

const STEP = {
  DEFAULT: 1,
  MIN: 1,
  MAX: 4
};

export default props => {
  let first = useRef(true);
  let [step, setStep] = useReducer(
    (state, action) => {
      if (action.type === "next") {
        if (state.current === STEP.MAX) return state;
        return {
          current: state.current + 1,
          previous: state.current
        };
      } else if (action.type === "previous") {
        if (state.current === STEP.MIN) return state;
        return {
          current: state.current - 1,
          previous: state.current
        };
      }
    },
    {
      current: STEP.DEFAULT,
      previous: STEP.DEFAULT
    }
  );
  let transitions = useTransition(step.current, step.current, {
    from: {
      opacity: 0,
      transform: `translate3d(${
        first.current ? 0 : step.current > step.previous ? 100 : -100
      }%, 0, 0)`
    },
    enter: { opacity: 1, transform: `translate3d(0%, 0, 0)` },
    leave: {
      opacity: 0,
      transform: `translate3d(${
        step.current > step.previous ? -50 : 50
      }%, 0, 0)`
    }
  });
  let [data, setData] = useState([
    {
      step: 1,
      Component: Onboarding
    },
    {
      step: 2,
      Component: GatherShopId
    },
    {
      step: 3,
      Component: Connect,
      data: {
        shopId: -1
      }
    }
  ]);
  let nextStep = useCallback(() => setStep({ type: "next" }));
  let previousStep = useCallback(() => setStep({ type: "previous" }));

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
  }, []);
  return (
    <div className="w-full h-full relative bg-gray-100">
      {transitions.map(({ item, key, props }) => {
        let { Component } = data.find(d => d.step === item);
        return (
          <Component
            key={`link-discount-and-service-step-${key}`}
            style={props}
            nextStep={nextStep}
            previousStep={previousStep}
            data={data}
            setData={setData}
          ></Component>
        );
      })}
    </div>
  );
};
