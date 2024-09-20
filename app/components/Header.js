"use client";
import React, { useEffect, useState } from "react";
import HeaderTop from "./HeaderTop";
import HeaderBottom from "./HeaderBottom";
import { Container } from "react-bootstrap";
import { usePathname } from "next/navigation";
import { getNavigationItems } from "../database/firebaseConfig";
import { CgMenu } from "react-icons/cg";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import AllCategoryDrawer from "./AllCategoryDrawer/AllCategoryDrawer";

const Header = () => {
  const [navigationItems, setNavigationItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();
  const panelRoute = pathname?.slice(0, 6) == "/panel";

  const fetchNavigationItems = async () => {
    setLoading(true);
    try {
      const items = await getNavigationItems();
      setNavigationItems(items);
    } catch (error) {
      console.error("Error fetching navigation items:", error);
    } finally {
      setLoading(false);
      setIsFetched(true);
    }
  };

  useEffect(() => {
    if (!isFetched) {
      fetchNavigationItems();
    }
  }, [pathname, isFetched]);

  const handleCategoryDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <>
      <Drawer
        open={isOpen}
        onClose={handleCategoryDrawer}
        direction="left"
        className="category_menu_drawer"
      >
        <AllCategoryDrawer
          handleCategoryDrawer={handleCategoryDrawer}
          navigationItems={navigationItems}
        />
      </Drawer>
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
                <div className="header_bottom_innner">
                  <div
                    className="muenu_bar_drawar"
                    onClick={handleCategoryDrawer}
                  >
                    <CgMenu color="#fff" size={25} />
                  </div>
                  <Container>
                    <HeaderBottom
                      navigationItems={navigationItems}
                      loading={loading}
                    />
                  </Container>
                </div>
              </div>
            )}
          </div>
        </header>
      )}
    </>
  );
};

export default Header;
