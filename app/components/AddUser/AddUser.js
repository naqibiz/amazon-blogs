"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import InputFormControl from "../InputFormControl/InputFormControl";
import Button from "../Button/Button";
import { toast } from "react-toastify";
import { toastStyle } from "@/app/_method/utils";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/app/database/firebaseConfig";

const AddUser = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    fullname: "",
    username: "",
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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: form.fullname,
        photoURL: "",
      });

      toast.success("User added successfully", toastStyle);
      setForm({
        fullname: "",
        username: "",
        email: "",
        password: "",
      });
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("User already exists", toastStyle);
      } else {
        console.error("Error signing up:", error);
        toast.error(error.message, toastStyle);
      }
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
        <div className="row">
          <div className="col-md-6">
            <InputFormControl
              required={true}
              label="Full Name*"
              type="text"
              name="fullname"
              onChange={handleFormChange}
              value={form.fullname}
            />
          </div>
          <div className="col-md-6">
            <InputFormControl
              required={true}
              label="Username*"
              type="text"
              name="username"
              onChange={handleFormChange}
              value={form.username}
            />
          </div>
        </div>

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

        <Button btnTitle={`Signup User`} type="submit" isLoading={loading} />
      </Form>
    </div>
  );
};

export default AddUser;
