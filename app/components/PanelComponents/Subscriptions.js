"use client";
import React, { useEffect, useState } from "react";
import {
  getSubscription,
  updateSubscription,
} from "@/app/database/firebaseConfig";
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
    { key: "validity", label: "Validity" },
  ];

  const formattedsubscriptions = subscriptions.map((item) => ({
    ...item,
    createdAt: item.createdAt ? new Date(item.createdAt).toDateString() : "N/A",
  }));

  const handleValidityToggle = async (id) => {
    const selectedItem = subscriptions.find((item) => item.id === id);
    if (!selectedItem) return;

    const newValidity =
      selectedItem.validity === "Active" ? "InActive" : "Active";

    try {
      await updateSubscription(id, { validity: newValidity });

      const updatedList = subscriptions.map((item) =>
        item.id === id ? { ...item, validity: newValidity } : item
      );
      setSubscription(updatedList);
    } catch (error) {
      console.error("Error updating subscription:", error);
    }
  };

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
              onValidity={handleValidityToggle}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Subscriptions;
