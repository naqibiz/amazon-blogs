"use client";
import { getDashboardOverview } from "@/app/database/firebaseConfig";
import React, { useEffect, useState } from "react";
import Overview from "../Overview/Overview";
import { Col, Row } from "react-bootstrap";
import SkeletonLoader from "../SkeletonLoader/SkeletonLoader";

const Dashboard = () => {
  const [loader, setLoader] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [overviewData, setOverviewData] = useState([]);

  console.log(overviewData, "overviewData===<>");

  useEffect(() => {
    const fetchDashboardOverview = async () => {
      try {
        setLoader(true);
        const data = await getDashboardOverview();
        setOverviewData(data);
      } catch (error) {
        console.error("Error fetching overview items:", error);
      } finally {
        setLoader(false);
        setIsFetched(true);
      }
    };

    if (!isFetched) {
      fetchDashboardOverview();
    }
  }, [isFetched]);

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
      <div className="welcome_banner_itemzfinder">
        <div
          className="banner"
          style={{
            backgroundImage: `url(/assets/images/welcome-itemzfiner.svg)`,
          }}
        ></div>
      </div>
      {loader ? (
        <div className="activity_record_overview">
          <SkeletonLoader width={400} height={50} />
        </div>
      ) : (
        <div className="activity_record_overview">
          <h1>Activity Record Overview</h1>
        </div>
      )}
      <div className="overview_box_grid_wrapper">
        <Row>
          {loader ? (
            <>
              {[1, 2, 3, 4, 5, 6, 7]?.map((val, i) => (
                <Col key={i} lg={4} md={4}>
                  <SkeletonLoader height={200} />
                </Col>
              ))}
            </>
          ) : (
            <>
              {overviewItems.map(
                ({ title, data }) =>
                  data && (
                    <Col key={title} lg={4} md={4}>
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
