"use client";
import Link from "next/link";
import React from "react";
import { BsCurrencyDollar } from "react-icons/bs";

const ProductCategoryBox = ({ data }) => {
  return (
    <div className="latest_product_grid">
      <Link
        href={{
          pathname: "/single-product",
          query: {
            id: data?.id,
            type: data?.categoryType,
          },
        }}
      >
        <div className="product_image">
          <img src={data?.imageUrls[0]?.url} alt="" />
        </div>
        <div className="product-content">
          <div className="sponsored_type">
            {data?.product_type === "Most Popular" && (
              <p className="sponsored">{data?.product_type}</p>
            )}
          </div>
          <p className="product-title">{data?.product_title}</p>
          <p className="product-description">
            {data?.product_short_description}
          </p>
          <div className="product_price_main">
            <p className="product-price">
              <sup>
                <BsCurrencyDollar />
              </sup>
              {data?.product_price}
            </p>
            <del>$ 19.99</del>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCategoryBox;
