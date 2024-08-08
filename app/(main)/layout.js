import React from "react";
import MainLayoutComp from "../components/MainLayoutComp/MainLayoutComp";

export default function MainLayout({ children }) {
  return (
    <>
      <MainLayoutComp>{children}</MainLayoutComp>
    </>
  );
}
