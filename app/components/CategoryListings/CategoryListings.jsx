"use client";
import React, { useRef } from "react";
import { Container } from "react-bootstrap";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { SlArrowRight, SlArrowLeft } from "react-icons/sl";
import Link from "next/link";

const CategoryListings = () => {
  let carouselRef = useRef();
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const categoryList = [
    {
      id: 1,
      productImage: "/assets/images/CategoryListing/bannerImage1.jpg",
      type: "electronics",
      category: "Electronics",
    },
    {
      id: 2,
      productImage: "/assets/images/CategoryListing/bannerImage2.jpg",
      type: "computer",
      category: "Computer",
    },
    {
      id: 3,
      productImage: "/assets/images/CategoryListing/bannerImage3.jpg",
      type: "smarthome",
      category: "Smart Home",
    },
    {
      id: 4,
      productImage: "/assets/images/CategoryListing/bannerImage4.jpg",
      type: "automotive",
      category: "Automotive",
    },
    {
      id: 5,
      productImage: "/assets/images/CategoryListing/bannerImage5.jpg",
      type: "womens_fashion",
      category: "Women's Fashion",
    },
    {
      id: 6,
      productImage: "/assets/images/CategoryListing/bannerImage6.jpg",
      type: "mens_fashion",
      category: "Men's Fashion",
    },
    {
      id: 7,
      productImage: "/assets/images/CategoryListing/bannerImage7.jpg",
      type: "software",
      category: "Softwares",
    },
    {
      id: 8,
      productImage: "/assets/images/CategoryListing/bannerImage8.jpg",
      type: "smart_games",
      category: "Smart Toys & Games",
    },
  ];

  return (
    <Container>
      <h1>One-Stop Shop for Everything You Need</h1>
      <div className="category_product_listing_inner">
        <div className="custom_slide_button">
          <div
            className="previous_slide slider_action_arrow"
            onClick={() => {
              carouselRef.previous();
            }}
          >
            <SlArrowLeft />
          </div>
          <div
            className="next_slide slider_action_arrow"
            onClick={() => {
              carouselRef.next();
            }}
          >
            <SlArrowRight />
          </div>
        </div>
        <Carousel
          ref={(el) => {
            carouselRef = el;
          }}
          arrows={false}
          swipeable={false}
          draggable={false}
          showDots={false}
          responsive={responsive}
          ssr={true}
          infinite={true}
          autoPlay={false}
          autoPlaySpeed={3000}
          keyBoardControl={true}
          customTransition="all 0.5s"
          transitionDuration={500}
          containerClass="carousel-container"
          removeArrowOnDeviceType={["tablet", "mobile"]}
          dotListClass="custom-dot-list-style"
          itemClass="carousel-item-padding-40-px"
          partialVisible={false}
        >
          {categoryList?.map((val) => (
            <div
              key={val?.id}
              className="product_detail"
              style={{
                backgroundImage: `url(${val?.productImage})`,
              }}
            ></div>
          ))}
        </Carousel>
      </div>
    </Container>
  );
};

export default CategoryListings;
