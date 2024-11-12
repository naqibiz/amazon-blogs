"use client";
import React, { useEffect, useState } from "react";
import PanelHead from "../../PanelHead/PanelHead";
import { deleteProduct, getProducts } from "@/app/database/firebaseConfig";
import DataTable from "../../DataTable/DataTable";
import NotFound from "../../NotFound/NotFound";
import PageLoader from "../../PageLoader/PageLoader";
import { useRouter } from "next/navigation";
import { Modal } from "react-bootstrap";
import Button from "../../Button/Button";

const ProductList = () => {
  const [productItems, setProductItems] = useState([]);
  const [isFetched, setIsFetched] = useState(false);
  const [loader, setLoader] = useState(false);
  const [loaderDelete, setLoaderDelete] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [dataId, setDataId] = useState("");
  const [productName, setProductName] = useState("");
  const router = useRouter();

  console.log(productItems, "productItems---new");

  useEffect(() => {
    const fetchProductItems = async () => {
      try {
        setLoader(true);
        const items = await getProducts();
        setProductItems(items);
      } catch (error) {
        console.error("Error fetching product items:", error);
      } finally {
        setLoader(false);
        setIsFetched(true);
      }
    };

    if (!isFetched) {
      fetchProductItems();
    }
  }, [isFetched]);

  const handleDeleteClose = () => setShowDelete(false);

  const handleUpdate = (id) => {
    router.push(`/panel/products/add-new-product?id=${id}`);
  };

  const handleDelete = (id) => {
    const selectedProduct = productItems.find((item) => item.id === id);
    setDataId(id);
    setProductName(selectedProduct?.product_title || "");
    setShowDelete(true);
  };

  console.log(dataId, "dataId----<>");

  const confirmDelete = async () => {
    try {
      setLoaderDelete(true);
      await deleteProduct(dataId);
      setProductItems(productItems.filter((item) => item.id !== dataId));
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    } finally {
      setLoaderDelete(false);
      handleDeleteClose();
    }
  };

  const columns = [
    { key: "imageUrls", label: "Product Image" },
    { key: "product_title", label: "Product Name" },
    { key: "category", label: "Category" },
    { key: "product_price", label: "Price" },
    { key: "product_type", label: "Product Type" },
    { key: "createdAt", label: "Date" },
    { key: "action", label: "Action" },
  ];

  const formattedProductList = productItems.map((item) => ({
    ...item,
    product_price: item.product_price ? `$${item.product_price}` : "N/A",
    createdAt: item.createdAt ? new Date(item.createdAt).toDateString() : "N/A",
  }));

  return (
    <>
      <Modal
        show={showDelete}
        onHide={handleDeleteClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>Delete Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this product{" "}
          <strong>{productName}</strong>?
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
        <PanelHead
          tittle="Products"
          btnLinkTitle="Add New Product"
          btnLink="/panel/products/add-new-product"
        />

        <div className="data_table product_data_table">
          {loader ? (
            <PageLoader />
          ) : productItems.length === 0 ? (
            <NotFound />
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
    </>
  );
};

export default ProductList;
