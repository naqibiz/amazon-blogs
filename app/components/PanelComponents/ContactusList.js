"use client";
import React, { useEffect, useState } from "react";
import { getContactUs } from "@/app/database/firebaseConfig";
import PanelHead from "../PanelHead/PanelHead";
import DataTable from "../DataTable/DataTable";
import PageLoader from "../PageLoader/PageLoader";
import NotFound from "../NotFound/NotFound";

const ContactusList = () => {
  const [contactList, setContactList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [isFetched, setIsFetched] = useState(false);

  console.log(contactList, "contactList");

  useEffect(() => {
    const fetchContactUsList = async () => {
      try {
        setLoader(true);
        const items = await getContactUs();
        setContactList(items);
      } catch (error) {
        console.error("Error fetching contact:", error);
      } finally {
        setLoader(false);
        setIsFetched(true);
      }
    };

    if (!isFetched) {
      fetchContactUsList();
    }
  }, [isFetched]);

  const columns = [
    { key: "fullname", label: "Full Name", width: "170px" },
    { key: "email", label: "Email" },
    { key: "message", label: "Message" },
    { key: "createdAt", label: "Date", width: "150px" },
  ];

  const formattedContactList = contactList.map((item) => ({
    ...item,
    createdAt: item.createdAt ? new Date(item.createdAt).toDateString() : "N/A",
  }));

  return (
    <>
      <div className="contactus_list">
        <PanelHead tittle="Contact" />

        <div className="data_table">
          {loader ? (
            <PageLoader />
          ) : contactList.length === 0 ? (
            <NotFound />
          ) : (
            <DataTable
              data={formattedContactList}
              columns={columns}
              rowsPerPage={10}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ContactusList;
