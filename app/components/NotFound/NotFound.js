import React from "react";
import { FaClipboardList } from "react-icons/fa6";

const NotFound = () => {
  return (
    <div className="record_not_found">
      <div className="record_not_found_content">
        <FaClipboardList size={60} />
        <p>Record Not Found</p>
      </div>
    </div>
  );
};

export default NotFound;
