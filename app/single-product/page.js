import React from "react";
import SingleProductDetail from "../components/SingleProduct/SingleProduct";

const singleProductIndex = ({ searchParams }) => {
  return (
    <div className="middle_content">
      <SingleProductDetail data={searchParams} />
    </div>
  );
};

export default singleProductIndex;
