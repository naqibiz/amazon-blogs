"use client";
import React, { useEffect, useState, useMemo } from "react";
import { getContactUs } from "@/app/database/firebaseConfig";
import PanelHead from "../PanelHead/PanelHead";
import PageLoader from "../PageLoader/PageLoader";
import NotFound from "../NotFound/NotFound";
import { Modal } from "react-bootstrap";
import Button from "../Button/Button";
import { FiMail, FiSearch, FiCalendar, FiUser, FiMessageSquare } from "react-icons/fi";

const ContactusList = () => {
  const [contactList, setContactList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    const fetchContactUsList = async () => {
      try {
        setLoader(true);
        const items = await getContactUs();
        setContactList(items || []);
      } catch (error) {
        console.error("Error fetching contact:", error);
      } finally {
        setLoader(false);
      }
    };
    fetchContactUsList();
  }, []);

  // Filter messages
  const filteredContacts = useMemo(() => {
    if (!searchTerm.trim()) return contactList;
    const term = searchTerm.toLowerCase();
    return contactList.filter(
      (c) =>
        (c.fullname && c.fullname.toLowerCase().includes(term)) ||
        (c.email && c.email.toLowerCase().includes(term)) ||
        (c.message && c.message.toLowerCase().includes(term))
    );
  }, [contactList, searchTerm]);

  return (
    <>
      {/* View Message Modal */}
      <Modal
        show={!!selectedMessage}
        onHide={() => setSelectedMessage(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "17px", fontWeight: "700", color: "#0f172a" }}>
            Message from {selectedMessage?.fullname || "Customer"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontSize: "14px", color: "#334155" }}>
          <div style={{ marginBottom: "14px", paddingBottom: "12px", borderBottom: "1px solid #f1f5f9" }}>
            <p style={{ margin: "0 0 6px 0", color: "#64748b", fontSize: "13px" }}>
              <strong>Email:</strong>{" "}
              <a href={`mailto:${selectedMessage?.email}`} style={{ color: "#f3971b" }}>
                {selectedMessage?.email}
              </a>
            </p>
            <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>
              <strong>Received:</strong>{" "}
              {selectedMessage?.createdAt
                ? new Date(selectedMessage.createdAt).toLocaleString()
                : "N/A"}
            </p>
          </div>
          <div>
            <strong style={{ color: "#0f172a", display: "block", marginBottom: "8px" }}>
              Message:
            </strong>
            <div
              style={{
                background: "#f8fafc",
                padding: "14px",
                borderRadius: "8px",
                whiteSpace: "pre-wrap",
                lineHeight: "1.6",
                color: "#1e293b",
                border: "1px solid #e2e8f0",
              }}
            >
              {selectedMessage?.message}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button btnTitle="Close" onClick={() => setSelectedMessage(null)} />
          {selectedMessage?.email && (
            <a
              href={`mailto:${selectedMessage.email}?subject=Reply to your inquiry on ItemzFinder`}
              className="admin_quick_add_btn"
              style={{ textDecoration: "none" }}
            >
              Reply via Email
            </a>
          )}
        </Modal.Footer>
      </Modal>

      <div>
        <PanelHead tittle="Contact Inquiries" />

        <div className="admin_form_card" style={{ marginTop: "18px" }}>
          <div className="admin_form_header">
            <div>
              <h3 className="admin_form_title">
                <FiMail style={{ marginRight: "8px", color: "#f3971b" }} />
                Customer Messages
              </h3>
              <p className="admin_form_subtitle">
                Review inquiries submitted from the website Contact Us page
              </p>
            </div>
            <span className="admin_nav_count_badge">
              {contactList.length} Total {contactList.length === 1 ? "Inquiry" : "Inquiries"}
            </span>
          </div>

          {/* Search Toolbar */}
          <div className="admin_filter_toolbar" style={{ marginTop: "16px" }}>
            <div className="admin_filter_search" style={{ maxWidth: "420px" }}>
              <FiSearch className="admin_filter_search_icon" />
              <input
                type="text"
                placeholder="Search by name, email, or message..."
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

          {/* Table Container */}
          <div className="custom_data_table" style={{ marginTop: "18px" }}>
            {loader ? (
              <PageLoader />
            ) : filteredContacts.length === 0 ? (
              <div style={{ padding: "40px 20px", textAlign: "center" }}>
                <NotFound />
                {searchTerm && (
                  <p style={{ marginTop: "10px", fontSize: "14px", color: "#64748b" }}>
                    No inquiries matching &ldquo;{searchTerm}&rdquo;
                  </p>
                )}
              </div>
            ) : (
              <table className="table table-hover" style={{ verticalAlign: "middle" }}>
                <thead className="data_table_head">
                  <tr>
                    <th style={{ width: "200px" }}>Full Name</th>
                    <th style={{ width: "240px" }}>Email</th>
                    <th>Message Snippet</th>
                    <th style={{ width: "140px" }}>Date</th>
                    <th style={{ width: "120px", textAlign: "center" }}>Action</th>
                  </tr>
                </thead>
                <tbody className="data_table_body">
                  {filteredContacts.map((item) => (
                    <tr key={item.id}>
                      <td style={{ fontWeight: "600", color: "#0f172a" }}>
                        {item.fullname || "Anonymous"}
                      </td>
                      <td>
                        <a
                          href={`mailto:${item.email}`}
                          style={{ color: "#3b82f6", textDecoration: "none" }}
                        >
                          {item.email}
                        </a>
                      </td>
                      <td style={{ color: "#475569", maxWidth: "320px" }}>
                        <div
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.message}
                        </div>
                      </td>
                      <td style={{ fontSize: "13px", color: "#64748b" }}>
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <button
                          type="button"
                          className="admin_table_btn"
                          onClick={() => setSelectedMessage(item)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactusList;
