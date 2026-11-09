"use client";
import React, { useEffect, useState, useMemo } from "react";
import {
  getSubscription,
  updateSubscription,
} from "@/app/database/firebaseConfig";
import PanelHead from "../PanelHead/PanelHead";
import PageLoader from "../PageLoader/PageLoader";
import NotFound from "../NotFound/NotFound";
import { FiUsers, FiSearch, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { toast } from "react-toastify";
import { toastStyle } from "@/app/_method/utils";

const Subscriptions = () => {
  const [subscriptions, setSubscription] = useState([]);
  const [loader, setLoader] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchSubscriptionList = async () => {
      try {
        setLoader(true);
        const items = await getSubscription();
        setSubscription(items || []);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      } finally {
        setLoader(false);
      }
    };
    fetchSubscriptionList();
  }, []);

  const handleValidityToggle = async (id) => {
    const selectedItem = subscriptions.find((item) => item.id === id);
    if (!selectedItem) return;

    const newValidity =
      selectedItem.validity === "Active" ? "InActive" : "Active";

    try {
      setUpdatingId(id);
      await updateSubscription(id, { validity: newValidity });

      setSubscription((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, validity: newValidity } : item
        )
      );
      toast.success(
        `Subscription marked as ${newValidity}`,
        toastStyle
      );
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast.error("Failed to update subscriber status", toastStyle);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredSubscriptions = useMemo(() => {
    if (!searchTerm.trim()) return subscriptions;
    const term = searchTerm.toLowerCase();
    return subscriptions.filter(
      (s) => s.email && s.email.toLowerCase().includes(term)
    );
  }, [subscriptions, searchTerm]);

  const activeCount = subscriptions.filter(
    (s) => s.validity === "Active"
  ).length;

  return (
    <div>
      <PanelHead tittle="Subscribers" />

      <div className="admin_form_card" style={{ marginTop: "18px" }}>
        <div className="admin_form_header">
          <div>
            <h3 className="admin_form_title">
              <FiUsers style={{ marginRight: "8px", color: "#f3971b" }} />
              Newsletter Subscriptions
            </h3>
            <p className="admin_form_subtitle">
              Manage emails registered to receive product updates and promotions
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <span className="admin_nav_count_badge">
              {activeCount} Active
            </span>
            <span
              className="admin_nav_count_badge"
              style={{ background: "#f1f5f9", color: "#475569", borderColor: "#cbd5e1" }}
            >
              {subscriptions.length} Total
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="admin_filter_toolbar" style={{ marginTop: "16px" }}>
          <div className="admin_filter_search" style={{ maxWidth: "380px" }}>
            <FiSearch className="admin_filter_search_icon" />
            <input
              type="text"
              placeholder="Search subscriber email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin_filter_input"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="admin_filter_clear"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="custom_data_table" style={{ marginTop: "18px" }}>
          {loader ? (
            <PageLoader />
          ) : filteredSubscriptions.length === 0 ? (
            <div style={{ padding: "40px 20px", textAlign: "center" }}>
              <NotFound />
              {searchTerm && (
                <p style={{ marginTop: "10px", fontSize: "14px", color: "#64748b" }}>
                  No subscriber found matching &ldquo;{searchTerm}&rdquo;
                </p>
              )}
            </div>
          ) : (
            <table className="table table-hover" style={{ verticalAlign: "middle" }}>
              <thead className="data_table_head">
                <tr>
                  <th>Subscriber Email</th>
                  <th style={{ width: "160px" }}>Status</th>
                  <th style={{ width: "160px" }}>Subscribed Date</th>
                  <th style={{ width: "150px", textAlign: "center" }}>Toggle Status</th>
                </tr>
              </thead>
              <tbody className="data_table_body">
                {filteredSubscriptions.map((item) => {
                  const isActive = item.validity === "Active";
                  const isBusy = updatingId === item.id;
                  return (
                    <tr key={item.id}>
                      <td style={{ fontWeight: "600", color: "#0f172a" }}>
                        <a
                          href={`mailto:${item.email}`}
                          style={{ color: "#0f172a", textDecoration: "none" }}
                        >
                          {item.email}
                        </a>
                      </td>
                      <td>
                        <span
                          className={`admin_status_pill ${
                            isActive ? "active" : "inactive"
                          }`}
                        >
                          <span className="admin_status_dot" />
                          {isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td style={{ fontSize: "13px", color: "#64748b" }}>
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleValidityToggle(item.id)}
                          className={`admin_toggle_btn ${
                            isActive ? "btn_deactivate" : "btn_activate"
                          }`}
                        >
                          {isBusy
                            ? "Updating..."
                            : isActive
                            ? "Deactivate"
                            : "Activate"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;
