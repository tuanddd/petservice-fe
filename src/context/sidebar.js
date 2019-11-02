import React, { createContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ShopList from "@components/ShopCRUD/List";
import ShopForm from "@components/ShopCRUD/Form";
import ServiceList from "@components/ServiceCRUD/List";
import ServiceForm from "@components/ServiceCRUD/Form";
import DiscountList from "@components/DiscountCRUD/List";
import DiscountForm from "@components/DiscountCRUD/Form";
import LinkDiscountsWithServices from "@components/LinkDiscountsWithServices";

const initialState = [
  {
    id: 1,
    route: "/shops",
    isMatched: true,
    Link: props => (
      <Link {...props} to="/shops">
        Shops
      </Link>
    ),
    Component: ShopList
  },
  {
    id: 2,
    route: "/services",
    isMatched: false,
    Link: props => (
      <Link {...props} to="/services">
        Services
      </Link>
    ),
    Component: ServiceList
  },
  {
    id: 3,
    route: "/discounts",
    isMatched: false,
    Link: props => (
      <Link {...props} to="/discounts">
        Discounts
      </Link>
    ),
    Component: DiscountList
  },
  {
    id: 4,
    route: "/link-discounts-with-services",
    isMatched: false,
    Link: props => (
      <Link {...props} to="/link-discounts-with-services">
        Link
      </Link>
    ),
    Component: LinkDiscountsWithServices
  },
  {
    id: 5,
    route: "/shops/new",
    isMatched: false,
    Link: () => null,
    Component: ShopForm
  },
  {
    id: 6,
    route: "/shops/:id/edit",
    isMatched: false,
    Link: () => null,
    Component: ShopForm
  },
  {
    id: 7,
    route: "/services/new",
    isMatched: false,
    Link: () => null,
    Component: ServiceForm
  },
  {
    id: 8,
    route: "/services/:id/edit",
    isMatched: false,
    Link: () => null,
    Component: ServiceForm
  },
  {
    id: 9,
    route: "/discounts/new",
    isMatched: false,
    Link: () => null,
    Component: DiscountForm
  },
  {
    id: 10,
    route: "/discounts/:id/edit",
    isMatched: false,
    Link: () => null,
    Component: DiscountForm
  }
];

export const SidebarContext = createContext();

export default ({ children, ...props }) => {
  let [sidebarState, setSidebarState] = useState(initialState);

  useEffect(() => {
    let { pathname } = window.location;

    setSidebarState(old => {
      let newState = old.map(s => ({ ...s, isMatched: s.route === pathname }));
      return newState.some(s => s.isMatched)
        ? newState
        : newState.map((s, i) => ({ ...s, isMatched: i === 0 }));
    });
  }, []);
  return (
    <SidebarContext.Provider value={{ sidebarState, setSidebarState }}>
      {children}
    </SidebarContext.Provider>
  );
};
