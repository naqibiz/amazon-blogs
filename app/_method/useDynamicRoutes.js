"use client";
import React from "react";
import { RxDashboard } from "react-icons/rx";
import { MdAltRoute } from "react-icons/md";
import { MdOutlineCategory } from "react-icons/md";
import { MdProductionQuantityLimits } from "react-icons/md";
import { MdOutlineContacts } from "react-icons/md";
import { MdOutlineSubscriptions } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";

export default function useDynamicRoutes(pathname) {
  const sidebarNavigation = [
    {
      id: 1,
      name: "Dashboard",
      route: "/panel/dashboard",
      icon: <RxDashboard color="#fff" size={18} />,
    },
    {
      id: 2,
      name: "Navigations",
      route: "/panel/navigations",
      icon: <MdAltRoute color="#fff" size={18} />,
    },
    {
      id: 3,
      name: "Categories",
      route: "/panel/categories",
      icon: <MdOutlineCategory color="#fff" size={18} />,
    },
    {
      id: 4,
      name: "Products",
      route: "/panel/products",
      icon: <MdProductionQuantityLimits color="#fff" size={18} />,
    },
    {
      id: 5,
      name: "Banner Setting",
      route: "/panel/banner-setting",
      icon: <IoSettingsOutline color="#fff" size={19} />,
    },
    {
      id: 6,
      name: "Contact",
      route: "/panel/contacts",
      icon: <MdOutlineContacts color="#fff" size={18} />,
    },
    {
      id: 7,
      name: "Subscription",
      route: "/panel/subscription",
      icon: <MdOutlineSubscriptions color="#fff" size={18} />,
    },
  ];
  return [sidebarNavigation];
}
