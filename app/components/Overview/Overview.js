"use client";
import React from "react";
import Link from "next/link";
import { FaUsers, FaArrowRight } from "react-icons/fa6";
import {
  MdOutlineCategory,
  MdProductionQuantityLimits,
  MdOutlineContacts,
  MdOutlineSubscriptions,
} from "react-icons/md";

const METRIC_CONFIG = {
  Users: {
    icon: <FaUsers size={24} />,
    color: "#3b82f6",
    bgColor: "rgba(59, 130, 246, 0.12)",
    link: "/panel/add-user",
    linkText: "View Users",
  },
  Categories: {
    icon: <MdOutlineCategory size={24} />,
    color: "#10b981",
    bgColor: "rgba(16, 185, 129, 0.12)",
    link: "/panel/categories",
    linkText: "Manage Categories",
  },
  "Most Popular Categories": {
    icon: <MdOutlineCategory size={24} />,
    color: "#f59e0b",
    bgColor: "rgba(245, 158, 11, 0.12)",
    link: "/panel/categories",
    linkText: "View Popular",
  },
  Products: {
    icon: <MdProductionQuantityLimits size={24} />,
    color: "#6366f1",
    bgColor: "rgba(99, 102, 241, 0.12)",
    link: "/panel/products",
    linkText: "Manage Products",
  },
  "Most Popular Products": {
    icon: <MdProductionQuantityLimits size={24} />,
    color: "#ec4899",
    bgColor: "rgba(236, 72, 153, 0.12)",
    link: "/panel/products",
    linkText: "View Popular",
  },
  "Contact Us": {
    icon: <MdOutlineContacts size={24} />,
    color: "#8b5cf6",
    bgColor: "rgba(139, 92, 246, 0.12)",
    link: "/panel/contacts",
    linkText: "View Messages",
  },
  Subscriptions: {
    icon: <MdOutlineSubscriptions size={24} />,
    color: "#14b8a6",
    bgColor: "rgba(20, 184, 166, 0.12)",
    link: "/panel/subscription",
    linkText: "View Subscribers",
  },
};

const Overview = ({ title, data }) => {
  const config = METRIC_CONFIG[title] || {
    icon: <MdOutlineCategory size={24} />,
    color: "#f3971b",
    bgColor: "rgba(243, 151, 27, 0.12)",
    link: "/panel/dashboard",
    linkText: "View Details",
  };

  const count = Array.isArray(data) ? data.length : 0;

  return (
    <div className="overview_box_grid">
      <div className="overview_box_content">
        <div className="box_content_top">
          <div
            className="metric_icon_badge"
            style={{ color: config.color, backgroundColor: config.bgColor }}
          >
            {config.icon}
          </div>
          <div className="metric_info">
            <p className="title">{title}</p>
            <h3 className="count">{count}</h3>
          </div>
        </div>

        <div className="box_content_bottom">
          <Link href={config.link} className="metric_link">
            <span>{config.linkText}</span>
            <FaArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Overview;
