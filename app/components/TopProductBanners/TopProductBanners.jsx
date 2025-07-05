"use client";
import useEmblaCarousel from "embla-carousel-react";
import React, { useEffect, useState } from "react";
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from "../EmblaCarouselArrows/EmblaCarouselArrowButtons";
import Autoplay from "embla-carousel-autoplay";
import { getBannerSetting } from "@/app/database/firebaseConfig";
import SkeletonLoader from "../SkeletonLoader/SkeletonLoader";

const TopProductBanners = () => {
  const [loader, setLoader] = useState(false);
  const [bannerItems, setBannerItems] = useState([]);
  const [isFetched, setIsFetched] = useState(false);
  const options = { loop: true };
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    Autoplay({ playOnInit: true, delay: 5000 }),
  ]);

  console.log(bannerItems[0]?.imageUrls, "bannerItems---bannerItems");

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

  useEffect(() => {
    let isMounted = true;

    const fetchBannerItems = async () => {
      if (isFetched) return;

      if (isMounted) setLoader(true);

      try {
        const items = await getBannerSetting();
        if (isMounted) {
          setBannerItems(items);
          setIsFetched(true);
        }
      } catch (error) {
        console.error("Error fetching banner items:", error);
      } finally {
        if (isMounted) {
          setLoader(false);
        }
      }
    };

    fetchBannerItems();

    return () => {
      isMounted = false;
    };
  }, [isFetched]);

  return (
    <>
      <section className="embla_hero_slider embla">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container embla_banner_container">
            {loader ? (
              <div className="skeleton_loader_banner">
                <SkeletonLoader height={400} />
              </div>
            ) : (
              <>
                {bannerItems[0]?.imageUrls?.map((val, index) => (
                  <div className="embla__slide" key={index}>
                    <div
                      className="slider_bg_image embla__slide__img"
                      style={{ backgroundImage: `url(${val?.url})` }}
                    ></div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
        {loader ? (
          <></>
        ) : (
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
        )}
      </section>
    </>
  );
};

export default TopProductBanners;
