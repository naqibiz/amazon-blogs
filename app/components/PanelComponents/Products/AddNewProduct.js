"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import PanelHead from "../../PanelHead/PanelHead";
import { Col, Form, Row } from "react-bootstrap";
import InputFormControl from "../../InputFormControl/InputFormControl";
import { FaPlus, FaRegTrashCan, FaTrashCan } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { MdOutlineCloudUpload } from "react-icons/md";
import {
  FiShoppingBag,
  FiFileText,
  FiDollarSign,
  FiLayers,
  FiList,
  FiImage,
  FiTag,
  FiArrowLeft,
  FiCheck,
} from "react-icons/fi";
import {
  addProduct,
  getCategoryCollections,
  getProducts,
  getSubscription,
  updateProduct,
} from "@/app/database/firebaseConfig";
import Dropdown from "../../Dropdown/Dropdown";
import { productType, toastStyle } from "@/app/_method/utils";
import Button from "../../Button/Button";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import { useAppDispatch } from "@/src/store/hooks";
import { fetchProducts } from "@/src/store/slices/productSlice";
import { invalidateDashboardCache } from "@/src/store/slices/dashboardSlice";
import Link from "next/link";

const AddNewProduct = ({ data }) => {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState({
    product_title: "",
    product_description: "",
    product_short_description: "",
    product_price: "",
    product_url: "",
    category: "",
    product_type: "",
    product_number_sin: "",
    specifications: [],
    about_items: [],
    tags: [],
  });
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [tagInput, setTagInput] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [removedImagesPaths, setRemovedImagesPaths] = useState([]);
  const [categoryItems, setCategoryItems] = useState([]);
  const [subscriptions, setSubscription] = useState([]);
  const [categoryType, setCategoryType] = useState("");
  const [productItems, setProductItems] = useState([]);
  const [updateStatus, setUpdateStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const predefinedLabels = [
    "Brand",
    "Model Name",
    "Color",
    "Screen Size",
    "Connectivity",
    "Optical Zoom",
    "Supported File Format",
    "Photo Sensor Technology",
    "Compatible Mountings",
    "Image Stabilization",
  ];

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOnChange = (type, index, e) => {
    const { name, value } = e.target;

    if (type === "specifications") {
      const updatedSpecifications = [...form.specifications];
      updatedSpecifications[index][name] = value;
      setForm((prev) => ({
        ...prev,
        specifications: updatedSpecifications,
      }));
    } else if (type === "about_items") {
      const updatedAboutItems = [...form.about_items];
      updatedAboutItems[index] = value;
      setForm((prev) => ({
        ...prev,
        about_items: updatedAboutItems,
      }));
    }
  };

  // Initial data load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, subsRes, prodsRes] = await Promise.all([
          getCategoryCollections(),
          getSubscription(),
          getProducts(),
        ]);
        setCategoryItems(categoriesRes || []);
        setSubscription(subsRes || []);
        setProductItems(prodsRes || []);
      } catch (err) {
        console.error("Error loading product dependencies:", err);
      }
    };
    fetchData();
  }, []);

  // Hydrate edit product
  useEffect(() => {
    if (!data?.id || productItems.length === 0) return;

    const currentProd = productItems.find((p) => p.id === data.id);
    if (currentProd) {
      setForm({
        product_title: currentProd.product_title || "",
        product_description: currentProd.product_description || "",
        product_short_description: currentProd.product_short_description || "",
        product_price: currentProd.product_price || "",
        product_url: currentProd.product_url || "",
        category: currentProd.category || "",
        product_type: currentProd.product_type || "",
        product_number_sin: currentProd.product_number_sin || "",
        specifications: currentProd.specifications || [],
        about_items: currentProd.about_items || [],
        tags: currentProd.tags || [],
      });
      setCategoryType(currentProd.categoryType || "");
      setUploadedFiles(currentProd.imageUrls || []);
      setUploadedImages(currentProd.imageUrls || []);
      setUpdateStatus(true);
    }
  }, [productItems, data?.id]);

  // Tag management
  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmed = tagInput.trim().replace(/^,+|,+$/g, "");
    if (trimmed && !form.tags.includes(trimmed)) {
      setForm((prev) => ({
        ...prev,
        tags: [...prev.tags, trimmed],
      }));
      setTagInput("");
    }
  };

  const removeTag = (index) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  // Specifications management
  const addSpecification = (predefinedLabel = "") => {
    setForm((prev) => ({
      ...prev,
      specifications: [
        ...prev.specifications,
        { label: typeof predefinedLabel === "string" ? predefinedLabel : "", value: "" },
      ],
    }));
  };

  const removeSpecification = (index) => {
    setForm((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };

  // About items management
  const addAboutItem = () => {
    setForm((prev) => ({
      ...prev,
      about_items: [...prev.about_items, ""],
    }));
  };

  const removeAboutItem = (index) => {
    setForm((prev) => ({
      ...prev,
      about_items: prev.about_items.filter((_, i) => i !== index),
    }));
  };

  // File uploads
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

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.product_title ||
      !form.product_description ||
      !form.product_short_description ||
      !form.product_price ||
      !form.product_url ||
      !form.category ||
      !form.product_type ||
      !form.product_number_sin ||
      uploadedFiles.length === 0
    ) {
      toast.error("Please fill all required product fields and upload images.", toastStyle);
      return;
    }

    const productData = {
      ...form,
      categoryType: categoryType,
    };

    if (updateStatus) {
      setLoadingUpdate(true);
      try {
        await updateProduct(
          data?.id,
          productData,
          uploadedFiles,
          removedImagesPaths
        );
        dispatch(fetchProducts());
        dispatch(invalidateDashboardCache());
        toast.success("Product updated successfully", toastStyle);
        router.push("/panel/products");
      } catch (error) {
        console.error("Error updating product:", error);
        toast.error("Failed to update product", toastStyle);
      } finally {
        setLoadingUpdate(false);
      }
    } else {
      setLoading(true);
      try {
        const result = await addProduct({
          product_title: form.product_title,
          product_description: form.product_description,
          product_short_description: form.product_short_description,
          product_price: form.product_price,
          product_url: form.product_url,
          category: form.category,
          product_type: form.product_type,
          feature_images: uploadedFiles,
          product_number_sin: form.product_number_sin,
          specifications: form.specifications,
          about_items: form.about_items,
          tags: form.tags,
          categoryType: categoryType,
        });

        if (result?.success) {
          // Send product email to subscribers
          const emailsToSend = subscriptions
            .map((val) => val?.email)
            .filter(Boolean);

          if (emailsToSend.length > 0) {
            try {
              await axios.post("/api/send-product-email", {
                emails: emailsToSend,
                productTitle: form.product_title,
                productDescription: form.product_description,
              });
            } catch (err) {
              console.error("Failed to send email to subscribers:", err);
            }
          }

          dispatch(fetchProducts());
          dispatch(invalidateDashboardCache());
          toast.success("Product published successfully!", toastStyle);
          router.push("/panel/products");
        }
      } catch (error) {
        console.error("Error submitting product:", error);
        toast.error("Failed to publish product", toastStyle);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <PanelHead
        tittle={updateStatus ? "Edit Product" : "Add New Product"}
        btnLinkTitle="Back to Products"
        btnLink="/panel/products"
      />

      <Form onSubmit={handleSubmit} style={{ marginTop: "18px" }}>
        <Row className="g-4">
          {/* Left Column: Core Info & Highlights */}
          <Col lg={7}>
            {/* Card 1: Basic Information */}
            <div className="admin_form_card mb-4">
              <div className="admin_form_header">
                <div>
                  <h3 className="admin_form_title">
                    <FiShoppingBag style={{ marginRight: "8px", color: "#f3971b" }} />
                    Basic Information
                  </h3>
                  <p className="admin_form_subtitle">
                    Title, affiliate link, pricing and overview details
                  </p>
                </div>
              </div>

              <div style={{ marginTop: "20px" }}>
                <div style={{ marginBottom: "16px" }}>
                  <InputFormControl
                    required={true}
                    label="Product Title *"
                    type="text"
                    name="product_title"
                    placeholder="e.g. Sony Alpha 7 IV Full-frame Mirrorless Camera"
                    onChange={handleFormChange}
                    value={form.product_title}
                  />
                </div>

                <Row>
                  <Col md={6} style={{ marginBottom: "16px" }}>
                    <InputFormControl
                      required={true}
                      label="Price (USD) *"
                      type="number"
                      name="product_price"
                      placeholder="e.g. 2498.00"
                      onChange={handleFormChange}
                      value={form.product_price}
                    />
                  </Col>
                  <Col md={6} style={{ marginBottom: "16px" }}>
                    <InputFormControl
                      required={true}
                      label="Product ASIN / SKU *"
                      type="text"
                      name="product_number_sin"
                      placeholder="e.g. B09JZT6YSS"
                      onChange={handleFormChange}
                      value={form.product_number_sin}
                    />
                  </Col>
                </Row>

                <div style={{ marginBottom: "16px" }}>
                  <InputFormControl
                    required={true}
                    label="Affiliate Product URL *"
                    type="text"
                    name="product_url"
                    placeholder="https://www.amazon.com/dp/..."
                    onChange={handleFormChange}
                    value={form.product_url}
                  />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <InputFormControl
                    required={true}
                    label="Short Summary Description *"
                    as="textarea"
                    rows={3}
                    name="product_short_description"
                    placeholder="Brief 2-3 line summary displayed in cards and search listings..."
                    onChange={handleFormChange}
                    value={form.product_short_description}
                  />
                </div>

                <div>
                  <InputFormControl
                    required={true}
                    label="Full Product Overview *"
                    as="textarea"
                    rows={6}
                    name="product_description"
                    placeholder="Complete detailed description of the product features, build, and usage..."
                    onChange={handleFormChange}
                    value={form.product_description}
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Bullet Highlights & Specifications */}
            <div className="admin_form_card mb-4">
              <div className="admin_form_header">
                <div>
                  <h3 className="admin_form_title">
                    <FiList style={{ marginRight: "8px", color: "#f3971b" }} />
                    Bullet Highlights &amp; Specifications
                  </h3>
                  <p className="admin_form_subtitle">
                    Add bullet points (&ldquo;About this item&rdquo;) and key-value specs
                  </p>
                </div>
              </div>

              {/* About Items */}
              <div style={{ marginTop: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <span style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a" }}>
                    About This Item (Bullet Points)
                  </span>
                  <button
                    type="button"
                    onClick={addAboutItem}
                    className="admin_small_add_btn"
                  >
                    <FaPlus size={12} /> Add Point
                  </button>
                </div>

                {form.about_items.map((about, index) => (
                  <div key={index} className="admin_dynamic_item_row">
                    <span className="admin_bullet_dot">•</span>
                    <input
                      type="text"
                      className="admin_filter_input"
                      placeholder={`Bullet point ${index + 1}...`}
                      value={about}
                      onChange={(e) => handleOnChange("about_items", index, e)}
                    />
                    <button
                      type="button"
                      className="admin_row_delete_btn"
                      onClick={() => removeAboutItem(index)}
                      title="Delete bullet"
                    >
                      <FaRegTrashCan size={14} />
                    </button>
                  </div>
                ))}

                {form.about_items.length === 0 && (
                  <div className="admin_empty_hint">
                    No bullet points added yet. Click &ldquo;+ Add Point&rdquo; to add Amazon-style highlights.
                  </div>
                )}
              </div>

              {/* Specifications */}
              <div style={{ marginTop: "28px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <span style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a" }}>
                    Product Specifications
                  </span>
                  <button
                    type="button"
                    onClick={() => addSpecification()}
                    className="admin_small_add_btn"
                  >
                    <FaPlus size={12} /> Add Custom Spec
                  </button>
                </div>

                {/* Predefined Chips */}
                <div className="admin_chips_wrapper">
                  <span style={{ fontSize: "12px", color: "#64748b" }}>Quick add:</span>
                  {predefinedLabels.map((lbl) => (
                    <button
                      key={lbl}
                      type="button"
                      className="admin_chip_btn"
                      onClick={() => addSpecification(lbl)}
                    >
                      + {lbl}
                    </button>
                  ))}
                </div>

                {form.specifications.map((spec, index) => (
                  <div key={index} className="admin_spec_row">
                    <input
                      type="text"
                      name="label"
                      className="admin_filter_input"
                      style={{ flex: "1" }}
                      placeholder="Spec Label (e.g. Brand)"
                      value={spec.label}
                      onChange={(e) => handleOnChange("specifications", index, e)}
                    />
                    <input
                      type="text"
                      name="value"
                      className="admin_filter_input"
                      style={{ flex: "1.5" }}
                      placeholder="Spec Value (e.g. Sony)"
                      value={spec.value}
                      onChange={(e) => handleOnChange("specifications", index, e)}
                    />
                    <button
                      type="button"
                      className="admin_row_delete_btn"
                      onClick={() => removeSpecification(index)}
                      title="Delete spec"
                    >
                      <FaRegTrashCan size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </Col>

          {/* Right Column: Classification, Images & Tags */}
          <Col lg={5}>
            {/* Card 3: Classification */}
            <div className="admin_form_card mb-4">
              <div className="admin_form_header">
                <div>
                  <h3 className="admin_form_title">
                    <FiLayers style={{ marginRight: "8px", color: "#f3971b" }} />
                    Category &amp; Type
                  </h3>
                  <p className="admin_form_subtitle">
                    Assign catalog categorization
                  </p>
                </div>
              </div>

              <div style={{ marginTop: "20px" }}>
                <div style={{ marginBottom: "16px" }}>
                  <Dropdown
                    label="Product Category *"
                    searchable={true}
                    searchPlaceholder="Search categories..."
                    selectedValue={form.category}
                    setSelectedValue={(selectedCategory) => {
                      setCategoryType(selectedCategory?.category_slug || "");
                      setForm((prev) => ({
                        ...prev,
                        category: selectedCategory?.category_name,
                      }));
                    }}
                    data={categoryItems}
                    searchKey="category_name"
                    displayKey="category_name"
                  />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <Dropdown
                    label="Product Type *"
                    searchable={false}
                    searchPlaceholder="Select product type"
                    selectedValue={form.product_type}
                    setSelectedValue={(selectedType) => {
                      setForm((prev) => ({
                        ...prev,
                        product_type: selectedType?.name,
                      }));
                    }}
                    data={productType}
                    searchKey="name"
                    displayKey="name"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="input-label form-label" style={{ fontWeight: "600", fontSize: "14px" }}>
                    Search Tags
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      type="text"
                      className="admin_filter_input"
                      placeholder="Type tag and press Enter..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagInputKeyDown}
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="admin_small_add_btn"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Add
                    </button>
                  </div>

                  {form.tags?.length > 0 && (
                    <div className="admin_tags_cloud" style={{ marginTop: "12px" }}>
                      {form.tags.map((tag, index) => (
                        <span key={index} className="admin_tag_badge">
                          #{tag}
                          <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="admin_tag_remove"
                          >
                            <RxCross2 size={13} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Card 4: Images */}
            <div className="admin_form_card mb-4">
              <div className="admin_form_header">
                <div>
                  <h3 className="admin_form_title">
                    <FiImage style={{ marginRight: "8px", color: "#f3971b" }} />
                    Product Images *
                  </h3>
                  <p className="admin_form_subtitle">
                    Upload multi-angle high-resolution product photos
                  </p>
                </div>
                <span className="admin_nav_count_badge">
                  {uploadedImages.length} {uploadedImages.length === 1 ? "Image" : "Images"}
                </span>
              </div>

              <div style={{ marginTop: "20px" }}>
                <div
                  className="product_image_upload admin_dropzone"
                  onClick={handleFileUploadClick}
                >
                  <MdOutlineCloudUpload size={48} color="#f3971b" />
                  <p className="info" style={{ fontWeight: "600", color: "#0f172a", marginTop: "10px" }}>
                    Drop product images here, or browse
                  </p>
                  <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                    Supports multi-image selection (JPG, PNG, WebP)
                  </span>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                </div>

                {uploadedImages && uploadedImages.length > 0 && (
                  <div className="admin_media_preview_grid" style={{ marginTop: "16px" }}>
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
            </div>

            {/* Actions Card */}
            <div className="admin_form_card">
              <div className="admin_form_actions_vertical">
                <Button
                  btnTitle={
                    updateStatus
                      ? "Update Product Changes"
                      : "Publish Product"
                  }
                  type="submit"
                  isLoading={loadingUpdate || loading}
                />
                <Link href="/panel/products" className="admin_cancel_btn_full">
                  Cancel &amp; Discard
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default AddNewProduct;
