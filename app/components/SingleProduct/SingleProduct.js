"use client";

import { toastStyle } from "@/app/_method/utils";
import React, { useEffect, useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import { BsCurrencyDollar } from "react-icons/bs";
import { MdFileCopy } from "react-icons/md";
import { toast } from "react-toastify";
import CategoryListings from "../CategoryListings/CategoryListings";
import LatestProducts from "../LatestProducts/LatestProducts";
import QRCode from "qrcode.react";

const SingleProductDetail = ({ data }) => {
  const productImages = [
    { id: 1, image: "/assets/images/sliderImg1.jpg" },
    { id: 2, image: "/assets/images/sliderImg2.jpg" },
    { id: 3, image: "/assets/images/sliderImg3.jpg" },
    { id: 4, image: "/assets/images/sliderImg4.jpg" },
    { id: 5, image: "/assets/images/sliderImg5.jpg" },
    { id: 5, image: "/assets/images/sliderImg6.jpg" },
    { id: 6, image: "/assets/images/sliderImg1.jpg" },
    { id: 7, image: "/assets/images/sliderImg2.jpg" },
    { id: 8, image: "/assets/images/sliderImg3.jpg" },
  ];

  const [currentImage, setCurrentImage] = useState(productImages[0]?.image);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [qrdata, setQRData] = useState("No result");

  useEffect(() => {
    console.log(data, "data");
  }, []);

  const productTags = [
    "PanasonicLUMIXG100",
    "MirrorlessCamera",
    "4KVideo",
    "MicroFourThirds",
    "VloggingCamera",
    "12_32mmLens",
    "5AxisIS",
    "PhotoandVideo",
  ];

  let linkVal = "https://itemzfinder.com/";

  const copyToClipboard = () => {
    const link = linkVal;
    navigator.clipboard
      .writeText(link)
      .then(() => {
        toast.success(`Link copied to clipboard!`, toastStyle);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast.error(`Failed to copy the link. Please try again.`, toastStyle);
      });
  };

  const handleThumbnailClick = (image) => {
    setCurrentImage(image);
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMagnifierPosition({ x, y });
  };

  const handleMouseEnter = () => {
    setShowMagnifier(true);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  return (
    <div className="single_product_detail_wrapper">
      <Container>
        <Row>
          <Col lg={4}>
            <div className="magnifire_gallery_wrapper">
              <div className="gallery_thubmnanails">
                {productImages?.map((val, index) => (
                  <div
                    className={`thumbnail ${
                      currentImage == val.image ? "selected" : ""
                    }`}
                    key={index}
                    onClick={() => handleThumbnailClick(val.image)}
                  >
                    <img src={val?.image} alt="" />
                  </div>
                ))}
              </div>
              <div className="magnifire_image">
                <img
                  src={currentImage}
                  alt=""
                  onMouseMove={handleMouseMove}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                />
              </div>
              {showMagnifier && (
                <div
                  className="magnifier"
                  style={{
                    backgroundImage: `url(${currentImage})`,
                    backgroundPosition: `${magnifierPosition.x}% ${magnifierPosition.y}%`,
                    backgroundSize: "200%", // Adjust as needed for zoom level
                  }}
                ></div>
              )}
            </div>
          </Col>
          <Col lg={6}>
            <div className="single_product_detail_content">
              <h1 className="title">
                Panasonic LUMIX G100 4k Mirrorless Camera for Photo and Video,
                Built-in Microphone with Tracking, Micro Four Thirds
                Interchangeable Lens System, 12-32mm Lens, 5-Axis Hybrid I.S.,
                DC-G100DKK (Black)
              </h1>
              <div className="single_product_content_inner">
                <p className="description">
                  This high-flow oil filter is designed to provide exceptional
                  flow rates and consistent oil delivery to your engine. Its
                  synthetic-blend filtration media effectively removes harmful
                  contaminants, ensuring your engine's protection. Extensively
                  laboratory tested, it boasts excellent capacity and burst
                  strength. Compatible with all synthetic, conventional, and
                  blended motor oils, this filter offers easy Wrench-Off removal
                  for quick changes. Constructed with a heavy-duty canister for
                  outstanding durability, it comes with a 1-year limited
                  warranty for added peace of mind.This high-flow oil filter is
                  designed to provide exceptional flow rates and consistent oil
                  delivery to your engine. Its synthetic-blend filtration media
                  effectively removes harmful contaminants, ensuring your
                  engine's protection. Extensively laboratory tested, it boasts
                  excellent capacity and burst strength. Compatible with all
                  synthetic, conventional, and blended motor oils, this filter
                  offers easy Wrench-Off removal for quick changes. Constructed
                  with a heavy-duty canister for outstanding durability, it
                  comes with a 1-year limited warranty for added peace of mind.
                </p>
                <div className="product_features">
                  <Table striped responsive>
                    <tbody>
                      <tr>
                        <td>Compatible Mountings</td>
                        <td>Micro Four Thirds</td>
                      </tr>
                      <tr>
                        <td>Aspect Ratio</td>
                        <td>1:1, 3:2</td>
                      </tr>
                      <tr>
                        <td>Photo Sensor Technology</td>
                        <td>CMOS</td>
                      </tr>
                      <tr>
                        <td>Supported File Format</td>
                        <td>JPEG</td>
                      </tr>
                      <tr>
                        <td>Image Stabilization</td>
                        <td>Digital</td>
                      </tr>
                      <tr>
                        <td>Maximum Focal Length</td>
                        <td>32 Millimeters</td>
                      </tr>
                      <tr>
                        <td>Optical Zoom</td>
                        <td>2 x</td>
                      </tr>
                      <tr>
                        <td>Maximum Aperture</td>
                        <td>3.5 f</td>
                      </tr>
                      <tr>
                        <td>Expanded ISO Minimum</td>
                        <td>100</td>
                      </tr>
                      <tr>
                        <td>Brand</td>
                        <td>Panasonic</td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
                <div className="product_about_items">
                  <p className="about_items_title">About this item</p>
                  <ul>
                    <li>
                      Feature-Packed Camera: Why trust your memories to a phone?
                      With exceptional performance and versatility, the LUMIX
                      G100 captures life in crystal-clear 4K photo, 4K 24p 30p
                      video, and advanced audio
                    </li>
                    <li>
                      Grows as Your Skills Grow: iA (intelligent auto) mode
                      gives the perfect shot every time, or use manual modes as
                      your skills sharpen; Micro Four Thirds system is
                      compatible with all LUMIX lenses for any adventure;
                      12-32mm lens included
                    </li>
                    <li>
                      Use as a Webcam: Easily connect the G100 to your computer
                      so that your web calls, livestreams, interviews, and media
                      all look crisp, bright, and professional
                    </li>
                    <li>
                      Shoot, Transfer, Edit, Share: Features guide you at every
                      step—frame marker for social media aspect ratios; facial
                      recognition; blur-free dual image stabilization and V-Log
                      L recording. Upload to smartphone seamlessly
                    </li>
                    <li>
                      Advanced 360-Degree Sound: High-performance microphone
                      with tracking audio auto-adjusts to record clearly inside
                      or outside, in crowds, one-on-ones, nature, and more;
                      lightweight camera for one-handed recording
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Col>
          <Col lg={2}>
            <div className="product_purchase_info">
              <div className="product_purchase_info_content">
                <p className="product-price">
                  <sup>
                    <BsCurrencyDollar />
                  </sup>
                  747
                </p>
                <div className="product_tags">
                  {productTags?.map((val, i) => (
                    <p className="tag" key={i}>
                      {val}
                    </p>
                  ))}
                </div>
                <div className="product_tags_description">
                  <p>
                    This high-flow oil filter delivers exceptional oil flow and
                    contaminant removal with its synthetic-blend media, ensuring
                    optimal engine protection. Extensively tested and highly
                    durable, it fits all motor oils and offers easy removal.
                    Purchase now via the link below.
                  </p>
                </div>
                <div className="product_purchase_link">
                  <input type="text" value={linkVal} readOnly />
                  <button
                    className="copy_link_product"
                    onClick={copyToClipboard}
                  >
                    Copy For Purchase <MdFileCopy />
                  </button>
                </div>
                <div className="qr_code_scan_link">
                  <QRCode
                    value={linkVal}
                    size={140}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="Q"
                    includeMargin={true}
                    imageSettings={{
                      src: "/assets/images/qr-code.svg",
                      x: null,
                      y: null,
                      height: 140,
                      width: 140,
                      excavate: true,
                    }}
                  />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      <div className="category_product_listing">
        <CategoryListings />
      </div>
      <div className="releated_products latest_product_listing">
        <LatestProducts />
      </div>
    </div>
  );
};

export default SingleProductDetail;
