"use client";
import React, { useEffect, useRef, useState } from "react";
import PanelHead from "../../PanelHead/PanelHead";
import { Col, Form, Row } from "react-bootstrap";
import InputFormControl from "../../InputFormControl/InputFormControl";
import { FaPlus, FaRegTrashCan, FaTrashCan } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { MdOutlineCloudUpload } from "react-icons/md";
import {
  addProduct,
  getCategoryCollections,
  getProducts,
  updateProduct,
} from "@/app/database/firebaseConfig";
import Dropdown from "../../Dropdown/Dropdown";
import { productType, toastStyle } from "@/app/_method/utils";
import Button from "../../Button/Button";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const AddNewProduct = ({ data }) => {
  console.log(data?.id, "data id product");
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
  const [categoryType, setCategoryType] = useState("");
  const [productItems, setProductItems] = useState([]);
  const [updateStatus, setUpdateStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  console.log(uploadedFiles, "uploadedFilesuploadedFiles");

  const predefinedLabels = [
    "Compatible Mountings",
    "Aspect Ratio",
    "Photo Sensor Technology",
    "Supported File Format",
    "Image Stabilization",
    "Maximum Focal Length",
    "Optical Zoom",
    "Maximum Aperture",
    "Expanded ISO Minimum",
    "Brand",
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

  // add Specification
  const addSpecification = () => {
    const nextIndex = form.specifications.length;

    if (nextIndex < predefinedLabels.length) {
      setForm((prev) => ({
        ...prev,
        specifications: [
          ...prev.specifications,
          { label: predefinedLabels[nextIndex], value: "" },
        ],
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        specifications: [...prev.specifications, { label: "", value: "" }],
      }));
    }
  };

  // remove Specification
  const removeSpecification = (index) => {
    const updatedSpecifications = form.specifications.filter(
      (spec, i) => i !== index
    );
    setForm((prev) => ({
      ...prev,
      specifications: updatedSpecifications,
    }));
  };

  // add AboutItem
  const addAboutItem = () => {
    setForm((prev) => ({
      ...prev,
      about_items: [...prev.about_items, ""],
    }));
  };

  // remove AboutItem
  const removeAboutItem = (index) => {
    const updatedAboutItems = form.about_items.filter((_, i) => i !== index);
    setForm((prev) => ({
      ...prev,
      about_items: updatedAboutItems,
    }));
  };

  // Add tag on 'Enter' key press
  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (tagInput.trim() !== "") {
        setForm((prev) => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }));
        setTagInput("");
      }
    }
  };

  const removeTag = (index) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
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

  useEffect(() => {
    const fetchProductItems = async () => {
      try {
        const items = await getProducts();
        setProductItems(items);
      } catch (error) {
        console.error("Error fetching product items:", error);
      }
    };

    fetchProductItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isFormIncomplete =
      !form.product_title ||
      !form.product_description ||
      !form.product_short_description ||
      !form.product_price ||
      !form.product_url ||
      !form.category ||
      !form.product_type ||
      !form.product_number_sin ||
      form.specifications.length === 0 ||
      form.about_items.length === 0 ||
      form.tags.length === 0 ||
      uploadedFiles.length === 0;

    if (isFormIncomplete) {
      toast.error("All fields are required.", toastStyle);
      return;
    }

    const productData = {
      ...form,
      categoryType: categoryType,
    };

    if (updateStatus) {
      // Update product
      setLoadingUpdate(true);
      try {
        await updateProduct(
          data?.id,
          productData,
          uploadedFiles,
          removedImagesPaths
        );
        router.push("/panel/products");
      } catch (error) {
        console.error("Error updating product:", error);
      } finally {
        setLoadingUpdate(false);
      }
    } else {
      // Add new product
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

        if (result.success) {
          setForm({
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
          setUploadedImages([]);
          setUploadedFiles([]);
          setTagInput("");
          setCategoryType("");
          router.push("/panel/products");
        }
      } catch (error) {
        console.error("Error submitting product:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // retrieve data for the upadate product
  const editFunction = () => {
    const productData = productItems?.find((item) => item?.id === data?.id);
    console.log(productData, "productData===<>");
    if (productData) {
      setUpdateStatus(true);
      setForm({
        product_title: productData.product_title || "",
        product_description: productData.product_description || "",
        product_short_description: productData.product_short_description || "",
        product_price: productData.product_price || "",
        product_url: productData.product_url || "",
        category: productData.category || "",
        product_type: productData.product_type || "",
        product_number_sin: productData.product_number_sin || "",
        specifications: productData.specifications || [],
        about_items: productData.about_items || [],
        tags: productData.tags || [],
      });

      setCategoryType(productData.categoryType || "");

      setUploadedFiles(productData.imageUrls || []);

      setUploadedImages(productData.imageUrls || []);
    }
  };

  useEffect(() => {
    editFunction();
  }, [productItems, data?.id]);

  return (
    <div>
      <PanelHead tittle="Products" btnTitle="Add New Product" />
      <div className="add_new_product">
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={7}>
              <div className="add_new_product_content">
                <InputFormControl
                  required={true}
                  label="Product Title"
                  type="text"
                  name="product_title"
                  onChange={handleFormChange}
                  value={form.product_title}
                />
                <InputFormControl
                  required={true}
                  label="Product Description"
                  type="text"
                  name="product_description"
                  as="textarea"
                  rows={12}
                  onChange={handleFormChange}
                  value={form.product_description}
                />
                <InputFormControl
                  required={true}
                  label="Product Short Description"
                  type="text"
                  name="product_short_description"
                  as="textarea"
                  rows={6}
                  onChange={handleFormChange}
                  value={form.product_short_description}
                />
                <Dropdown
                  label="Select Category"
                  searchable={true}
                  searchPlaceholder="Search categories"
                  selectedValue={form.category}
                  setSelectedValue={(selectedCategory) => {
                    console.log(selectedCategory, "selectedCategory");
                    setCategoryType(selectedCategory?.category_slug);
                    setForm((prev) => ({
                      ...prev,
                      category: selectedCategory?.category_name,
                    }));
                  }}
                  data={categoryItems}
                  searchKey="category_name"
                  displayKey="category_name"
                />
                <div className="add_tags_section">
                  <div className="tags_input">
                    <InputFormControl
                      required={false}
                      label="Product Tags"
                      type="text"
                      name="value"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagInputKeyDown}
                    />
                    {form.tags?.length > 0 && (
                      <div className="tags_output">
                        {form.tags.map((tag, index) => (
                          <div className="tag-item" key={index}>
                            {tag}
                            <span
                              className="remove-tag"
                              onClick={() => removeTag(index)}
                            >
                              <RxCross2 size={15} />
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="add_product_specification">
                  {form.specifications?.length > 0 && (
                    <p className="more_item_title">Specifications</p>
                  )}
                  {form.specifications.map((spec, index) => (
                    <div className="specification" key={index}>
                      <InputFormControl
                        required={true}
                        label={`Specification ${index + 1}`}
                        type="text"
                        name="label"
                        value={spec.label}
                        onChange={(e) =>
                          handleOnChange("specifications", index, e)
                        }
                      />

                      <InputFormControl
                        required={true}
                        label={spec.label || `Value ${index + 1}`}
                        type="text"
                        name="value"
                        value={spec.value}
                        onChange={(e) =>
                          handleOnChange("specifications", index, e)
                        }
                      />

                      <div
                        className="delete_specification"
                        onClick={() => removeSpecification(index)}
                      >
                        <FaRegTrashCan />
                      </div>
                    </div>
                  ))}
                  <div onClick={addSpecification} className="add_more_fields">
                    <FaPlus size={15} /> Add More Specifications
                  </div>
                </div>
                <div className="add_about_items">
                  {form.about_items?.length > 0 && (
                    <p className="more_item_title">About Items</p>
                  )}
                  {form.about_items.map((about, index) => (
                    <div className="about_item" key={index}>
                      <InputFormControl
                        required={true}
                        label={`About Item ${index + 1}`}
                        type="text"
                        value={about}
                        onChange={(e) =>
                          handleOnChange("about_items", index, e)
                        }
                      />

                      <div
                        className="delete_about_item"
                        onClick={() => removeAboutItem(index)}
                      >
                        <FaRegTrashCan />
                      </div>
                    </div>
                  ))}
                  <div onClick={addAboutItem} className="add_more_fields">
                    <FaPlus size={15} /> Add More About Items
                  </div>
                </div>
              </div>
            </Col>
            <Col md={5}>
              <div className="product_side_section">
                <div className="product_feature_images_section">
                  <label class="input-label form-label">
                    Product Feature Images
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
                        multiple
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
                              <FaTrashCan size={35} color="#fff" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="product_additional_info">
                  <InputFormControl
                    required={true}
                    label="Product Price"
                    type="text"
                    name="product_price"
                    onChange={handleFormChange}
                    value={form.product_price}
                  />
                  <InputFormControl
                    required={true}
                    label="Product URL"
                    type="text"
                    name="product_url"
                    onChange={handleFormChange}
                    value={form.product_url}
                  />
                  <InputFormControl
                    required={true}
                    label="Product Number(sku)"
                    type="text"
                    name="product_number_sin"
                    onChange={handleFormChange}
                    value={form.product_number_sin}
                  />
                  <Dropdown
                    label="Select Porduct Type"
                    searchable={false}
                    searchPlaceholder="Search product type"
                    selectedValue={form.product_type}
                    setSelectedValue={(selectedCategory) => {
                      setForm((prev) => ({
                        ...prev,
                        product_type: selectedCategory?.name,
                      }));
                    }}
                    data={productType}
                    searchKey="name"
                    displayKey="name"
                  />
                </div>

                <div className="add_new_product_btn">
                  <Button
                    btnTitle={`${
                      updateStatus
                        ? "Update Product Changes"
                        : "Product Publish"
                    }`}
                    type="submit"
                    isLoading={loadingUpdate ? loadingUpdate : loading}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
};

export default AddNewProduct;
