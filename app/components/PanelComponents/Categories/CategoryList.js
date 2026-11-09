"use client";
import React, { useEffect, useState, useMemo } from "react";
import PanelHead from "../../PanelHead/PanelHead";
import DataTable from "../../DataTable/DataTable";
import {
  deleteCategoryCollections,
  getCategoryCollections,
} from "@/app/database/firebaseConfig";
import PageLoader from "../../PageLoader/PageLoader";
import { Modal } from "react-bootstrap";
import Button from "../../Button/Button";
import NotFound from "../../NotFound/NotFound";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { fetchCategories } from "@/src/store/slices/categorySlice";
import { invalidateDashboardCache } from "@/src/store/slices/dashboardSlice";
import { FiSearch, FiLayers, FiTag, FiPlus } from "react-icons/fi";
import { toast } from "react-toastify";
import { toastStyle } from "@/app/_method/utils";
import Link from "next/link";

const CategoryList = () => {
  const dispatch = useAppDispatch();
  const reduxCategories = useAppSelector((state) => state.categories?.items || []);
  const [categoryItems, setCategoryItems] = useState([]);
  const [loader, setLoader] = useState(false);
  const [loaderDelete, setLoaderDelete] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [dataId, setDataId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const router = useRouter();

  // Load from Redux or fetch from Firebase
  useEffect(() => {
    if (reduxCategories.length > 0) {
      setCategoryItems(reduxCategories);
    } else {
      loadCategories();
    }
  }, [reduxCategories]);

  const loadCategories = async () => {
    try {
      setLoader(true);
      const items = await getCategoryCollections();
      setCategoryItems(items);
      dispatch(fetchCategories());
    } catch (error) {
      console.error("Error fetching category items:", error);
      toast.error("Failed to load categories", toastStyle);
    } finally {
      setLoader(false);
    }
  };

  const handleDeleteClose = () => {
    setShowDelete(false);
    setDataId("");
    setCategoryName("");
  };

  const handleUpdate = (id) => {
    router.push(`/panel/categories/add-new-category?id=${id}`);
  };

  const handleDelete = (id) => {
    const selectedCategory = categoryItems.find((item) => item.id === id);
    setDataId(id);
    setCategoryName(selectedCategory?.category_name || "this category");
    setShowDelete(true);
  };

  const confirmDelete = async () => {
    try {
      setLoaderDelete(true);
      await deleteCategoryCollections(dataId);
      setCategoryItems((prev) => prev.filter((item) => item.id !== dataId));
      dispatch(fetchCategories());
      dispatch(invalidateDashboardCache());
      toast.success("Category deleted successfully", toastStyle);
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category", toastStyle);
    } finally {
      setLoaderDelete(false);
      handleDeleteClose();
    }
  };

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return categoryItems.filter((item) => {
      const matchesSearch =
        !searchTerm.trim() ||
        (item.category_name &&
          item.category_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.category_slug &&
          item.category_slug.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesType =
        typeFilter === "ALL" ||
        (typeFilter === "POPULAR" && item.category_type === "Most Popular") ||
        (typeFilter === "STANDARD" && item.category_type !== "Most Popular");

      return matchesSearch && matchesType;
    });
  }, [categoryItems, searchTerm, typeFilter]);

  const columns = [
    { key: "imageUrls", label: "Category Image" },
    { key: "category_name", label: "Category Name" },
    { key: "category_slug", label: "Category Slug" },
    { key: "category_type", label: "Category Type" },
    { key: "action", label: "Action", width: "150px" },
  ];

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
          <Modal.Title style={{ fontSize: "17px", fontWeight: "700", color: "#0f172a" }}>
            Delete Category
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontSize: "14px", color: "#475569", lineHeight: "1.6" }}>
          Are you sure you want to delete category{" "}
          <strong style={{ color: "#0f172a" }}>&ldquo;{categoryName}&rdquo;</strong>?
          This action cannot be undone and will affect associated products.
        </Modal.Body>
        <Modal.Footer style={{ borderTop: "1px solid #f1f5f9" }}>
          <div className="modal_footer_buttons">
            <Button btnTitle="Cancel" onClick={handleDeleteClose} />
            <Button
              btnTitle="Yes, Delete"
              className="delete_button"
              onClick={confirmDelete}
              isLoading={loaderDelete}
            />
          </div>
        </Modal.Footer>
      </Modal>

      <div>
        <PanelHead
          tittle="Categories"
          btnLinkTitle="Add New Category"
          btnLink="/panel/categories/add-new-category"
        />

        <div className="admin_form_card" style={{ marginTop: "18px" }}>
          {/* Top Filter & Count Bar */}
          <div className="admin_filter_toolbar">
            <div className="admin_filter_search">
              <FiSearch className="admin_filter_search_icon" />
              <input
                type="text"
                placeholder="Search categories by name or slug..."
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

            <div className="admin_filter_actions">
              <div className="admin_filter_tabs">
                <button
                  type="button"
                  onClick={() => setTypeFilter("ALL")}
                  className={`admin_filter_tab ${typeFilter === "ALL" ? "active" : ""}`}
                >
                  All ({categoryItems.length})
                </button>
                <button
                  type="button"
                  onClick={() => setTypeFilter("POPULAR")}
                  className={`admin_filter_tab ${typeFilter === "POPULAR" ? "active" : ""}`}
                >
                  Most Popular ({categoryItems.filter((c) => c.category_type === "Most Popular").length})
                </button>
              </div>

              <Link
                href="/panel/categories/add-new-category"
                className="admin_quick_add_btn"
              >
                <FiPlus size={15} /> Add Category
              </Link>
            </div>
          </div>

          {/* Table Container */}
          <div className="data_table category_data_table" style={{ marginTop: "15px" }}>
            {loader ? (
              <PageLoader />
            ) : filteredCategories.length === 0 ? (
              <div style={{ padding: "40px 20px", textAlign: "center" }}>
                <NotFound />
                {searchTerm && (
                  <p style={{ marginTop: "10px", fontSize: "14px", color: "#64748b" }}>
                    No categories found matching &ldquo;{searchTerm}&rdquo;
                  </p>
                )}
              </div>
            ) : (
              <DataTable
                data={filteredCategories}
                columns={columns}
                rowsPerPage={10}
                onEdit={handleUpdate}
                onDelete={handleDelete}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryList;
