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
import Dropdown from "../../Dropdown/Dropdown";
import { categoryType, toastStyle } from "@/app/_method/utils";
import { toast } from "react-toastify";

const AddNewCategory = ({ data }) => {
  console.log(data?.id, "data id");
  const [form, setForm] = useState({
    category_name: "",
    category_type: "",
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
    setCategorySlug(
      form.category_name.trim().replace(/\s+/g, "-").toLowerCase()
    );
  }, [form.category_name]);

  useEffect(() => {
    if (!data?.id) return;

    const fetchCategories = async () => {
      try {
        const items = await getCategoryCollections();
        setCategoryItems(items);
        const currentCategory = items.find((item) => item?.id === data?.id);
        if (currentCategory) {
          setForm({
            category_name: currentCategory.category_name,
            category_type: currentCategory.category_type,
          });
          setUploadedFiles(currentCategory.imageUrls || []);
          setUploadedImages(currentCategory.imageUrls || []);
          setUpdateStatus(true);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [data?.id]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.category_name ||
      !form.category_type ||
      uploadedFiles.length === 0
    ) {
      toast.error("All fields are required.", toastStyle);
      return;
    }

    const categoryData = {
      ...form,
      category_slug: categorySlug,
    };

    if (updateStatus) {
      setLoadingUpdate(true);
      try {
        await updateCategoryCollections(
          data?.id,
          categoryData,
          uploadedFiles,
          removedImagesPaths
        );
        router.push("/panel/categories");
      } catch (error) {
        console.error("Error updating category:", error);
      } finally {
        setLoadingUpdate(false);
      }
    } else {
      setLoading(true);
      try {
        await addCategoryCollection({
          category_name: form.category_name,
          category_type: form.category_type,
          category_slug: categorySlug,
          feature_images: uploadedFiles,
        });
        setForm({
          category_name: "",
          category_type: "",
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
              <Dropdown
                label="Select Category Type"
                searchable={false}
                searchPlaceholder="Select Category Type"
                selectedValue={form.category_type}
                setSelectedValue={(selectedType) => {
                  setForm((prev) => ({
                    ...prev,
                    category_type: selectedType?.name,
                  }));
                }}
                data={categoryType}
                searchKey="name"
                displayKey="name"
              />
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
