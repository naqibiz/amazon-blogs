"use client";
import React, { useEffect } from "react";
import HeaderTop from "./HeaderTop";
import HeaderBottom from "./HeaderBottom";
import { Container } from "react-bootstrap";
import { CgMenu } from "react-icons/cg";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import AllCategoryDrawer from "./AllCategoryDrawer/AllCategoryDrawer";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchNavigations, toggleCategoryDrawer } from "@/store/slices/navSlice";

const Header = () => {
  const dispatch = useAppDispatch();
  const {
    items: navigationItems,
    mostPopular: navigationMostPopular,
    isLoading: loading,
    isCategoryDrawerOpen: isOpen,
    lastFetched,
  } = useAppSelector((state) => state.navigation);

  useEffect(() => {
    if (!lastFetched && navigationItems.length === 0) {
      dispatch(fetchNavigations());
    }
  }, [dispatch, lastFetched, navigationItems.length]);

  const handleCategoryDrawer = () => {
    dispatch(toggleCategoryDrawer());
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
      <header className="header_warpper">
        <div>
          <div className="header_top">
            <Container>
              <HeaderTop />
            </Container>
          </div>
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
                  navigationItems={navigationMostPopular}
                  loading={loading}
                />
              </Container>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
