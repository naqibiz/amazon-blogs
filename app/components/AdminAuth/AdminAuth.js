"use client";

import React, { useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import InputFormControl from "../InputFormControl/InputFormControl";
import Button from "../Button/Button";

const AdminAuth = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="cms_panle_login_wrapper">
      <Container>
        <Row>
          <Col lg={6} className="offset-md-3">
            <h1>Itemz Finder Authentication</h1>
            <Form>
              <InputFormControl
                required={true}
                label="E-Mail*"
                type="email"
                name="email"
                onChange={handleFormChange}
                value={form.email}
              />
              <InputFormControl
                required={true}
                label="Password*"
                type="password"
                name="password"
                onChange={handleFormChange}
                value={form.password}
              />
              <InputFormControl
                required={true}
                label="Confirm Password*"
                type="password"
                name="confirmPassword"
                onChange={handleFormChange}
                value={form.confirmPassword}
              />
              <Button btnTitle={`Login Panel`} type="submit" />
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminAuth;
