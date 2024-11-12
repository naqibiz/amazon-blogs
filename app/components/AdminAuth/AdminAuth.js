"use client";

import React, { useState } from "react";
import { Form } from "react-bootstrap";
import InputFormControl from "../InputFormControl/InputFormControl";
import Button from "../Button/Button";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { login } from "@/app/database/firebaseConfig";

const AdminAuth = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
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
    setLoading(true);
    try {
      await login({ email: form.email, password: form.password });
      router.push("/panel/dashboard");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
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

        <Button btnTitle={`Login User`} type="submit" isLoading={loading} />
      </Form>
    </div>
  );
};

export default AdminAuth;
