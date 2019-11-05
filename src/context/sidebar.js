import React, { createContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ShopList from "@components/ShopCRUD/List";
import ShopForm from "@components/ShopCRUD/Form";
import ServiceList from "@components/ServiceCRUD/List";
import ServiceForm from "@components/ServiceCRUD/Form";
import DiscountList from "@components/DiscountCRUD/List";
import DiscountForm from "@components/DiscountCRUD/Form";
import LinkDiscountsWithServices from "@components/LinkDiscountsWithServices";
import DiscountServiceList from "@components/DiscountServiceCRUD/List";
import DiscountServiceForm from "@components/DiscountServiceCRUD/Form";
import BreedList from "@components/BreedCRUD/List";
import BreedForm from "@components/BreedCRUD/Form";
import VirusList from "@components/VirusCRUD/List";
import VirusForm from "@components/VirusCRUD/Form";
import VaccineList from "@components/VaccineCRUD/List";
import VaccineForm from "@components/VaccineCRUD/Form";
import { ROLES } from "@const";

const initialState = [
  {
    route: "/shops",
    isMatched: true,
    showWhenRoles: [ROLES.SHOP_MANAGER, ROLES.ADMIN],
    Link: props => (
      <Link {...props} to="/shops">
        Shops
      </Link>
    ),
    Component: ShopList
  },
  {
    route: "/services",
    isMatched: false,
    showWhenRoles: [ROLES.SHOP_MANAGER],
    Link: props => (
      <Link {...props} to="/services">
        Services
      </Link>
    ),
    Component: ServiceList
  },
  {
    route: "/discounts",
    isMatched: false,
    showWhenRoles: [ROLES.SHOP_MANAGER],
    Link: props => (
      <Link {...props} to="/discounts">
        Discounts
      </Link>
    ),
    Component: DiscountList
  },
  {
    route: "/shop-discount-services",
    isMatched: false,
    showWhenRoles: [ROLES.SHOP_MANAGER],
    Link: props => (
      <Link {...props} to="/shop-discount-services">
        Link
      </Link>
    ),
    Component: DiscountServiceList
  },
  {
    route: "/shop-discount-services/new",
    isMatched: false,
    showWhenRoles: [ROLES.SHOP_MANAGER],
    Link: () => null,
    Component: DiscountServiceForm
  },
  {
    route: "/shop-discount-services/:id/edit",
    isMatched: false,
    showWhenRoles: [ROLES.SHOP_MANAGER],
    Link: () => null,
    Component: DiscountServiceForm
  },
  {
    route: "/shops/new",
    showWhenRoles: [ROLES.SHOP_MANAGER, ROLES.ADMIN],
    isMatched: false,
    Link: () => null,
    Component: ShopForm
  },
  {
    route: "/shops/:id/edit",
    isMatched: false,
    showWhenRoles: [ROLES.SHOP_MANAGER, ROLES.ADMIN],
    Link: () => null,
    Component: ShopForm
  },
  {
    route: "/services/new",
    showWhenRoles: [ROLES.SHOP_MANAGER],
    isMatched: false,
    Link: () => null,
    Component: ServiceForm
  },
  {
    route: "/services/:id/edit",
    isMatched: false,
    showWhenRoles: [ROLES.SHOP_MANAGER],
    Link: () => null,
    Component: ServiceForm
  },
  {
    route: "/discounts/new",
    isMatched: false,
    showWhenRoles: [ROLES.SHOP_MANAGER],
    Link: () => null,
    Component: DiscountForm
  },
  {
    route: "/discounts/:id/edit",
    isMatched: false,
    showWhenRoles: [ROLES.SHOP_MANAGER],
    Link: () => null,
    Component: DiscountForm
  },
  // {
  //   route: "/accounts",
  //   isMatched: false,
  //   showWhenRoles: [ROLES.ADMIN],
  //   Link: props => {
  //     return (
  //       <Link {...props} to="/accounts">
  //         Accounts
  //       </Link>
  //     );
  //   },
  //   Component: () => null
  // },
  {
    route: "/breeds",
    isMatched: false,
    showWhenRoles: [ROLES.ADMIN],
    Link: props => {
      return (
        <Link {...props} to="/breeds">
          Breeds
        </Link>
      );
    },
    Component: BreedList
  },
  {
    route: "/breeds/new",
    isMatched: false,
    showWhenRoles: [ROLES.ADMIN],
    Link: () => null,
    Component: BreedForm
  },
  {
    route: "/breeds/:id/edit",
    isMatched: false,
    showWhenRoles: [ROLES.ADMIN],
    Link: () => null,
    Component: BreedForm
  },
  {
    route: "/viruses",
    isMatched: false,
    showWhenRoles: [ROLES.ADMIN],
    Link: props => (
      <Link {...props} to="/viruses">
        Viruses
      </Link>
    ),
    Component: VirusList
  },
  {
    route: "/viruses/new",
    isMatched: false,
    showWhenRoles: [ROLES.ADMIN],
    Link: props => null,
    Component: VirusForm
  },
  {
    route: "/viruses/:id/edit",
    isMatched: false,
    showWhenRoles: [ROLES.ADMIN],
    Link: props => null,
    Component: VirusForm
  },
  {
    route: "/vaccines",
    isMatched: false,
    showWhenRoles: [ROLES.ADMIN],
    Link: props => (
      <Link {...props} to="/vaccines">
        Vaccines
      </Link>
    ),
    Component: VaccineList
  },
  {
    route: "/vaccines/new",
    isMatched: false,
    showWhenRoles: [ROLES.ADMIN],
    Link: props => null,
    Component: VaccineForm
  },
  {
    route: "/vaccines/:id/edit",
    isMatched: false,
    showWhenRoles: [ROLES.ADMIN],
    Link: props => null,
    Component: VaccineForm
  }
].map((s, i) => ({ ...s, id: i + 1 }));

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
