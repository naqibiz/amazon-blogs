import AddNewProduct from "@/app/components/PanelComponents/Products/AddNewProduct";
import React from "react";

const NewProductIndex = ({ searchParams }) => {
  return (
    <div>
      <AddNewProduct data={searchParams} />
    </div>
  );
};

export default NewProductIndex;
