"use client";
import React, { useEffect, useState } from "react";
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

const CategoryList = () => {
  const [categoryItems, setCategoryItems] = useState([]);
  const [loader, setLoader] = useState(false);
  const [loaderDelete, setLoaderDelete] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [dataId, setDataId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const router = useRouter();
  const [isFetched, setIsFetched] = useState(false);

  console.log(categoryItems, "categoryItems===<>");

  useEffect(() => {
    const fetchCategoryItems = async () => {
      try {
        setLoader(true);
        const items = await getCategoryCollections();
        setCategoryItems(items);
      } catch (error) {
        console.error("Error fetching category items:", error);
      } finally {
        setLoader(false);
        setIsFetched(true);
      }
    };

    if (!isFetched) {
      fetchCategoryItems();
    }
  }, [isFetched]);

  const handleDeleteClose = () => setShowDelete(false);

  const handleUpdate = (id) => {
    router.push(`/panel/categories/add-new-category?id=${id}`);
  };

  const handleDelete = (id) => {
    const selectedCategory = categoryItems.find((item) => item.id === id);
    setDataId(id);
    setCategoryName(selectedCategory?.category_name || "");
    setShowDelete(true);
  };

  const confirmDelete = async () => {
    try {
      setLoaderDelete(true);
      await deleteCategoryCollections(dataId);
      setCategoryItems(categoryItems.filter((item) => item.id !== dataId));
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    } finally {
      setLoaderDelete(false);
      handleDeleteClose();
    }
  };

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
      >
        <Modal.Header>
          <Modal.Title>Delete Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this category{" "}
          <strong>{categoryName}</strong>?
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
          tittle="Categories"
          btnLinkTitle="Add New Category"
          btnLink="/panel/categories/add-new-category"
        />

        <div className="data_table category_data_table">
          {loader ? (
            <PageLoader />
          ) : categoryItems.length === 0 ? (
            <NotFound />
          ) : (
            <DataTable
              data={categoryItems}
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

export default CategoryList;
