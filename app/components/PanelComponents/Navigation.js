"use client";
import React, { useState } from "react";
import PanelHead from "../PanelHead/PanelHead";
import { Form } from "react-bootstrap";
import InputFormControl from "../InputFormControl/InputFormControl";
import Button from "../Button/Button";

const Navigation = () => {
  const [form, setForm] = useState({
    nav_name: "",
    category: "",
    category_type: "",
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <div>
      <PanelHead tittle="Navigations" />
      <div className="navigation_wrapper panel_middle_content">
        <Form>
          <div className="row">
            <div className="col-md-6">
              <InputFormControl
                required={true}
                label="Navigation Name"
                type="text"
                name="nav_name"
                onChange={handleFormChange}
                value={form.nav_name}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <InputFormControl
                required={true}
                label="Category"
                type="text"
                name="category"
                onChange={handleFormChange}
                value={form.category}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <InputFormControl
                required={true}
                label="Category Type"
                type="text"
                name="category_type"
                onChange={handleFormChange}
                value={form.category_type}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <Button btnTitle={`Add Navigation Menu`} type="submit" />
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Navigation;
