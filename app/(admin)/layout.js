import React from "react";
import MainLayoutComp from "@/app/components/MainLayoutComp/MainLayoutComp";
import ProgressBarRouting from "@/app/components/ProgressBarRouting/ProgressBarRouting";

export default function AdminLayout({ children }) {
  return (
    <>
      <ProgressBarRouting />
      <MainLayoutComp>{children}</MainLayoutComp>
    </>
  );
}
