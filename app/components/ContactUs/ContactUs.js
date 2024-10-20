"use client";
import React, { useEffect, useRef, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import InputFormControl from "../InputFormControl/InputFormControl";
import Button from "../Button/Button";
import HeadContent from "../HeadContent/HeadContent";
import { toast } from "react-toastify";
import { toastStyle } from "@/app/_method/utils";
import { addContactUs } from "@/app/database/firebaseConfig";
import axios from "axios";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

const ContactUs = () => {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
    message: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if email is valid
    if (!regex.test(form.email)) {
      toast.error("Invalid email address", toastStyle);
      return;
    }

    setLoading(true);

    try {
      // Step 1: Attempt to send data to the API
      const response = await axios.post("/api/contact", {
        email: form.email,
        message: form.message,
      });

      if (response.status === 200) {
        // Step 2: If the API call succeeds, add new contact data to Firebase
        await addContactUs({
          fullname: form.firstname + " " + form.lastname,
          firstname: form.firstname,
          lastname: form.lastname,
          phone: form.phone,
          email: form.email,
          message: form.message,
        });

        // Success message and reset form fields
        toast.success("Message sent successfully!", toastStyle);
        setForm({
          firstname: "",
          lastname: "",
          phone: "",
          email: "",
          message: "",
        });
      } else {
        toast.error("Failed to send message", toastStyle);
      }
    } catch (error) {
      console.error("Error submitting contact:", error);
      toast.error("Something went wrong. Please try again later.", toastStyle);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact_us_Page">
      <HeadContent title="Contact Us" />
      <Container>
        <Row>
          <Col md={6}>
            <div className="form_header_content">
              <p className="title">LET’S TALK </p>
              <p className="description">You can always contact us directly</p>
            </div>
            <Form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <InputFormControl
                    required={true}
                    placeholder="First Name"
                    type="text"
                    name="firstname"
                    onChange={handleFormChange}
                    value={form.firstname}
                  />
                </div>
                <div className="col-md-6">
                  <InputFormControl
                    required={true}
                    placeholder="Last Name"
                    type="text"
                    name="lastname"
                    onChange={handleFormChange}
                    value={form.lastname}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  {/* <PhoneInputInternational
                    name="phone"
                    country="us"
                    value={form?.phone}
                    onChange={(number) =>
                      setForm((prev) => ({ ...prev, phone: number }))
                    }
                    placeholder="Phone Number"
                    // disableCountryCode={form?.phone?.length > 0 ? false : true}
                    inputProps={{
                      required: true,
                    }}
                    containerClass="phone_input_international"
                  /> */}

                  <PhoneInput
                    name="phone"
                    defaultCountry="us"
                    value={form?.phone}
                    onChange={(number) =>
                      setForm((prev) => ({ ...prev, phone: number }))
                    }
                    placeholder="Phone Number"
                    inputProps={{
                      required: true,
                    }}
                    className="input_phone_international"
                  />
                </div>
                <div className="col-md-6">
                  <InputFormControl
                    required={true}
                    placeholder="Email Address"
                    type="email"
                    name="email"
                    onChange={handleFormChange}
                    value={form.email}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <InputFormControl
                    required={true}
                    placeholder="Type Message"
                    type="text"
                    name="message"
                    as="textarea"
                    rows={6}
                    onChange={handleFormChange}
                    value={form.message}
                  />
                </div>
              </div>
              <Button btnTitle={`Submit`} type="submit" isLoading={loading} />
            </Form>
          </Col>
          <Col md={6}>
            <div className="contact_us_image_wrapper">
              <div className="contact_us_image">
                <img src="/assets/images/get_in_touch.png" alt="" />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ContactUs;
