import AddNewCategory from "@/app/components/PanelComponents/Categories/AddNewCategory";
import React from "react";

const NewCategoryIndex = ({ searchParams }) => {
  return (
    <div>
      <AddNewCategory data={searchParams} />
    </div>
  );
};

export default NewCategoryIndex;
