"use client";
import React, { useEffect, useState } from "react";
import { Loader } from "./Loader";
import { getProducts } from "../database/firebaseConfig";
import Link from "next/link";

const SearchProducts = ({ searchTerm, setSearchTerm }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      if (!searchTerm || searchTerm.length <= 2) {
        setProducts([]);
        return;
      }

      setLoading(true);

      try {
        const allProducts = await getProducts();

        const filtered = allProducts.filter((product) => {
          const title = product?.product_title?.toLowerCase() || "";
          const number =
            product?.product_number_sin?.toString().toLowerCase() || "";
          const category = product?.category?.toLowerCase() || "";
          const term = searchTerm.toLowerCase();

          return (
            title.includes(term) ||
            number.includes(term) ||
            category.includes(term)
          );
        });

        setProducts(filtered);
      } catch (error) {
        console.error("Search error:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [searchTerm]);

  return (
    <div className="search_products_wrapper">
      <div className="search_products_listing">
        <div className="search_products_grid">
          {loading ? (
            <div className="loading_section">
              <Loader />
              <p>Searching products, please wait...</p>
            </div>
          ) : products?.length === 0 ? (
            <div className="loading_section">
              <p>No products matched your search.</p>
            </div>
          ) : (
            products?.map((data) => (
              <Link
                href={{
                  pathname: "/single-product",
                  query: {
                    id: data.id,
                    type: data?.categoryType,
                  },
                }}
                key={data.id}
                className="link_row_product"
                onClick={() => setSearchTerm("")}
              >
                <div className="row_product">
                  <div className="row_product_info">
                    <div className="product_image_main">
                      <div
                        className="product_image"
                        style={{
                          backgroundImage: `url(${
                            data.imageUrls?.[0]?.url ||
                            "/assets/images/placeholder.png"
                          })`,
                        }}
                      ></div>
                    </div>
                    <div className="product_name">
                      <p>{data?.product_title}</p>
                    </div>
                  </div>
                  <div className="product_category_name">{data?.category}</div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchProducts;
