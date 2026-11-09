"use client";
import React, { useEffect, useState } from "react";
import PanelHead from "../PanelHead/PanelHead";
import { Col, Form, Modal, Row } from "react-bootstrap";
import InputFormControl from "../InputFormControl/InputFormControl";
import Button from "../Button/Button";
import { FaTrashAlt, FaEdit, FaPlus, FaCheck } from "react-icons/fa";
import { LuRefreshCw, LuCompass } from "react-icons/lu";
import { MdOutlineCategory } from "react-icons/md";
import {
  addNavigation,
  deleteNavigationItem,
  getCategoryCollections,
  getNavigationItems,
  updateNavigationItem,
} from "@/app/database/firebaseConfig";
import Dropdown from "../Dropdown/Dropdown";
import PageLoader from "../PageLoader/PageLoader";
import { useAppDispatch } from "@/store/hooks";
import { fetchNavigations } from "@/store/slices/navSlice";

const Navigation = () => {
  const dispatch = useAppDispatch();
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
    ? form.category.trim().replace(/\s+/g, "-").toLowerCase()
    : "";

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

    await refreshNavList();
    dispatch(fetchNavigations());
    setLoading(false);
  };

  const handleUpdate = (item) => {
    setForm({
      nav_name: item.nav_name,
      category: item.category,
    });
    setEditingId(item.id);
    setUpdateStatus(true);
  };

  const confirmDelete = async () => {
    try {
      setLoaderDelete(true);
      await deleteNavigationItem(dataId);
      setNavigationItems(navigationItems.filter((item) => item.id !== dataId));
      dispatch(fetchNavigations());
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
    });
    setEditingId(null);
    setUpdateStatus(false);
  };

  const refreshNavList = async () => {
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
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Navigation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete navigation menu item{" "}
          <strong>&ldquo;{navigationName}&rdquo;</strong>? This will remove it from the live website header.
        </Modal.Body>
        <Modal.Footer>
          <Button btnTitle="Cancel" onClick={handleDeleteClose} />
          <Button
            btnTitle="Delete"
            className="delete_button"
            onClick={confirmDelete}
            isLoading={loaderDelete}
          />
        </Modal.Footer>
      </Modal>

      <div className="panel_navigation_page">
        <PanelHead tittle="Storefront Navigations" />

        <div className="navigation_wrapper panel_middle_content">
          <Row>
            {/* Left Column: Create / Edit Form Card */}
            <Col lg={5} md={12} className="mb-4">
              <div className="admin_form_card">
                <div className="admin_card_header">
                  <div className="d-flex align-items-center gap-2">
                    <LuCompass size={20} color="#f3971b" />
                    <h4>
                      {updateStatus
                        ? "Edit Navigation Menu"
                        : "Create Navigation Menu"}
                    </h4>
                  </div>
                  <p>
                    {updateStatus
                      ? "Update the details for this navigation link."
                      : "Add a category link to the storefront top navigation bar."}
                  </p>
                </div>

                <Form onSubmit={handleSubmit} className="admin_card_body">
                  <div className="form_group_field">
                    <Dropdown
                      label="Linked Category"
                      searchable={true}
                      searchPlaceholder="Search categories..."
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
                  </div>

                  <div className="form_group_field">
                    <InputFormControl
                      required={true}
                      label="Category Slug (Auto Generated)"
                      type="text"
                      name="category_type"
                      value={categoryTypeSlug}
                      readOnly
                      placeholder="e.g. women-clothes"
                    />
                  </div>

                  <div className="form_group_field">
                    <InputFormControl
                      required={true}
                      label="Menu Display Name"
                      type="text"
                      name="nav_name"
                      onChange={handleFormChange}
                      value={form.nav_name}
                      placeholder="e.g. Women Fashion"
                    />
                  </div>

                  <div className="admin_card_actions d-flex gap-2 mt-4">
                    <Button
                      btnTitle={
                        updateStatus ? "Save Changes" : "+ Add to Navigation"
                      }
                      type="submit"
                      isLoading={loading}
                    />
                    {updateStatus && (
                      <button
                        type="button"
                        className="btn_cancel_edit"
                        onClick={handleReset}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </Form>
              </div>
            </Col>

            {/* Right Column: Active Navigation List Card */}
            <Col lg={7} md={12}>
              <div className="admin_form_card">
                <div className="admin_card_header d-flex justify-content-between align-items-center">
                  <div>
                    <h4>Active Menu Links</h4>
                    <p>Current items appearing in the storefront navigation bar</p>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="count_pill_badge">
                      {navigationItems.length} Links
                    </span>
                    <button
                      className="btn_table_refresh"
                      onClick={refreshNavList}
                      title="Refresh List"
                    >
                      <LuRefreshCw size={14} />
                    </button>
                  </div>
                </div>

                <div className="admin_card_body">
                  {navLoading ? (
                    <PageLoader />
                  ) : navigationItems && navigationItems?.length > 0 ? (
                    <div className="admin_nav_items_list">
                      {navigationItems.map((item, i) => (
                        <div className="admin_nav_item_card" key={item.id || i}>
                          <div className="nav_card_left">
                            <div className="nav_card_icon">
                              <LuCompass size={18} />
                            </div>
                            <div className="nav_card_info">
                              <p className="item_name">{item?.nav_name}</p>
                              <div className="item_meta d-flex align-items-center gap-2">
                                <span className="cat_name">
                                  <MdOutlineCategory size={13} />
                                  {item?.category || "Uncategorized"}
                                </span>
                                {item?.type === "Most Popular" && (
                                  <span className="popular_badge">
                                    ★ Most Popular
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="nav_card_actions d-flex align-items-center gap-2">
                            <button
                              type="button"
                              className="action_btn edit"
                              onClick={() => handleUpdate(item)}
                              title="Edit"
                            >
                              <FaEdit size={14} />
                            </button>
                            <button
                              type="button"
                              className="action_btn delete"
                              onClick={() => openDeleteModal(item?.id)}
                              title="Delete"
                            >
                              <FaTrashAlt size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty_nav_state text-center py-5">
                      <LuCompass size={40} color="#cbd5e1" className="mb-2" />
                      <p className="fw-semibold text-secondary mb-1">
                        No Navigation Items Found
                      </p>
                      <small className="text-muted">
                        Use the form on the left to add your first menu link.
                      </small>
                    </div>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default Navigation;
