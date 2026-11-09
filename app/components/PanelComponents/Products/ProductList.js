"use client";
import React, { useEffect, useState, useMemo } from "react";
import PanelHead from "../../PanelHead/PanelHead";
import { deleteProduct, getProducts, getCategoryCollections } from "@/app/database/firebaseConfig";
import DataTable from "../../DataTable/DataTable";
import NotFound from "../../NotFound/NotFound";
import PageLoader from "../../PageLoader/PageLoader";
import { useRouter } from "next/navigation";
import { Modal } from "react-bootstrap";
import Button from "../../Button/Button";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { fetchProducts } from "@/src/store/slices/productSlice";
import { invalidateDashboardCache } from "@/src/store/slices/dashboardSlice";
import { FiSearch, FiShoppingBag, FiTag, FiPlus, FiFilter } from "react-icons/fi";
import { toast } from "react-toastify";
import { toastStyle } from "@/app/_method/utils";
import Link from "next/link";

const ProductList = () => {
  const dispatch = useAppDispatch();
  const reduxProducts = useAppSelector((state) => state.products?.items || []);
  const [productItems, setProductItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loader, setLoader] = useState(false);
  const [loaderDelete, setLoaderDelete] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [dataId, setDataId] = useState("");
  const [productName, setProductName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const router = useRouter();

  // Sync with Redux or fetch
  useEffect(() => {
    if (reduxProducts.length > 0) {
      setProductItems(reduxProducts);
    } else {
      loadProducts();
    }
  }, [reduxProducts]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const catList = await getCategoryCollections();
        setCategories(catList || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCats();
  }, []);

  const loadProducts = async () => {
    try {
      setLoader(true);
      const items = await getProducts();
      setProductItems(items || []);
      dispatch(fetchProducts());
    } catch (error) {
      console.error("Error fetching product items:", error);
      toast.error("Failed to load products", toastStyle);
    } finally {
      setLoader(false);
    }
  };

  const handleDeleteClose = () => {
    setShowDelete(false);
    setDataId("");
    setProductName("");
  };

  const handleUpdate = (id) => {
    router.push(`/panel/products/add-new-product?id=${id}`);
  };

  const handleDelete = (id) => {
    const selectedProduct = productItems.find((item) => item.id === id);
    setDataId(id);
    setProductName(selectedProduct?.product_title || "this product");
    setShowDelete(true);
  };

  const confirmDelete = async () => {
    try {
      setLoaderDelete(true);
      await deleteProduct(dataId);
      setProductItems((prev) => prev.filter((item) => item.id !== dataId));
      dispatch(fetchProducts());
      dispatch(invalidateDashboardCache());
      toast.success("Product deleted successfully", toastStyle);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product", toastStyle);
    } finally {
      setLoaderDelete(false);
      handleDeleteClose();
    }
  };

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return productItems.filter((item) => {
      const title = (item.product_title || "").toLowerCase();
      const sin = (item.product_number_sin || "").toLowerCase();
      const cat = (item.category || "").toLowerCase();
      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search || title.includes(search) || sin.includes(search) || cat.includes(search);

      const matchesCategory =
        selectedCategoryFilter === "ALL" ||
        item.category?.toLowerCase() === selectedCategoryFilter.toLowerCase();

      const matchesType =
        typeFilter === "ALL" ||
        (typeFilter === "POPULAR" && item.product_type === "Most Popular") ||
        (typeFilter === "STANDARD" && item.product_type !== "Most Popular");

      return matchesSearch && matchesCategory && matchesType;
    });
  }, [productItems, searchTerm, selectedCategoryFilter, typeFilter]);

  const columns = [
    { key: "imageUrls", label: "Product Image" },
    { key: "product_title", label: "Product Name", width: "260px" },
    { key: "category", label: "Category" },
    { key: "product_price", label: "Price" },
    { key: "product_type", label: "Product Type" },
    { key: "createdAt", label: "Date" },
    { key: "action", label: "Action" },
  ];

  const formattedProductList = filteredProducts.map((item) => ({
    ...item,
    product_price: item.product_price ? `$${item.product_price}` : "N/A",
    createdAt: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A",
  }));

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
            Delete Product
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontSize: "14px", color: "#475569", lineHeight: "1.6" }}>
          Are you sure you want to delete product{" "}
          <strong style={{ color: "#0f172a" }}>&ldquo;{productName}&rdquo;</strong>?
          This will permanently remove the product and its images from the catalog.
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
          tittle="Products"
          btnLinkTitle="Add New Product"
          btnLink="/panel/products/add-new-product"
        />

        <div className="admin_form_card" style={{ marginTop: "18px" }}>
          {/* Filter Bar */}
          <div className="admin_filter_toolbar">
            <div className="admin_filter_search">
              <FiSearch className="admin_filter_search_icon" />
              <input
                type="text"
                placeholder="Search products by title, ASIN/SIN, or tag..."
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
              {/* Category Filter Dropdown */}
              <select
                className="admin_filter_select"
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              >
                <option value="ALL">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id || c.category_name} value={c.category_name}>
                    {c.category_name}
                  </option>
                ))}
              </select>

              {/* Type Filter Pills */}
              <div className="admin_filter_tabs">
                <button
                  type="button"
                  onClick={() => setTypeFilter("ALL")}
                  className={`admin_filter_tab ${typeFilter === "ALL" ? "active" : ""}`}
                >
                  All ({productItems.length})
                </button>
                <button
                  type="button"
                  onClick={() => setTypeFilter("POPULAR")}
                  className={`admin_filter_tab ${typeFilter === "POPULAR" ? "active" : ""}`}
                >
                  Popular ({productItems.filter((p) => p.product_type === "Most Popular").length})
                </button>
              </div>

              <Link
                href="/panel/products/add-new-product"
                className="admin_quick_add_btn"
              >
                <FiPlus size={15} /> Add Product
              </Link>
            </div>
          </div>

          {/* Table */}
          <div className="data_table product_data_table" style={{ marginTop: "15px" }}>
            {loader ? (
              <PageLoader />
            ) : formattedProductList.length === 0 ? (
              <div style={{ padding: "40px 20px", textAlign: "center" }}>
                <NotFound />
                {searchTerm && (
                  <p style={{ marginTop: "10px", fontSize: "14px", color: "#64748b" }}>
                    No products found matching &ldquo;{searchTerm}&rdquo;
                  </p>
                )}
              </div>
            ) : (
              <DataTable
                data={formattedProductList}
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

export default ProductList;
