import React from "react";
import SingleProductDetail from "../components/SingleProduct/SingleProduct";

const singleProductIndex = ({ searchParams }) => {
  return (
    <div>
      <SingleProductDetail data={searchParams} />
    </div>
  );
};

export default singleProductIndex;
