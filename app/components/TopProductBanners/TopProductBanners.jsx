"use client";
import React, { useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const TopProductBanners = () => {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
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

  const topProducts = [
    { id: 1, productImage: "/assets/images/bannerImage1.jpg" },
    { id: 2, productImage: "/assets/images/bannerImage2.jpg" },
    { id: 3, productImage: "/assets/images/bannerImage3.jpg" },
  ];

  return (
    <div>
      <Carousel
        swipeable={false}
        draggable={false}
        showDots={false}
        responsive={responsive}
        ssr={true}
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={3000}
        keyBoardControl={true}
        customTransition="all 0.5s"
        transitionDuration={500}
        containerClass="carousel-container"
        removeArrowOnDeviceType={["tablet", "mobile"]}
        dotListClass="custom-dot-list-style"
        itemClass="carousel-item-padding-40-px"
      >
        {topProducts?.map((val) => (
          <div
            key={val?.id}
            className="slider_bg_image"
            style={{ backgroundImage: `url(${val?.productImage})` }}
          ></div>
        ))}
      </Carousel>
    </div>
  );
};

export default TopProductBanners;
