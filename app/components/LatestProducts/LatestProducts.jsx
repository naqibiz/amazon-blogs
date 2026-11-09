"use client";
import React, { useEffect, useMemo } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useRouter } from "next/navigation";
import ProductCategoryBox from "../ProductCategoryBox/ProductCategoryBox";
import SkeletonLoader from "../SkeletonLoader/SkeletonLoader";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProducts } from "@/store/slices/productSlice";

const LatestProducts = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    items,
    isLoading: loading,
    lastFetched,
  } = useAppSelector((state) => state.products);

  useEffect(() => {
    if (!lastFetched && items.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, lastFetched, items.length]);

  const productItems = useMemo(() => {
    return items?.filter((val) => val?.product_type === "Most Popular") || [];
  }, [items]);

  return (
    <Container>
      <h1>Our Newest Obsessions Have Arrived</h1>
      <div className="latest_products_inner">
        <Row>
          {loading && productItems.length === 0
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
