"use client";

import { getProducts } from "@/app/database/firebaseConfig";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { BsCurrencyDollar, BsFillInfoCircleFill } from "react-icons/bs";

const ProductsCategory = ({ data }) => {
  const router = useRouter();
  const [productItems, setProductItems] = useState([]);
  const [isFetched, setIsFetched] = useState(false);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const fetchProductItems = async () => {
      try {
        setLoader(true);
        const items = await getProducts();
        setProductItems(items);
      } catch (error) {
        console.error("Error fetching product items:", error);
      } finally {
        setLoader(false);
        setIsFetched(true);
      }
    };

    if (!isFetched) {
      fetchProductItems();
    }
  }, [isFetched, data]);

  const filteredProducts = productItems?.filter(
    (product) => product?.categoryType === data?.category
  );

  console.log(filteredProducts, "filteredProductsfilteredProducts");

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
            {categoryList?.map((val, i) => (
              <Col lg={3} md={4} key={i}>
                <div className="latest_product_grid">
                  <Link href={`/single-product?id=${val?.id}`}>
                    <div className="product_image">
                      <img src={val?.productImage} alt="" />
                    </div>
                    <div className="product-content">
                      <p className="sponsored">
                        Sponsored <BsFillInfoCircleFill />
                      </p>
                      <p className="product-title">{val?.description}</p>
                      <p className="product-description">{val?.description}</p>
                      <div className="product_price_main">
                        <p className="product-price">
                          <sup>
                            <BsCurrencyDollar />
                          </sup>
                          {val?.price}
                        </p>
                        <del>$ 19.99</del>
                      </div>
                    </div>
                  </Link>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default ProductsCategory;
