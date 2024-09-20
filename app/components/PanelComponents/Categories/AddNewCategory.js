"use client";
import React, { useEffect, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import PanelHead from "../../PanelHead/PanelHead";
import InputFormControl from "../../InputFormControl/InputFormControl";
import Button from "../../Button/Button";
import {
  addCategoryCollection,
  getCategoryCollections,
  updateCategoryCollections,
} from "@/app/database/firebaseConfig";
import { useRouter } from "next/navigation";

const AddNewCategory = ({ data }) => {
  console.log(data?.id, "data id");
  const [form, setForm] = useState({
    category_name: "",
  });
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [categorySlug, setCategorySlug] = useState("");
  const [categoryItems, setCategoryItems] = useState([]);
  const [updateStatus, setUpdateStatus] = useState(false);

  useEffect(() => {
    setCategorySlug(convertToSlug(form.category_name));
  }, [form.category_name]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const convertToSlug = (name) => {
    return name.trim().replace(/\s+/g, "-").toLowerCase();
  };

  useEffect(() => {
    const fetchCategoryItems = async () => {
      try {
        const items = await getCategoryCollections();
        setCategoryItems(items);
      } catch (error) {
        console.error("Error fetching category items:", error);
      }
    };

    fetchCategoryItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (updateStatus) {
      // Update category
      setLoadingUpdate(true);
      try {
        await updateCategoryCollections(data.id, {
          category_name: form.category_name,
          category_slug: categorySlug,
        });
        setForm({
          category_name: "",
        });
        router.push("/panel/categories");
      } catch (error) {
        console.error("Error updating category:", error);
      } finally {
        setLoadingUpdate(false);
      }
    } else {
      // Add new category
      setLoading(true);
      try {
        await addCategoryCollection({
          category_name: form.category_name,
          category_slug: categorySlug,
        });
        setForm({
          category_name: "",
        });
        router.push("/panel/categories");
      } catch (error) {
        console.error("Error adding category:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const editFunction = () => {
    const categoryData = categoryItems?.find((item) => item?.id === data?.id);

    if (categoryData) {
      setUpdateStatus(true);
      setForm({
        category_name: categoryData.category_name || "",
      });
    }
  };

  useEffect(() => {
    editFunction();
  }, [categoryItems, data?.id]);

  return (
    <div>
      <PanelHead tittle="Add New Category" />
      <div className="navigation_wrapper panel_middle_content">
        <Row>
          <Col lg={6}>
            <Form onSubmit={handleSubmit}>
              <InputFormControl
                required={true}
                label="Category Name"
                type="text"
                name="category_name"
                onChange={handleFormChange}
                value={form.category_name}
              />

              <InputFormControl
                required={true}
                label="Category Slug"
                type="text"
                name="category_slug"
                value={categorySlug}
                readOnly
              />

              <Button
                btnTitle={`${
                  updateStatus
                    ? "Update Category Collection"
                    : "Add Category Collection"
                }`}
                type="submit"
                isLoading={loadingUpdate ? loadingUpdate : loading}
              />
            </Form>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AddNewCategory;
