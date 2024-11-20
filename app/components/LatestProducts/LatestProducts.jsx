"use client";
import React, { useEffect, useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import StarRatings from "react-star-ratings";
import { BsFillInfoCircleFill } from "react-icons/bs";
import Link from "next/link";
import { BsCurrencyDollar } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { getProducts } from "@/app/database/firebaseConfig";
import ProductCategoryBox from "../ProductCategoryBox/ProductCategoryBox";
import SkeletonLoader from "../SkeletonLoader/SkeletonLoader";

const LatestProducts = () => {
  const [productItems, setProductItems] = useState([]);
  const [isFetched, setIsFetched] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProductItems = async () => {
      try {
        setLoading(true);
        const items = await getProducts();
        const mostPopular = items?.filter(
          (val) => val?.product_type === "Most Popular"
        );
        setProductItems(mostPopular);
      } catch (error) {
        console.error("Error fetching product items:", error);
      } finally {
        setLoading(false);
        setIsFetched(true);
      }
    };

    if (!isFetched) {
      fetchProductItems();
    }
  }, [isFetched]);

  return (
    <Container>
      <h1>Our Newest Obsessions Have Arrived</h1>
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
  );
};

export default LatestProducts;
