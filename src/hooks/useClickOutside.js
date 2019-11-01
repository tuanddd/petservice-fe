import { useState, useEffect, useRef } from "react";

export const useClickOutside = (config = { defaultVal: true }) => {
  let [outside, setOutside] = useState(config.defaultVal);
  let ref = useRef();

  useEffect(() => {
    const onClick = e => {
      setOutside(!ref.current.contains(e.target));
    };

    document.body.addEventListener("click", onClick);

    return () => document.body.removeEventListener("click", onClick);
  }, []);
  return { isOutside: outside, ref };
};
