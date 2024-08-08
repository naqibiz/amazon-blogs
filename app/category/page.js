import React from "react";
import Categories from "../components/Categories/Categories";

const categoryIndex = ({ searchParams }) => {
  return (
    <div className="middle_content">
      <Categories data={searchParams} />
    </div>
  );
};

export default categoryIndex;
