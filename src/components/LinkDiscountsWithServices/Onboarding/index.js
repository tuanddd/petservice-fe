import React from "react";
import illustration from "@images/Online_shopping_PNG.png";
import Blob from "@svgs/blob-shape.svg";
import Button from "@components/Button";
import { useSVG } from "@hocs/useSVG";
import { animated } from "react-spring";

export default ({ nextStep, style, ...props }) => {
  let EnhancedBlob = useSVG(Blob);
  return (
    <animated.div
      style={style}
      className="absolute top-0 left-0 max-h-full h-full flex justify-center items-center relative overflow-hidden"
    >
      <div className="relative h-full w-1/2 overflow-hidden flex justify-center items-center">
        <EnhancedBlob
          className="w-full absolute left-0"
          style={{
            top: "50%",
            transform: "translate(-50%, -50%) scale(2) rotate(-140deg)"
          }}
        ></EnhancedBlob>
        <img className="w-2/3 relative z-10" src={illustration} alt="" />
      </div>

      <div className="relative h-full w-1/2 flex flex-col justify-center pr-20">
        <h1 className="text-gray-800 text-3xl mb-6">
          Link services and discounts within your shop.
        </h1>
        <Button onClick={nextStep} style={{ width: "max-content" }}>
          Get started
        </Button>
      </div>
    </animated.div>
  );
};
