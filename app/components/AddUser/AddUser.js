"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import InputFormControl from "../InputFormControl/InputFormControl";
import Button from "../Button/Button";
import { toast } from "react-toastify";
import { toastStyle } from "@/app/_method/utils";
import { register } from "@/app/database/firebaseConfig";

const AddUser = ({ setAuthType }) => {
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmpasswordVisible, setConfirmPasswordVisible] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password && form.confirmPassword) {
      if (
        !validatePassword(form.password) ||
        !validatePassword(form.confirmPassword)
      ) {
        toast.error(
          "Password must be 8+ characters with uppercase, lowercase, number, and special character.",
          toastStyle
        );
        return;
      }
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Password is not match", toastStyle);
      return;
    }

    setLoading(true);

    await register({
      email: form.email,
      password: form.password,
      fullName: form.fullname,
    });
    setForm({
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setLoading(false);
    setAuthType("login");
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmpasswordVisible);
  };

  return (
    <div className="cms_panle_auth_wrapper">
      <Form onSubmit={handleSubmit}>
        <InputFormControl
          required={true}
          label="Full Name*"
          type="text"
          name="fullname"
          onChange={handleFormChange}
          value={form.fullname}
        />

        <InputFormControl
          required={true}
          label="E-Mail*"
          type="email"
          name="email"
          onChange={handleFormChange}
          value={form.email}
        />
        <div className="row">
          <div className="col-md-6">
            <InputFormControl
              required={true}
              label="Password*"
              type={passwordVisible ? "text" : "password"}
              name="password"
              onChange={handleFormChange}
              value={form.password}
              icon={passwordVisible ? <FaEye /> : <FaEyeSlash />}
              onClickIcon={togglePasswordVisibility}
            />
          </div>
          <div className="col-md-6">
            <InputFormControl
              required={true}
              label="Confirm Password*"
              type={confirmpasswordVisible ? "text" : "password"}
              name="confirmPassword"
              onChange={handleFormChange}
              value={form.confirmPassword}
              icon={confirmpasswordVisible ? <FaEye /> : <FaEyeSlash />}
              onClickIcon={toggleConfirmPasswordVisibility}
            />
          </div>
        </div>
        <Button btnTitle={`Signup User`} type="submit" isLoading={loading} />
      </Form>
    </div>
  );
};

export default AddUser;
