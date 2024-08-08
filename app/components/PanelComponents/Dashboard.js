"use client";
import React from "react";
import useAuthRedirect from "../useAuthRedirect/useAuthRedirect";

const Dashboard = () => {
  const { user, loading } = useAuthRedirect();

  return <div>Dashboard</div>;
};

export default Dashboard;
