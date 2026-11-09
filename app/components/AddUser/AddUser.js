"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { FiShield, FiUserPlus, FiCheck, FiX } from "react-icons/fi";
import InputFormControl from "../InputFormControl/InputFormControl";
import Button from "../Button/Button";
import { toast } from "react-toastify";
import { toastStyle } from "@/app/_method/utils";
import { register } from "@/app/database/firebaseConfig";
import { useAppDispatch } from "@/src/store/hooks";
import { invalidateDashboardCache } from "@/src/store/slices/dashboardSlice";
import PanelHead from "../PanelHead/PanelHead";

const AddUser = ({ setAuthType }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
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

  // Password requirements
  const hasLength = form.password.length >= 8;
  const hasUpper = /[A-Z]/.test(form.password);
  const hasLower = /[a-z]/.test(form.password);
  const hasNumber = /\d/.test(form.password);
  const hasSpecial = /[!@#$%^&*]/.test(form.password);
  const isPasswordValid = hasLength && hasUpper && hasLower && hasNumber && hasSpecial;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPasswordValid) {
      toast.error(
        "Please meet all password security requirements before proceeding.",
        toastStyle
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.", toastStyle);
      return;
    }

    setLoading(true);
    try {
      await register({
        email: form.email,
        password: form.password,
        fullName: form.fullname,
      });

      dispatch(invalidateDashboardCache());
      toast.success("Administrator account registered successfully!", toastStyle);

      setForm({
        fullname: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      if (setAuthType) {
        setAuthType("login");
      } else {
        router.push("/panel/dashboard");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(
        error?.message || "Registration failed. Please try again.",
        toastStyle
      );
    } finally {
      setLoading(false);
    }
  };

  const isInsidePanel = !setAuthType;

  return (
    <div>
      {isInsidePanel && <PanelHead tittle="Security &amp; User Access" />}

      <div
        className="admin_form_card"
        style={{
          marginTop: isInsidePanel ? "18px" : "0",
          maxWidth: isInsidePanel ? "680px" : "100%",
        }}
      >
        <div className="admin_form_header">
          <div>
            <h3 className="admin_form_title">
              <FiShield style={{ marginRight: "8px", color: "#f3971b" }} />
              Register Administrator Account
            </h3>
            <p className="admin_form_subtitle">
              Grant dashboard management and catalog editing permissions
            </p>
          </div>
          <span className="admin_nav_count_badge">Role: Administrator</span>
        </div>

        <Form onSubmit={handleSubmit} style={{ marginTop: "24px" }}>
          <div style={{ marginBottom: "16px" }}>
            <InputFormControl
              required={true}
              label="Full Name *"
              type="text"
              name="fullname"
              placeholder="e.g. Sarah Jenkins"
              onChange={handleFormChange}
              value={form.fullname}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <InputFormControl
              required={true}
              label="Email Address *"
              type="email"
              name="email"
              placeholder="admin@example.com"
              onChange={handleFormChange}
              value={form.email}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "16px", position: "relative" }}>
            <InputFormControl
              required={true}
              label="Password *"
              type={passwordVisible ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              onChange={handleFormChange}
              value={form.password}
            />
            <div
              className="password_trigger"
              onClick={() => setPasswordVisible(!passwordVisible)}
              style={{
                position: "absolute",
                right: "14px",
                top: "42px",
                cursor: "pointer",
                color: "#64748b",
              }}
            >
              {passwordVisible ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </div>
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: "20px", position: "relative" }}>
            <InputFormControl
              required={true}
              label="Confirm Password *"
              type={confirmpasswordVisible ? "text" : "password"}
              name="confirmPassword"
              placeholder="••••••••"
              onChange={handleFormChange}
              value={form.confirmPassword}
            />
            <div
              className="password_trigger"
              onClick={() => setConfirmPasswordVisible(!confirmpasswordVisible)}
              style={{
                position: "absolute",
                right: "14px",
                top: "42px",
                cursor: "pointer",
                color: "#64748b",
              }}
            >
              {confirmpasswordVisible ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </div>
          </div>

          {/* Password Checklist */}
          {form.password && (
            <div className="admin_password_checklist">
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#475569", display: "block", marginBottom: "6px" }}>
                Password Security Checklist:
              </span>
              <ul className="admin_checklist_ul">
                <li className={hasLength ? "valid" : "invalid"}>
                  {hasLength ? <FiCheck /> : <FiX />} 8+ characters
                </li>
                <li className={hasUpper ? "valid" : "invalid"}>
                  {hasUpper ? <FiCheck /> : <FiX />} Uppercase letter
                </li>
                <li className={hasLower ? "valid" : "invalid"}>
                  {hasLower ? <FiCheck /> : <FiX />} Lowercase letter
                </li>
                <li className={hasNumber ? "valid" : "invalid"}>
                  {hasNumber ? <FiCheck /> : <FiX />} Number
                </li>
                <li className={hasSpecial ? "valid" : "invalid"}>
                  {hasSpecial ? <FiCheck /> : <FiX />} Special character (!@#$%^&amp;*)
                </li>
              </ul>
            </div>
          )}

          <div style={{ marginTop: "24px" }}>
            <Button
              btnTitle="Create Administrator Account"
              type="submit"
              isLoading={loading}
              disabled={loading || !isPasswordValid}
            />
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AddUser;
