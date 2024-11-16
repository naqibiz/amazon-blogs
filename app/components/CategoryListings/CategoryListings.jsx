"use client";
import React, { useEffect, useRef, useState } from "react";
import { Container } from "react-bootstrap";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from "../EmblaCarouselArrows/EmblaCarouselArrowButtons";
import Autoplay from "embla-carousel-autoplay";
import { getCategoryCollections } from "@/app/database/firebaseConfig";
import SkeletonLoader from "../SkeletonLoader/SkeletonLoader";

const CategoryListings = () => {
  const options = { loop: true };
  const [categoryItems, setCategoryItems] = useState([]);
  const [isFetched, setIsFetched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    Autoplay({ playOnInit: true, delay: 5000 }),
  ]);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  useEffect(() => {
    const fetchCategoryItems = async () => {
      try {
        setLoading(true);
        const items = await getCategoryCollections();
        const mostPopular = items?.filter(
          (val) => val?.category_type === "Most Popular"
        );
        setCategoryItems(mostPopular);
      } catch (error) {
        console.error("Error fetching category items:", error);
      } finally {
        setLoading(false);
        setIsFetched(true);
      }
    };

    if (!isFetched) {
      fetchCategoryItems();
    }
  }, [isFetched]);

  return (
    <Container>
      <h1>One-Stop Shop for Everything You Need</h1>
      {loading ? (
        <div className="category_listing_loader">
          {[1, 2, 3, 4]?.map((val, i) => (
            <SkeletonLoader height={250} width={290} />
          ))}
        </div>
      ) : (
        <div className="category_product_listing_inner embla">
          <div className="embla__viewport" ref={emblaRef}>
            <div className="embla__container">
              {categoryItems?.map((val, index) => (
                <div className="embla__slide" key={index}>
                  <div
                    className="product_detail embla__slide__img"
                    style={{
                      backgroundImage: `url(${val?.imageUrls[0]?.url})`,
                    }}
                  >
                    <div className="caregory_name">{val?.category_name}</div>
                  </div>
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
      )}
    </Container>
  );
};

export default CategoryListings;
