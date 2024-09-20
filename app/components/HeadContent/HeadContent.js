"use client";
import React, { useEffect } from "react";

const HeadContent = ({ data, title }) => {
  useEffect(() => {
    console.log(data, "head inner data");
  }, [data]);

  return (
    <div className="head_inner_page_wrapper">
      <div className="head_inner_page_wrapper_content">
        {data ? (
          <p className="title">{data?.name}</p>
        ) : (
          <p className="title">{title}</p>
        )}
      </div>
    </div>
  );
};

export default HeadContent;
