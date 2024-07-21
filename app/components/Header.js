import React from "react";
import HeaderTop from "./HeaderTop";
import HeaderBottom from "./HeaderBottom";
import { Container } from "react-bootstrap";

const Header = () => {
  return (
    <header className="header_warpper">
      <div>
        <div className="header_top">
          <Container>
            <HeaderTop />
          </Container>
        </div>
        <div className="header_bottom">
          <Container>
            <HeaderBottom />
          </Container>
        </div>
      </div>
    </header>
  );
};

export default Header;
