import React from "react";
import { Form } from "react-bootstrap";
import { LuSearch } from "react-icons/lu";
import { FaPhoneVolume } from "react-icons/fa6";
import { GrLanguage } from "react-icons/gr";

const HeaderTop = () => {
  return (
    <div className="header_top_content">
      <div className="header_logo">
        <img src="/assets/images/logo-amazon.png" alt="" />
      </div>
      <div className="search-blog">
        <Form>
          <input
            className="form-control"
            placeholder="Find what you're looking for..."
            required
            type="text"
            aria-label="Search Blogs"
          />
          <button className="search_blog_btn">
            <LuSearch color="#fff" size={25} />
          </button>
        </Form>
      </div>
      <div className="header_right_section">
        {/* <div className="change_language">
          <div className="language_icon">
            <GrLanguage color="#fff" size={20} />
          </div>
          <div className="languages">
            <div className="lang">
              <div
                className="icon"
                style={{ backgroundImage: `url(/assets/images/us-flag.svg)` }}
              ></div>
              <p>English</p>
            </div>
            <div className="lang">
              <div
                className="icon"
                style={{
                  backgroundImage: `url(/assets/images/france-flag.svg)`,
                }}
              ></div>

              <p>Français</p>
            </div>
            <div className="lang">
              <div
                className="icon"
                style={{
                  backgroundImage: `url(/assets/images/germany-flag.svg)`,
                }}
              ></div>

              <p>Deutsch</p>
            </div>
          </div>
        </div> */}
        <div className="contact_section">
          <a href="tel:03312299471">
            <FaPhoneVolume size={25} color="#ffffff" />
            03312299471
          </a>
        </div>
      </div>
    </div>
  );
};

export default HeaderTop;
