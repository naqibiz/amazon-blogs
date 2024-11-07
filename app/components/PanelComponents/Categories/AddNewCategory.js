"use client";
import React, { useEffect, useRef, useState } from "react";
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
import { FaTrashCan } from "react-icons/fa6";
import { MdOutlineCloudUpload } from "react-icons/md";

const AddNewCategory = ({ data }) => {
  console.log(data?.id, "data id");
  const [form, setForm] = useState({
    category_name: "",
  });
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [categorySlug, setCategorySlug] = useState("");
  const [categoryItems, setCategoryItems] = useState([]);
  const [updateStatus, setUpdateStatus] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [removedImagesPaths, setRemovedImagesPaths] = useState([]);

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

    const categoryData = {
      ...form,
      category_slug: categorySlug,
    };

    if (updateStatus) {
      // Update category
      setLoadingUpdate(true);
      try {
        await updateCategoryCollections(
          data?.id,
          categoryData,
          uploadedFiles,
          removedImagesPaths
        );
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
          feature_images: uploadedFiles,
        });
        setForm({
          category_name: "",
        });
        setUploadedImages([]);
        setUploadedFiles([]);
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

      setUploadedFiles(categoryData.imageUrls || []);

      setUploadedImages(categoryData.imageUrls || []);
    }
  };

  useEffect(() => {
    editFunction();
  }, [categoryItems, data?.id]);

  const handleFileUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setUploadedFiles((prev) => [...prev, ...files]);
      const newImages = files.map((file) => URL.createObjectURL(file));
      setUploadedImages((prev) => [...prev, ...newImages]);
    }
    e.target.value = "";
  };

  const removeImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));

    const removedFile = uploadedFiles[index];
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));

    if (removedFile && typeof removedFile === "string") {
      setRemovedImagesPaths((prev) => [...prev, removedFile]);
    } else if (removedFile && removedFile.path) {
      setRemovedImagesPaths((prev) => [...prev, removedFile.path]);
    }
  };

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
          <Col lg={6}>
            <div className="category_feature_images_section">
              <label class="input-label form-label">
                Category Feature Images
              </label>

              <div className="product_feature_images">
                {/* on the click upload the images */}
                <div
                  className="product_image_upload"
                  onClick={handleFileUploadClick}
                >
                  <MdOutlineCloudUpload size={55} />
                  <p className="info">
                    Drag & Drop images here, or click to upload
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                </div>
                {uploadedImages && uploadedImages?.length > 0 && (
                  <div className="feature_image_wrapper">
                    {uploadedImages?.map((images, index) => (
                      <div className="feature_image" key={index}>
                        <div
                          className="feature_image_preview"
                          style={{
                            backgroundImage: `url(${
                              images?.url ? images?.url : images
                            })`,
                          }}
                        ></div>
                        <div
                          className="remove_feature_image"
                          onClick={() => removeImage(index)}
                        >
                          <FaTrashCan size={25} color="#fff" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AddNewCategory;
