"use client";
import React, { useEffect, useState } from "react";
import { getSubscription } from "@/app/database/firebaseConfig";
import PanelHead from "../PanelHead/PanelHead";
import DataTable from "../DataTable/DataTable";
import PageLoader from "../PageLoader/PageLoader";
import NotFound from "../NotFound/NotFound";

const Subscriptions = () => {
  const [subscriptions, setSubscription] = useState([]);
  const [loader, setLoader] = useState(false);
  const [isFetched, setIsFetched] = useState(false);

  console.log(subscriptions, "subscriptions");

  useEffect(() => {
    const fetchSubscriptionList = async () => {
      try {
        setLoader(true);
        const items = await getSubscription();
        setSubscription(items);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      } finally {
        setLoader(false);
        setIsFetched(true);
      }
    };

    if (!isFetched) {
      fetchSubscriptionList();
    }
  }, [isFetched]);

  const columns = [
    { key: "email", label: "Email", width: "300px" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Date" },
  ];

  const formattedsubscriptions = subscriptions.map((item) => ({
    ...item,
    createdAt: item.createdAt ? new Date(item.createdAt).toDateString() : "N/A",
  }));

  return (
    <>
      <div className="contactus_list">
        <PanelHead tittle="Subscrption" />

        <div className="data_table">
          {loader ? (
            <PageLoader />
          ) : subscriptions.length === 0 ? (
            <NotFound />
          ) : (
            <DataTable
              data={formattedsubscriptions}
              columns={columns}
              rowsPerPage={10}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Subscriptions;
