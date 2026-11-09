"use client";
import React, { useEffect, useRef, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
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
import { FiLayers, FiImage, FiArrowLeft, FiCheck } from "react-icons/fi";
import Dropdown from "../../Dropdown/Dropdown";
import { categoryType, toastStyle } from "@/app/_method/utils";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/src/store/hooks";
import { fetchCategories } from "@/src/store/slices/categorySlice";
import { invalidateDashboardCache } from "@/src/store/slices/dashboardSlice";
import Link from "next/link";

const AddNewCategory = ({ data }) => {
  const dispatch = useAppDispatch();
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

    const fetchCategoriesData = async () => {
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
    fetchCategoriesData();
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
      toast.error("Please fill all required fields and upload an image.", toastStyle);
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
        dispatch(fetchCategories());
        dispatch(invalidateDashboardCache());
        toast.success("Category updated successfully", toastStyle);
        router.push("/panel/categories");
      } catch (error) {
        console.error("Error updating category:", error);
        toast.error("Failed to update category", toastStyle);
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
        dispatch(fetchCategories());
        dispatch(invalidateDashboardCache());
        toast.success("Category created successfully", toastStyle);
        setForm({
          category_name: "",
          category_type: "",
        });
        setUploadedImages([]);
        setUploadedFiles([]);
        router.push("/panel/categories");
      } catch (error) {
        console.error("Error adding category:", error);
        toast.error("Failed to add category", toastStyle);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
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
      <PanelHead
        tittle={updateStatus ? "Edit Category" : "Add New Category"}
        btnLinkTitle="Back to Categories"
        btnLink="/panel/categories"
      />

      <div className="admin_form_card" style={{ marginTop: "18px" }}>
        <div className="admin_form_header">
          <div>
            <h3 className="admin_form_title">
              <FiLayers style={{ marginRight: "8px", color: "#f3971b" }} />
              {updateStatus ? "Update Category Details" : "Create New Category"}
            </h3>
            <p className="admin_form_subtitle">
              Configure category metadata, classification type, and visual thumbnail
            </p>
          </div>
          <span className="admin_nav_count_badge">
            {updateStatus ? "Editing Mode" : "New Collection"}
          </span>
        </div>

        <Form onSubmit={handleSubmit} style={{ marginTop: "24px" }}>
          <Row>
            {/* Left: Metadata */}
            <Col lg={6}>
              <div className="admin_section_box">
                <h4 className="admin_section_title">Category Information</h4>

                <div style={{ marginBottom: "16px" }}>
                  <Dropdown
                    label="Category Type *"
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
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <InputFormControl
                    required={true}
                    label="Category Name *"
                    type="text"
                    name="category_name"
                    placeholder="e.g. Smart Home Electronics"
                    onChange={handleFormChange}
                    value={form.category_name}
                  />
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <InputFormControl
                    required={true}
                    label="Auto Generated Slug"
                    type="text"
                    name="category_slug"
                    value={categorySlug}
                    readOnly
                  />
                  {categorySlug && (
                    <div style={{ marginTop: "6px", fontSize: "12px", color: "#64748b" }}>
                      Live URL: <code style={{ color: "#d97706", background: "#fef3c7", padding: "2px 6px", borderRadius: "4px" }}>/product-category?category={categorySlug}</code>
                    </div>
                  )}
                </div>

                <div className="admin_form_actions_row">
                  <Button
                    btnTitle={
                      updateStatus
                        ? "Save Changes"
                        : "Create Category"
                    }
                    type="submit"
                    isLoading={loadingUpdate || loading}
                  />
                  <Link href="/panel/categories" className="admin_cancel_btn">
                    Cancel
                  </Link>
                </div>
              </div>
            </Col>

            {/* Right: Images */}
            <Col lg={6}>
              <div className="admin_section_box">
                <h4 className="admin_section_title">
                  <FiImage style={{ marginRight: "6px", color: "#f3971b" }} />
                  Featured Category Image *
                </h4>
                <p style={{ fontSize: "13px", color: "#64748b", margin: "-6px 0 16px 0" }}>
                  Upload a high-resolution banner thumbnail (PNG, JPG, or WEBP)
                </p>

                <div
                  className="product_image_upload admin_dropzone"
                  onClick={handleFileUploadClick}
                >
                  <MdOutlineCloudUpload size={50} color="#f3971b" />
                  <p className="info" style={{ fontWeight: "600", color: "#0f172a", marginTop: "10px" }}>
                    Click or drag &amp; drop to upload image
                  </p>
                  <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                    PNG, JPG, WebP supported
                  </span>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                </div>

                {uploadedImages && uploadedImages.length > 0 && (
                  <div className="admin_media_preview_grid" style={{ marginTop: "18px" }}>
                    {uploadedImages.map((image, index) => (
                      <div className="admin_media_thumb" key={index}>
                        <div
                          className="admin_media_thumb_img"
                          style={{
                            backgroundImage: `url(${image?.url ? image?.url : image})`,
                          }}
                        />
                        <button
                          type="button"
                          className="admin_media_thumb_remove"
                          onClick={() => removeImage(index)}
                          title="Remove image"
                        >
                          <FaTrashCan size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
};

export default AddNewCategory;
