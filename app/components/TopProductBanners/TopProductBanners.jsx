"use client";
import useEmblaCarousel from "embla-carousel-react";
import React, { useState } from "react";
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from "../EmblaCarouselArrows/EmblaCarouselArrowButtons";
import Autoplay from "embla-carousel-autoplay";

const TopProductBanners = () => {
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

  const topProducts = [
    { id: 1, productImage: "/assets/images/bannerImage1.jpg" },
    { id: 2, productImage: "/assets/images/bannerImage2.jpg" },
    { id: 3, productImage: "/assets/images/bannerImage3.jpg" },
  ];

  return (
    <>
      <section className="embla_hero_slider embla">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {topProducts?.map((val, index) => (
              <div className="embla__slide" key={index}>
                <div
                  className="slider_bg_image embla__slide__img"
                  style={{ backgroundImage: `url(${val?.productImage})` }}
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
      </section>
    </>
  );
};

export default TopProductBanners;
