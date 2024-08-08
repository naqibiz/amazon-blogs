import React from "react";
import { Form } from "react-bootstrap";
import Button from "../Button/Button";

const Subscribe = () => {
  return (
    <div>
      <Form>
        <div className="subscription_form">
          <input
            className="form-control"
            placeholder="Enter your email"
            required
            type="email"
            aria-label="Subscribe Itemzfinder"
          />
          <Button btnTitle={`Subscribe`} type="submit" />
        </div>
      </Form>
    </div>
  );
};

export default Subscribe;
