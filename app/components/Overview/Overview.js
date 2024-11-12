"use client";
import React from "react";

const Overview = ({ title, data }) => {
  return (
    <div className="overview_box_grid">
      <div className="overview_box_content">
        <div className="box_content_head">
          <p className="title">{title}</p>
        </div>
        <div className="status_detail">
          <div className="count_main">
            <p className="count">{data?.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
