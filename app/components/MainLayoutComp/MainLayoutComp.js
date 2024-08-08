"use client";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import UseSidebarNavigation from "../UseSidebarNavigation/UseSidebarNavigation";

const MainLayoutComp = ({ children }) => {
  return (
    <div className="admin_panel_body">
      <Container>
        <Row>
          <Col lg={3}>
            <div className="sidebar_layout">
              <div className="sidebar_layout_inner">
                <UseSidebarNavigation />
              </div>
            </div>
          </Col>
          <Col lg={9}>
            <div className="panel_content_layout">{children}</div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MainLayoutComp;
