"use client";

import React, { useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import InputFormControl from "../InputFormControl/InputFormControl";
import Button from "../Button/Button";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/database/firebaseConfig";
import { toast } from "react-toastify";
import { toastStyle } from "@/app/_method/utils";
import Link from "next/link";

const AdminAuth = () => {
  const router = useRouter();
  const [form, setForm] = useState({
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Password is not match", toastStyle);
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      toast.success("Panel successfully logged In", toastStyle);
      router.push("/panel/dashboard");
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        toast.error(
          "Invalid credentials. Please check your email and password.",
          toastStyle
        );
      } else {
        console.log(error, "Sign-in error");
        toast.error(error.message, toastStyle);
      }
    } finally {
      setLoading(false);
    }
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
          label="E-Mail*"
          type="email"
          name="email"
          onChange={handleFormChange}
          value={form.email}
        />
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
        <Button btnTitle={`Login User`} type="submit" isLoading={loading} />
      </Form>
    </div>
  );
};

export default AdminAuth;
