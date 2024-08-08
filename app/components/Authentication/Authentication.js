"use client";
import React, { useState } from "react";
import AdminAuth from "../AdminAuth/AdminAuth";
import Button from "../Button/Button";
import { Col, Container, Row } from "react-bootstrap";
import AddUser from "../AddUser/AddUser";

const Authentication = () => {
  const [authType, setAuthType] = useState("login");

  return (
    <div className="authentication_switch">
      <Container>
        <Row>
          <Col lg={6} className="offset-md-3">
            <div className="change_auth_type">
              <Button
                btnClassName={`${authType === "login" ? "selected" : ""}`}
                btnTitle={`Login User`}
                onClick={() => setAuthType("login")}
              />
              <Button
                btnClassName={`${authType === "signup" ? "selected" : ""}`}
                btnTitle={`Signup User`}
                onClick={() => setAuthType("signup")}
              />
            </div>

            {authType === "signup" ? <AddUser /> : <AdminAuth />}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Authentication;
