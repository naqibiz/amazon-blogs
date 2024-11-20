"use client";

import { toastStyle } from "@/app/_method/utils";
import React, { useEffect, useRef, useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import { BsCurrencyDollar } from "react-icons/bs";
import { MdFileCopy } from "react-icons/md";
import { toast } from "react-toastify";
import CategoryListings from "../CategoryListings/CategoryListings";
import LatestProducts from "../LatestProducts/LatestProducts";
import QRCode from "qrcode.react";
import ProductCategoryBox from "../ProductCategoryBox/ProductCategoryBox";
import { getProducts } from "@/app/database/firebaseConfig";
import SkeletonLoader from "../SkeletonLoader/SkeletonLoader";
import PageLoader from "../PageLoader/PageLoader";

const SingleProductDetail = ({ data }) => {
  const [productItems, setProductItems] = useState([]);
  const [isFetched, setIsFetched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(null);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [showMagnifier, setShowMagnifier] = useState(false);
  const topScrollRef = useRef(null);
  const [qrdata, setQRData] = useState("No result");

  useEffect(() => {
    const fetchProductItems = async () => {
      try {
        setLoading(true);
        const items = await getProducts();
        const categoryTypeData = items?.filter(
          (val) => val?.categoryType === data?.type
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
  }, [isFetched]);

  const ProductData = productItems?.find((val) => val?.id === data?.id);

  console.log(ProductData, "ProductDataProductData");

  useEffect(() => {
    if (ProductData?.imageUrls?.length > 0) {
      setCurrentImage(ProductData.imageUrls[0].url);
    }

    if (topScrollRef.current) {
      topScrollRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [ProductData]);

  let linkVal = ProductData?.product_url;

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
    <div className="single_product_detail_wrapper" ref={topScrollRef}>
      {loading ? (
        <PageLoader />
      ) : (
        <>
          <Container>
            <Row>
              <Col lg={4}>
                <div className="magnifire_gallery_wrapper">
                  <div className="gallery_thubmnanails">
                    {ProductData?.imageUrls?.map((val, index) => (
                      <>
                        {console.log(val, "valval==<>")}
                        <div
                          className={`thumbnail ${
                            currentImage == val.url ? "selected" : ""
                          }`}
                          key={index}
                          onClick={() => handleThumbnailClick(val.url)}
                        >
                          <img src={val?.url} alt="" />
                        </div>
                      </>
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
                        backgroundSize: "200%",
                      }}
                    ></div>
                  )}
                </div>
              </Col>
              <Col lg={6}>
                <div className="single_product_detail_content">
                  <h1 className="title">{ProductData?.product_title}</h1>
                  <div className="single_product_content_inner">
                    <p className="description">
                      {ProductData?.product_description}
                    </p>
                    {ProductData?.specifications?.length > 0 && (
                      <div className="product_features">
                        <Table striped responsive>
                          <tbody>
                            {ProductData?.specifications &&
                              ProductData?.specifications?.map((val, i) => (
                                <tr key={i}>
                                  <td>{val?.label}</td>
                                  <td>{val?.value}</td>
                                </tr>
                              ))}
                          </tbody>
                        </Table>
                      </div>
                    )}

                    {ProductData?.about_items?.length > 0 && (
                      <div className="product_about_items">
                        <p className="about_items_title">About this item</p>
                        <ul>
                          {ProductData?.about_items &&
                            ProductData?.about_items?.map((val, i) => (
                              <li key={i}>{val}</li>
                            ))}
                        </ul>
                      </div>
                    )}
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
                      {ProductData?.product_price}
                    </p>
                    {ProductData?.tags?.length > 0 && (
                      <div className="product_tags">
                        {ProductData?.tags &&
                          ProductData?.tags?.map((val, i) => (
                            <p className="tag" key={i}>
                              {val}
                            </p>
                          ))}
                      </div>
                    )}
                    <div className="product_tags_description">
                      <p>{ProductData?.product_short_description}</p>
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
            <Container>
              <h1>Our Newest Related Products</h1>
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
        </>
      )}
    </div>
  );
};

export default SingleProductDetail;
