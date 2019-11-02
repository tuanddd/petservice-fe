import React, { useEffect, useRef } from "react";

export const useSVG = SVG => {
  return props => {
    let ref = useRef();
    useEffect(() => {
      if (ref.current) {
        let bbox = ref.current.getBBox();
        let viewBox = [bbox.x, bbox.y, bbox.width, bbox.height].join(", ");
        ref.current.setAttribute("viewBox", viewBox);
      }
    }, [ref]);
    return <SVG {...props} ref={ref}></SVG>;
  };
};
