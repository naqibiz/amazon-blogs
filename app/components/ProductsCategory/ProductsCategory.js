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
  console.log(data, "data==<>");
  const router = useRouter();
  const [productItems, setProductItems] = useState([]);
  const [isFetched, setIsFetched] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductItems = async () => {
      try {
        setLoading(true);
        const items = await getProducts();
        const categoryTypeData = items?.filter(
          (val) => val?.categoryType === data?.category
        );
        setProductItems(categoryTypeData);
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
  }, [isFetched, data]);

  console.log(productItems, "productItems==<>");

  const categoryList = [
    {
      id: 1,
      productImage: "/assets/images/latestProducts/grid_image1.jpg",
      title:
        "Panasonic LUMIX S5II Mirrorless Camera, 24.2MP Full Frame with Phase Hybrid AF, New Active I.S. Technology, Unlimited 4:2:2 10-bit Recording with 20-60mm F3.5-5.6 L Mount Lens - DC-S5M2KK Black",
      description:
        "This high-flow oil filter is designed to provide exceptional flow rates and consistent oil delivery to your engine. Its synthetic-blend filtration media effectively removes harmful contaminants, ensuring your engine's protection. Extensively laboratory tested, it boasts excellent capacity and burst strength. Compatible with all synthetic, conventional, and blended motor oils, this filter offers easy Wrench-Off removal for quick changes. Constructed with a heavy-duty canister for outstanding durability, it comes with a 1-year limited warranty for added peace of mind.This high-flow oil filter is designed to provide exceptional flow rates and consistent oil delivery to your engine. Its synthetic-blend filtration media effectively removes harmful contaminants, ensuring your engine's protection. Extensively laboratory tested, it boasts excellent capacity and burst strength. Compatible with all synthetic, conventional, and blended motor oils, this filter offers easy Wrench-Off removal for quick changes. Constructed with a heavy-duty canister for outstanding durability, it comes with a 1-year limited warranty for added peace of mind.",

      price: "2,097",
    },
    {
      id: 2,
      productImage: "/assets/images/latestProducts/grid_image1.jpg",
      title:
        "Panasonic LUMIX S5II Mirrorless Camera, 24.2MP Full Frame with Phase Hybrid AF, New Active I.S. Technology, Unlimited 4:2:2 10-bit Recording with 20-60mm F3.5-5.6 L Mount Lens - DC-S5M2KK Black",
      description:
        "This high-flow oil filter is designed to provide exceptional flow rates and consistent oil delivery to your engine. Its synthetic-blend filtration media effectively removes harmful contaminants, ensuring your engine's protection. Extensively laboratory tested, it boasts excellent capacity and burst strength. Compatible with all synthetic, conventional, and blended motor oils, this filter offers easy Wrench-Off removal for quick changes. Constructed with a heavy-duty canister for outstanding durability, it comes with a 1-year limited warranty for added peace of mind.This high-flow oil filter is designed to provide exceptional flow rates and consistent oil delivery to your engine. Its synthetic-blend filtration media effectively removes harmful contaminants, ensuring your engine's protection. Extensively laboratory tested, it boasts excellent capacity and burst strength. Compatible with all synthetic, conventional, and blended motor oils, this filter offers easy Wrench-Off removal for quick changes. Constructed with a heavy-duty canister for outstanding durability, it comes with a 1-year limited warranty for added peace of mind.",

      price: "3,097",
    },
    {
      id: 3,
      productImage: "/assets/images/latestProducts/grid_image1.jpg",
      title:
        "Panasonic LUMIX S5II Mirrorless Camera, 24.2MP Full Frame with Phase Hybrid AF, New Active I.S. Technology, Unlimited 4:2:2 10-bit Recording with 20-60mm F3.5-5.6 L Mount Lens - DC-S5M2KK Black",
      description:
        "This high-flow oil filter is designed to provide exceptional flow.",

      price: "1,097",
    },
    {
      id: 4,
      productImage: "/assets/images/latestProducts/grid_image1.jpg",
      title:
        "Panasonic LUMIX S5II Mirrorless Camera, 24.2MP Full Frame with Phase Hybrid AF, New Active I.S. Technology, Unlimited 4:2:2 10-bit Recording with 20-60mm F3.5-5.6 L Mount Lens - DC-S5M2KK Black",
      description:
        "This high-flow oil filter is designed to provide exceptional flow rates and consistent oil delivery to your engine. Its synthetic-blend filtration media effectively removes harmful contaminants, ensuring your engine's protection. Extensively laboratory tested, it boasts excellent capacity and burst strength. Compatible with all synthetic, conventional, and blended motor oils, this filter offers easy Wrench-Off removal for quick changes. Constructed with a heavy-duty canister for outstanding durability, it comes with a 1-year limited warranty for added peace of mind.This high-flow oil filter is designed to provide exceptional flow rates and consistent oil delivery to your engine. Its synthetic-blend filtration media effectively removes harmful contaminants, ensuring your engine's protection. Extensively laboratory tested, it boasts excellent capacity and burst strength. Compatible with all synthetic, conventional, and blended motor oils, this filter offers easy Wrench-Off removal for quick changes. Constructed with a heavy-duty canister for outstanding durability, it comes with a 1-year limited warranty for added peace of mind.",

      price: "2,077",
    },
    {
      id: 5,
      productImage: "/assets/images/latestProducts/grid_image1.jpg",
      title:
        "Panasonic LUMIX S5II Mirrorless Camera, 24.2MP Full Frame with Phase Hybrid AF, New Active I.S. Technology, Unlimited 4:2:2 10-bit Recording with 20-60mm F3.5-5.6 L Mount Lens - DC-S5M2KK Black",
      description:
        "This high-flow oil filter is designed to provide exceptional flow rates and consistent oil delivery to your engine. Its synthetic-blend filtration media effectively removes harmful contaminants, ensuring your engine's protection. Extensively laboratory tested, it boasts excellent capacity and burst strength. Compatible with all synthetic, conventional, and blended motor oils, this filter offers easy Wrench-Off removal for quick changes. Constructed with a heavy-duty canister for outstanding durability, it comes with a 1-year limited warranty for added peace of mind.This high-flow oil filter is designed to provide exceptional flow rates and consistent oil delivery to your engine. Its synthetic-blend filtration media effectively removes harmful contaminants, ensuring your engine's protection. Extensively laboratory tested, it boasts excellent capacity and burst strength. Compatible with all synthetic, conventional, and blended motor oils, this filter offers easy Wrench-Off removal for quick changes. Constructed with a heavy-duty canister for outstanding durability, it comes with a 1-year limited warranty for added peace of mind.",

      price: "4,077",
    },
    {
      id: 6,
      productImage: "/assets/images/latestProducts/grid_image1.jpg",
      title:
        "Panasonic LUMIX S5II Mirrorless Camera, 24.2MP Full Frame with Phase Hybrid AF, New Active I.S. Technology, Unlimited 4:2:2 10-bit Recording with 20-60mm F3.5-5.6 L Mount Lens - DC-S5M2KK Black",
      description:
        "This high-flow oil filter is designed to provide exceptional flow rates and consistent oil delivery to your engine. Its synthetic-blend filtration media effectively removes harmful contaminants, ensuring your engine's protection. Extensively laboratory tested, it boasts excellent capacity and burst strength. Compatible with all synthetic, conventional, and blended motor oils, this filter offers easy Wrench-Off removal for quick changes. Constructed with a heavy-duty canister for outstanding durability, it comes with a 1-year limited warranty for added peace of mind.This high-flow oil filter is designed to provide exceptional flow rates and consistent oil delivery to your engine. Its synthetic-blend filtration media effectively removes harmful contaminants, ensuring your engine's protection. Extensively laboratory tested, it boasts excellent capacity and burst strength. Compatible with all synthetic, conventional, and blended motor oils, this filter offers easy Wrench-Off removal for quick changes. Constructed with a heavy-duty canister for outstanding durability, it comes with a 1-year limited warranty for added peace of mind.",

      price: "3,000",
    },
    {
      id: 7,
      productImage: "/assets/images/latestProducts/grid_image1.jpg",
      title:
        "Panasonic LUMIX S5II Mirrorless Camera, 24.2MP Full Frame with Phase Hybrid AF, New Active I.S. Technology, Unlimited 4:2:2 10-bit Recording with 20-60mm F3.5-5.6 L Mount Lens - DC-S5M2KK Black",
      description:
        "This high-flow oil filter is designed to provide exceptional flow rates and consistent oil delivery to your engine. Its synthetic-blend filtration media effectively removes harmful contaminants, ensuring your engine's protection. Extensively laboratory tested, it boasts excellent capacity and burst strength. Compatible with all synthetic, conventional, and blended motor oils, this filter offers easy Wrench-Off removal for quick changes. Constructed with a heavy-duty canister for outstanding durability, it comes with a 1-year limited warranty for added peace of mind.This high-flow oil filter is designed to provide exceptional flow rates and consistent oil delivery to your engine. Its synthetic-blend filtration media effectively removes harmful contaminants, ensuring your engine's protection. Extensively laboratory tested, it boasts excellent capacity and burst strength. Compatible with all synthetic, conventional, and blended motor oils, this filter offers easy Wrench-Off removal for quick changes. Constructed with a heavy-duty canister for outstanding durability, it comes with a 1-year limited warranty for added peace of mind.",

      price: "3,000",
    },
    {
      id: 8,
      productImage: "/assets/images/latestProducts/grid_image1.jpg",
      title:
        "Panasonic LUMIX S5II Mirrorless Camera, 24.2MP Full Frame with Phase Hybrid AF, New Active I.S. Technology, Unlimited 4:2:2 10-bit Recording with 20-60mm F3.5-5.6 L Mount Lens - DC-S5M2KK Black",
      description:
        "This high-flow oil filter is designed to provide exceptional flow rates and consistent oil delivery to your engine. Its synthetic-blend filtration media effectively removes harmful contaminants, ensuring your engine's protection. Extensively laboratory tested, it boasts excellent capacity and burst strength. Compatible with all synthetic, conventional, and blended motor oils, this filter offers easy Wrench-Off removal for quick changes. Constructed with a heavy-duty canister for outstanding durability, it comes with a 1-year limited warranty for added peace of mind.This high-flow oil filter is designed to provide exceptional flow rates and consistent oil delivery to your engine. Its synthetic-blend filtration media effectively removes harmful contaminants, ensuring your engine's protection. Extensively laboratory tested, it boasts excellent capacity and burst strength. Compatible with all synthetic, conventional, and blended motor oils, this filter offers easy Wrench-Off removal for quick changes. Constructed with a heavy-duty canister for outstanding durability, it comes with a 1-year limited warranty for added peace of mind.",

      price: "3,000",
    },
  ];

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
