"use client";
import { getDashboardOverview } from "@/app/database/firebaseConfig";
import React, { useEffect, useState } from "react";

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

  return <div>Dashboard</div>;
};

export default Dashboard;
