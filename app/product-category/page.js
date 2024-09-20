import React from "react";
import ProductsCategory from "../components/ProductsCategory/ProductsCategory";
import HeadContent from "../components/HeadContent/HeadContent";

const ProductsIndex = ({ searchParams }) => {
  return (
    <div className="middle_content">
      <HeadContent data={searchParams} />
      <ProductsCategory data={searchParams} />
    </div>
  );
};

export default ProductsIndex;
