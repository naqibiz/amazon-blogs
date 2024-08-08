"use client";
import React from "react";
import HeaderTop from "./HeaderTop";
import HeaderBottom from "./HeaderBottom";
import { Container } from "react-bootstrap";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();
  const panelRoute = pathname?.slice(0, 6) == "/panel";

  return (
    <>
      {pathname == "/admin-panel-auth" ? null : (
        <header className="header_warpper">
          <div>
            <div className="header_top">
              <Container>
                <HeaderTop />
              </Container>
            </div>
            {panelRoute ? null : (
              <div className="header_bottom">
                <Container>
                  <HeaderBottom />
                </Container>
              </div>
            )}
          </div>
        </header>
      )}
    </>
  );
};

export default Header;
