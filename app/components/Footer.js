"use client";
import Link from "next/link";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import Subscribe from "./Subscribe/Subscribe";
import { MdLocalPhone, MdEmail } from "react-icons/md";
import { RiArrowRightSFill } from "react-icons/ri";
import { BsInstagram } from "react-icons/bs";
import { FaFacebookSquare } from "react-icons/fa";
import { SiLinkedin } from "react-icons/si";
import { IoLogoYoutube } from "react-icons/io";
import { usePathname, useRouter } from "next/navigation";

const Footer = () => {
  const router = useRouter();
  const pathname = usePathname();
  const panelRoute = pathname?.slice(0, 6) == "/panel";
  const footerItems = [
    {
      title: "Quick Links",
      space: "50px",
      items: [
        { id: 1, title: "Home", link: "/" },
        { id: 2, title: "About Us", link: "/" },
        { id: 3, title: "Products", link: "/" },
        { id: 4, title: "Contact Us", link: "/" },
      ],
    },
    {
      title: "Categories",
      space: "20px",
      items: [
        { id: 1, title: "Electronics", link: "/" },
        { id: 2, title: "Computers", link: "/" },
        { id: 3, title: "Smart Home", link: "/" },
        { id: 4, title: "Arts & Crafts", link: "/" },
        { id: 5, title: "Women's Fashion", link: "/" },
        { id: 6, title: "Men's Fashion", link: "/" },
      ],
    },
    {
      title: "By asking",
      space: "0px",
      items: [
        {
          id: 1,
          title: "itemzfinder@gmail.com",
          link: "itemzfinder@gmail.com",
          icon: "",
          type: "mail",
        },
        {
          id: 2,
          title: "+92 331 2299471",
          link: "+92 331 2299471",
          icon: "",
          type: "phone",
        },
      ],
    },
  ];

  return (
    <>
      {pathname == "/admin-panel-auth" || panelRoute ? (
        <></>
      ) : (
        <footer className="footer_section">
          <Container>
            <Row>
              <Col lg={3} md={6}>
                <div className="fooer_logo_section">
                  <Link href={"/"}>
                    <img src="/assets/images/logo-amazon.png" alt="" />
                  </Link>
                  <div className="short_overview">
                    <p>
                      ItemzFinder is a dynamic blogging platform dedicated to
                      showcasing a wide range of products. It helps users
                      discover and explore the latest items across various
                      categories, enhancing their shopping experience with
                      curated content and reviews.
                    </p>
                  </div>
                </div>
              </Col>
              {footerItems &&
                footerItems?.map((val, i) => (
                  <Col lg={2} md={6} key={i}>
                    <div style={{ paddingLeft: val?.space }}>
                      <p className="footer_link_title">
                        <span className="title">{val?.title}</span>
                      </p>
                      <ul className="footer_navigations">
                        {val?.items?.map((links, i) => (
                          <>
                            {links?.type == "mail" ? (
                              <li className="item_link" key={i}>
                                <Link href={`mailto:${links?.link}`}>
                                  <MdEmail /> {links?.title}
                                </Link>
                              </li>
                            ) : links?.type == "phone" ? (
                              <li className="item_link" key={i}>
                                <Link href={`tel:${links?.link}`}>
                                  <MdLocalPhone /> {links?.title}
                                </Link>
                              </li>
                            ) : (
                              <li className="item_link" key={i}>
                                <Link href={links?.link}>
                                  <RiArrowRightSFill color="#fff" size={17} />
                                  {links?.title}
                                </Link>
                              </li>
                            )}
                          </>
                        ))}
                      </ul>
                    </div>
                  </Col>
                ))}

              <Col lg={3} md={6}>
                <div className="get_in_touch" style={{ paddingLeft: "20px" }}>
                  <div className="">
                    <p className="footer_link_title">
                      <span className="title">Get in touch</span>
                    </p>
                    <div className="social_icons">
                      <ul>
                        <li>
                          <Link href={"/"}>
                            <BsInstagram color="#fff" size={25} />
                          </Link>
                        </li>
                        <li>
                          <Link href={"/"}>
                            <FaFacebookSquare color="#fff" size={25} />
                          </Link>
                        </li>
                        <li>
                          <Link href={"/"}>
                            <SiLinkedin color="#fff" size={25} />
                          </Link>
                        </li>
                        <li>
                          <Link href={"/"}>
                            <IoLogoYoutube color="#fff" size={25} />
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="footer_subscribe">
                    <Subscribe />
                  </div>
                </div>
              </Col>
            </Row>
            <div className="copy_right_section">
              <div className="copy_right_inner">
                <p>©2024 ItemzFinder, All right reserved</p>
              </div>
            </div>
          </Container>
        </footer>
      )}
    </>
  );
};

export default Footer;
