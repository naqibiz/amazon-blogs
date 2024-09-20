"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import React from "react";

const ProgressBarRouting = () => {
  return (
    <div>
      <ProgressBar
        height="4px"
        color="#f3971b"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </div>
  );
};

export default ProgressBarRouting;
