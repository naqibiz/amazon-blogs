"use client";

import { getProducts } from "@/app/database/firebaseConfig";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { BsCurrencyDollar, BsFillInfoCircleFill } from "react-icons/bs";
import ProductCategoryBox from "../ProductCategoryBox/ProductCategoryBox";
import SkeletonLoader from "../SkeletonLoader/SkeletonLoader";

const ProductsCategory = ({ data }) => {
  const [productItems, setProductItems] = useState([]);
  const [isFetched, setIsFetched] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductItems = async () => {
      try {
        setLoading(true);
        const items = await getProducts();
        const filtered = items?.filter(
          (val) => val?.categoryType === data?.category
        );
        setProductItems(filtered);
      } catch (error) {
        console.error("Error fetching product items:", error);
        setProductItems([]);
      } finally {
        setLoading(false);
      }
    };

    if (data?.category) {
      fetchProductItems();
    }
  }, [data?.category]);

  return (
    <div className="latest_product_listing category_product_listing">
      <Container>
        <div className="latest_products_inner">
          <Row>
            {loading
              ? [1, 2, 3, 4].map((val) => (
                  <Col lg={3} key={val}>
                    <SkeletonLoader height={170} />
                    <div className="content_loader">
                      <SkeletonLoader height={260} />
                    </div>
                  </Col>
                ))
              : productItems.map((val, i) => (
                  <Col lg={3} key={i}>
                    <ProductCategoryBox data={val} />
                  </Col>
                ))}
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default ProductsCategory;
