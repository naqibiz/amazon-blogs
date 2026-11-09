"use client";
import React, { useEffect, useMemo } from "react";
import { Loader } from "./Loader";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProducts } from "@/store/slices/productSlice";

const SearchProducts = ({ searchTerm, setSearchTerm }) => {
  const dispatch = useAppDispatch();
  const {
    items: allProducts,
    isLoading: loading,
    lastFetched,
  } = useAppSelector((state) => state.products);

  useEffect(() => {
    if (!lastFetched && allProducts.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, lastFetched, allProducts.length]);

  const products = useMemo(() => {
    if (!searchTerm || searchTerm.trim().length <= 2) {
      return [];
    }

    const term = searchTerm.toLowerCase();
    return allProducts.filter((product) => {
      const title = product?.product_title?.toLowerCase() || "";
      const number =
        product?.product_number_sin?.toString().toLowerCase() || "";
      const category = product?.category?.toLowerCase() || "";

      return (
        title.includes(term) ||
        number.includes(term) ||
        category.includes(term)
      );
    });
  }, [searchTerm, allProducts]);

  return (
    <div className="search_products_wrapper">
      <div className="search_products_listing">
        <div className="search_products_grid">
          {loading && allProducts.length === 0 ? (
            <div className="loading_section">
              <Loader />
              <p>Searching products, please wait...</p>
            </div>
          ) : products?.length === 0 ? (
            <div className="loading_section">
              <p>No products matched your search.</p>
            </div>
          ) : (
            <ul>
              {products.map((val, i) => (
                <li key={i} onClick={() => setSearchTerm("")}>
                  <Link
                    href={{
                      pathname: "/single-product",
                      query: {
                        id: val?.id,
                        type: val?.categoryType,
                      },
                    }}
                  >
                    <div className="search_product_grid_main">
                      <div className="search_product_image">
                        <img src={val?.imageUrls?.[0]?.url} alt="" />
                      </div>
                      <div className="search_product_content">
                        <p className="search_product_title">
                          {val?.product_title}
                        </p>
                        <p className="search_product_price">
                          ${val?.product_price}
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchProducts;
