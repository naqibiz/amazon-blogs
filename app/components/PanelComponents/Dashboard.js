"use client";
import React, { useEffect } from "react";
import Overview from "../Overview/Overview";
import { Col, Row } from "react-bootstrap";
import SkeletonLoader from "../SkeletonLoader/SkeletonLoader";
import Link from "next/link";
import { FaPlus, FaArrowRotateRight } from "react-icons/fa6";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchDashboardOverview } from "@/store/slices/dashboardSlice";

const CACHE_DURATION = 3 * 60 * 1000; // 3 minutes cache

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { data: overviewData, isLoading: loader, lastFetched } = useAppSelector(
    (state) => state.dashboard
  );

  useEffect(() => {
    const isCacheExpired = !lastFetched || Date.now() - lastFetched > CACHE_DURATION;
    if (isCacheExpired && !overviewData) {
      dispatch(fetchDashboardOverview());
    }
  }, [dispatch, lastFetched, overviewData]);

  const handleRefresh = () => {
    dispatch(fetchDashboardOverview());
  };

  const overviewItems = [
    { title: "Users", data: overviewData?.users },
    { title: "Categories", data: overviewData?.categories?.all },
    {
      title: "Most Popular Categories",
      data: overviewData?.categories?.mostPopular,
    },
    { title: "Products", data: overviewData?.products?.all },
    {
      title: "Most Popular Products",
      data: overviewData?.products?.mostPopular,
    },
    { title: "Contact Us", data: overviewData?.contactUs },
    { title: "Subscriptions", data: overviewData?.subscriptions },
  ];

  return (
    <div className="dashboard_content_wrapper">
      {/* Modern Compact Welcome Header */}
      <div className="admin_dashboard_hero">
        <div className="hero_text">
          <h2>Welcome to ItemzFinder Admin 👋</h2>
          <p>
            Monitor activity records, manage live products, categories, and customer interactions in real time.
          </p>
        </div>
        <div className="hero_actions">
          <Link href="/panel/products/add-new-product" className="hero_btn primary">
            <FaPlus size={14} />
            <span>Add Product</span>
          </Link>
          <Link href="/panel/categories/add-new-category" className="hero_btn secondary">
            <FaPlus size={14} />
            <span>Add Category</span>
          </Link>
          <button
            className={`hero_btn icon_only ${loader ? "spinning" : ""}`}
            onClick={handleRefresh}
            title="Refresh Data"
          >
            <FaArrowRotateRight size={14} />
          </button>
        </div>
      </div>

      <div className="dashboard_section_header">
        <div>
          <h3>Activity Record Overview</h3>
          <p className="subtitle">Real-time statistics across all collections</p>
        </div>
      </div>

      <div className="overview_box_grid_wrapper">
        <Row>
          {loader && !overviewData ? (
            <>
              {[1, 2, 3, 4, 5, 6, 7]?.map((val, i) => (
                <Col key={i} lg={4} md={6} sm={12} className="mb-4">
                  <div className="overview_skeleton_card">
                    <SkeletonLoader height={140} borderRadius={14} />
                  </div>
                </Col>
              ))}
            </>
          ) : (
            <>
              {overviewItems.map(
                ({ title, data }) =>
                  data && (
                    <Col key={title} lg={4} md={6} sm={12} className="mb-4">
                      <Overview title={title} data={data} />
                    </Col>
                  )
              )}
            </>
          )}
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;
