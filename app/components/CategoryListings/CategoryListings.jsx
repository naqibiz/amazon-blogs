"use client";
import React, { useRef } from "react";
import { Container } from "react-bootstrap";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from "../EmblaCarouselArrows/EmblaCarouselArrowButtons";
import Autoplay from "embla-carousel-autoplay";

const CategoryListings = () => {
  const options = { loop: true };
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    Autoplay({ playOnInit: true, delay: 5000 }),
  ]);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

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
      <div className="category_product_listing_inner embla">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {categoryList?.map((val, index) => (
              <div className="embla__slide" key={index}>
                <div
                  className="product_detail embla__slide__img"
                  style={{
                    backgroundImage: `url(${val?.productImage})`,
                  }}
                ></div>
              </div>
            ))}
          </div>
        </div>

        <div className="embla__controls">
          <div className="embla__buttons">
            <PrevButton
              onClick={onPrevButtonClick}
              disabled={prevBtnDisabled}
            />
            <NextButton
              onClick={onNextButtonClick}
              disabled={nextBtnDisabled}
            />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default CategoryListings;
