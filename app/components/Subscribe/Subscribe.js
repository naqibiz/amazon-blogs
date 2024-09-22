"use client";
import React, { useState } from "react";
import { Form } from "react-bootstrap";
import Button from "../Button/Button";
import { addSubscription } from "@/app/database/firebaseConfig";
import { toast } from "react-toastify";
import { toastStyle } from "@/app/_method/utils";

const Subscribe = () => {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const regex =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  const email_address = form.email;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!regex.test(email_address)) {
      toast.error(`Incorrect email`, toastStyle);
      return;
    }

    // Add new subscription
    setLoading(true);
    try {
      await addSubscription({
        email: form.email,
      });
      setForm({
        email: "",
      });
    } catch (error) {
      console.error("Error submitting subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <div className="subscription_form">
          <input
            className="form-control"
            placeholder="Enter your email"
            required
            type="email"
            name="email"
            onChange={handleFormChange}
            value={form.email}
            aria-label="Subscribe Itemzfinder"
          />

          <Button btnTitle={`Subscribe`} type="submit" isLoading={loading} />
        </div>
      </Form>
    </div>
  );
};

export default Subscribe;
