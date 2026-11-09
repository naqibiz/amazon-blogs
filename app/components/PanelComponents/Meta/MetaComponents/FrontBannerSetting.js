"use client";
import React, { useEffect, useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import {
  addBannerSetting,
  deleteBannerSettingImage,
  getBannerSetting,
} from "@/app/database/firebaseConfig";
import { Form, Modal } from "react-bootstrap";
import Button from "@/app/components/Button/Button";
import SkeletonLoader from "@/app/components/SkeletonLoader/SkeletonLoader";
import { MdOutlineCloudUpload } from "react-icons/md";
import { FiImage, FiTrash2, FiInfo, FiUploadCloud } from "react-icons/fi";
import { toast } from "react-toastify";
import { toastStyle } from "@/app/_method/utils";
import PanelHead from "@/app/components/PanelHead/PanelHead";

const FrontBannerSetting = () => {
  const fileInputRef = useRef(null);
  const [loader, setLoader] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [bannerSetting, setBannerSetting] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteloading, setDeleteLoading] = useState(false);
  const [isUploadedImage, setIsUploadedImage] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [bannerIndex, setBannerIndex] = useState();

  const handleDeleteClose = () => setShowDelete(false);

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

  const removeUploadedImageFromFirebase = async (index) => {
    const removedFile = uploadedImages[index];

    if (!removedFile || !removedFile.path) {
      setUploadedImages((prev) => prev.filter((_, i) => i !== index));
      setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
      handleDeleteClose();
      return;
    }

    setDeleteLoading(true);

    try {
      setUploadedImages((prev) => prev.filter((_, i) => i !== index));
      const response = await deleteBannerSettingImage(removedFile.path);

      if (response?.success) {
        setBannerSetting((prev) => {
          const updatedSettings = prev.filter(
            (img) => img.path !== removedFile.path
          );
          return [...updatedSettings];
        });
        toast.success("Banner deleted successfully", toastStyle);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete banner", toastStyle);
    } finally {
      setDeleteLoading(false);
      handleDeleteClose();
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchFrontSetting = async () => {
      if (isMounted) setLoader(true);

      try {
        const items = await getBannerSetting();

        if (!isMounted) return;

        const imageUrls =
          Array.isArray(items) && items.length > 0
            ? items[0]?.imageUrls || []
            : [];

        setBannerSetting(imageUrls);
        setUploadedImages(imageUrls);
      } catch (error) {
        console.error("Error fetching banner settings:", error);
      } finally {
        if (isMounted) setLoader(false);
      }
    };

    fetchFrontSetting();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploadedFiles.length === 0) {
      toast.warning("Please select at least one new banner image to upload.", toastStyle);
      return;
    }

    setLoading(true);

    try {
      const response = await addBannerSetting({
        feature_images: uploadedFiles,
      });

      if (response.success && Array.isArray(response.imageUrls)) {
        setBannerSetting((prev) => [...prev, ...response.imageUrls]);
        setUploadedImages((prev) => [...prev, ...response.imageUrls]);
        toast.success("Banners saved successfully", toastStyle);
      }

      setUploadedFiles([]);
    } catch (error) {
      console.error("Error submitting front setting:", error);
      toast.error("Failed to upload banner", toastStyle);
    } finally {
      setLoading(false);
    }
  };

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
            {isUploadedImage ? "Delete Live Banner" : "Remove Selected Image"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontSize: "14px", color: "#475569", lineHeight: "1.6" }}>
          {isUploadedImage
            ? "Are you sure you want to permanently delete this banner from the storefront slider?"
            : "Remove this selected image before saving?"}
        </Modal.Body>
        <Modal.Footer style={{ borderTop: "1px solid #f1f5f9" }}>
          <div className="modal_footer_buttons">
            <Button btnTitle="Cancel" onClick={handleDeleteClose} />
            <Button
              btnTitle="Yes, Remove"
              className="delete_button"
              onClick={() => removeUploadedImageFromFirebase(bannerIndex)}
              isLoading={deleteloading}
            />
          </div>
        </Modal.Footer>
      </Modal>

      <div>
        <PanelHead tittle="Homepage Banner Settings" />

        <div className="admin_form_card" style={{ marginTop: "18px" }}>
          <div className="admin_form_header">
            <div>
              <h3 className="admin_form_title">
                <FiImage style={{ marginRight: "8px", color: "#f3971b" }} />
                Hero Slider Banners
              </h3>
              <p className="admin_form_subtitle">
                Manage promotional banners showcased on the storefront homepage slider
              </p>
            </div>
            <span className="admin_nav_count_badge">
              {uploadedImages.length} Active {uploadedImages.length === 1 ? "Banner" : "Banners"}
            </span>
          </div>

          {/* Guideline Banner */}
          <div className="admin_info_banner" style={{ marginTop: "16px" }}>
            <FiInfo size={18} color="#d97706" style={{ flexShrink: 0 }} />
            <span>
              <strong>Tip:</strong> For optimal display across desktop and mobile, upload banners with <strong>1920 &times; 600 px</strong> resolution (16:5 or 16:9 ratio) in JPG or WebP format.
            </span>
          </div>

          {/* Upload Dropzone */}
          <div style={{ marginTop: "20px" }}>
            <div
              className="product_image_upload admin_dropzone"
              onClick={handleFileUploadClick}
              style={{ padding: "36px 20px" }}
            >
              <MdOutlineCloudUpload size={54} color="#f3971b" />
              <p className="info" style={{ fontWeight: "600", color: "#0f172a", marginTop: "12px", fontSize: "15px" }}>
                Drag &amp; drop banner images here, or click to browse
              </p>
              <span style={{ fontSize: "13px", color: "#94a3b8" }}>
                High-resolution PNG, JPG, or WebP files
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
          </div>

          {/* Banner Gallery Grid */}
          <div style={{ marginTop: "24px" }}>
            <h4 className="admin_section_title" style={{ marginBottom: "14px" }}>
              Current Banners
            </h4>

            {loader ? (
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                {[1, 2, 3].map((val) => (
                  <SkeletonLoader height={160} width={260} key={val} />
                ))}
              </div>
            ) : uploadedImages && uploadedImages.length > 0 ? (
              <div className="admin_banner_grid">
                {uploadedImages.map((images, index) => (
                  <div className="admin_banner_card" key={index}>
                    <div
                      className="admin_banner_card_preview"
                      style={{
                        backgroundImage: `url(${images?.url ? images?.url : images})`,
                      }}
                    />
                    <div className="admin_banner_card_overlay">
                      <span className="admin_banner_order_tag">#{index + 1}</span>
                      <button
                        type="button"
                        className="admin_banner_delete_btn"
                        onClick={() => {
                          const isUploaded = images?.path ? true : false;
                          setIsUploadedImage(isUploaded);
                          setBannerIndex(index);
                          setShowDelete(true);
                        }}
                        title="Delete banner"
                      >
                        <FiTrash2 size={16} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="admin_empty_hint">
                No hero banners configured yet. Upload images above to populate the homepage slider.
              </div>
            )}
          </div>

          {/* Save Button for Newly Queued Files */}
          {uploadedFiles.length > 0 && (
            <Form onSubmit={handleSubmit} style={{ marginTop: "24px", paddingTop: "18px", borderTop: "1px solid #f1f5f9" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                <span style={{ fontSize: "14px", color: "#d97706", fontWeight: "600" }}>
                  ⚠️ You have {uploadedFiles.length} pending new {uploadedFiles.length === 1 ? "image" : "images"} to save.
                </span>
                <Button
                  btnTitle="Upload &amp; Save Banners"
                  type="submit"
                  isLoading={loading}
                  disabled={uploadedFiles.length === 0}
                />
              </div>
            </Form>
          )}
        </div>
      </div>
    </>
  );
};

export default FrontBannerSetting;
