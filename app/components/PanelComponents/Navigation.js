"use client";
import React, { useEffect, useState } from "react";
import PanelHead from "../PanelHead/PanelHead";
import { Col, Container, Form, Modal, Row } from "react-bootstrap";
import InputFormControl from "../InputFormControl/InputFormControl";
import Button from "../Button/Button";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { LuRefreshCw } from "react-icons/lu";

import {
  addNavigation,
  deleteNavigationItem,
  getCategoryCollections,
  getNavigationItems,
  updateNavigationItem,
} from "@/app/database/firebaseConfig";
import Dropdown from "../Dropdown/Dropdown";
import PageLoader from "../PageLoader/PageLoader";

const Navigation = () => {
  const [form, setForm] = useState({
    category: "",
    nav_name: "",
  });
  const [loading, setLoading] = useState(false);
  const [navLoading, setNavLoading] = useState(false);
  const [navigationItems, setNavigationItems] = useState([]);
  const [categoryItems, setCategoryItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [updateStatus, setUpdateStatus] = useState(false);
  const [loaderDelete, setLoaderDelete] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [dataId, setDataId] = useState("");
  const [navigationName, setNavigationName] = useState("");

  const categoryTypeSlug = form.category
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setNavLoading(true);
        const [navItems, catItems] = await Promise.all([
          getNavigationItems(),
          getCategoryCollections(),
        ]);
        setNavigationItems(navItems);
        setCategoryItems(catItems);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setNavLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  console.log(categoryItems, "categoryItems==<>");

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDeleteClose = () => setShowDelete(false);

  const openDeleteModal = (id) => {
    const selectedNavigation = navigationItems.find((item) => item.id === id);
    setDataId(id);
    setNavigationName(selectedNavigation?.nav_name || "");
    setShowDelete(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const selectedCategory = categoryItems.find(
      (item) => item.category_name === form.category
    );

    if (editingId) {
      await updateNavigationItem(editingId, {
        ...form,
        category_type: categoryTypeSlug,
        type: selectedCategory?.category_type,
      });
      setEditingId(null);
      setUpdateStatus(false);
    } else {
      await addNavigation({
        nav_name: form.nav_name,
        category: form.category,
        category_type: categoryTypeSlug,
        type: selectedCategory?.category_type,
      });
    }

    setForm({
      nav_name: "",
      category: "",
    });
    fetchNavigationItems();

    setLoading(false);
    fetchNavigationItems();
  };

  const handleUpdate = (item) => {
    setForm({
      nav_name: item.nav_name,
      category: item.category,
      category_type: categoryTypeSlug,
    });
    setEditingId(item.id);
    setUpdateStatus(true);
  };

  const confirmDelete = async () => {
    try {
      setLoaderDelete(true);
      await deleteNavigationItem(dataId);
      setNavigationItems(navigationItems.filter((item) => item.id !== dataId));
    } catch (error) {
      console.error("Error deleting navigation:", error);
    } finally {
      setLoaderDelete(false);
      handleDeleteClose();
    }
  };

  const handleReset = () => {
    setForm({
      nav_name: "",
      category: "",
      category_type: "",
    });
    setEditingId(null);
    setUpdateStatus(false);
  };

  const fetchNavigationItems = async () => {
    setNavLoading(true);
    try {
      const items = await getNavigationItems();
      setNavigationItems(items);
    } catch (error) {
      console.error("Error fetching navigation items:", error);
    } finally {
      setNavLoading(false);
    }
  };

  return (
    <>
      <Modal
        show={showDelete}
        onHide={handleDeleteClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>Delete Navigation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this navigation{" "}
          <strong>{navigationName}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <div className="modal_footer_buttons">
            <Button btnTitle={`No`} onClick={handleDeleteClose} />
            <Button
              btnTitle={`Yes`}
              className="delete_button"
              onClick={confirmDelete}
              isLoading={loaderDelete}
            />
          </div>
        </Modal.Footer>
      </Modal>

      <div>
        <PanelHead tittle="Navigations" />
        <div className="navigation_wrapper panel_middle_content">
          <Row>
            <Col lg={6}>
              <Form onSubmit={handleSubmit}>
                <Dropdown
                  label="Select Category"
                  searchable={true}
                  searchPlaceholder="Search categories"
                  selectedValue={form.category}
                  setSelectedValue={(selectedCategory) =>
                    setForm((prev) => ({
                      ...prev,
                      category: selectedCategory?.category_name,
                    }))
                  }
                  data={categoryItems}
                  searchKey="category_name"
                  displayKey="category_name"
                />

                <InputFormControl
                  required={true}
                  label="Category Type"
                  type="text"
                  name="category_type"
                  value={categoryTypeSlug}
                  readOnly
                />

                <InputFormControl
                  required={true}
                  label="Navigation Name"
                  type="text"
                  name="nav_name"
                  onChange={handleFormChange}
                  value={form.nav_name}
                />

                <Button
                  btnTitle={`${
                    updateStatus
                      ? "Update Navigation Menu"
                      : "Add Navigation Menu"
                  }`}
                  type="submit"
                  isLoading={loading}
                />
              </Form>
            </Col>
            <Col lg={6}>
              {navLoading ? (
                <PageLoader />
              ) : (
                <div className="navigation_menu_list_wrapper">
                  {navigationItems && navigationItems?.length > 0 ? (
                    <div className="navigation_menu_list">
                      {navigationItems &&
                        navigationItems?.map((item, i) => (
                          <>
                            {console.log(item, "item===<>")}
                            <div className="nav_menu" key={i}>
                              <div className="nav_menu_inner">
                                <p className="menu_name">{item?.nav_name}</p>
                                <p className="menu_name menu_category">
                                  {item?.category}
                                </p>
                              </div>
                              {item?.type === "Most Popular" && (
                                <div className="category_type_nav">
                                  <p>{item?.type}</p>
                                </div>
                              )}
                              <div className="menu_action">
                                <div className="action" onClick={handleReset}>
                                  <LuRefreshCw size={18} strokeWidth="2.5" />
                                </div>
                                <div
                                  className="action"
                                  onClick={() => handleUpdate(item)}
                                >
                                  <FaEdit size={17} />
                                </div>
                                <div
                                  className="action"
                                  onClick={() => openDeleteModal(item?.id)}
                                >
                                  <FaTrashAlt size={17} />
                                </div>
                              </div>
                            </div>
                          </>
                        ))}
                    </div>
                  ) : (
                    <div className="empty_list_placeholder">
                      <img src="/assets/images/empty_list.svg" alt="" />
                    </div>
                  )}
                </div>
              )}
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default Navigation;
