"use client";
import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import useEmblaCarousel from "embla-carousel-react";
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from "../EmblaCarouselArrows/EmblaCarouselArrowButtons";
import Autoplay from "embla-carousel-autoplay";
import SkeletonLoader from "../SkeletonLoader/SkeletonLoader";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCategories } from "@/store/slices/categorySlice";

const CategoryListings = () => {
  const router = useRouter();
  const options = { loop: true };
  const dispatch = useAppDispatch();
  const {
    mostPopular: categoryItems,
    isLoading: loading,
    lastFetched,
  } = useAppSelector((state) => state.categories);

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
    if (!lastFetched && categoryItems.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, lastFetched, categoryItems.length]);

  return (
    <Container>
      <h1>One-Stop Shop for Everything You Need</h1>
      {loading && categoryItems.length === 0 ? (
        <div className="category_listing_loader">
          {[1, 2, 3, 4]?.map((val, i) => (
            <SkeletonLoader height={250} width={290} key={i} />
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
                      backgroundImage: `url(${val?.imageUrls?.[0]?.url})`,
                    }}
                    onClick={() =>
                      router.push(
                        `/product-category?category=${val?.category_slug}&name=${val?.category_name}`
                      )
                    }
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
