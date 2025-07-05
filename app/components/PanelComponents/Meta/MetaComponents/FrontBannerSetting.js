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
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      console.log(files, "filesfiles");
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
      setUploadedFiles([]);
      handleDeleteClose();
      return;
    }

    setDeleteLoading(true);

    try {
      setUploadedImages((prev) => prev.filter((_, i) => i !== index));
      const response = await deleteBannerSettingImage(removedFile.path);

      if (response.success) {
        setBannerSetting((prev) => {
          const updatedSettings = prev.filter(
            (img) => img.path !== removedFile.path
          );
          return [...updatedSettings];
        });
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    } finally {
      setDeleteLoading(false);
      handleDeleteClose();
    }
  };
  {
    console.log(loader, "loader--front-loader");
  }

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
    setLoading(true);

    try {
      const response = await addBannerSetting({
        feature_images: uploadedFiles,
      });

      if (response.success && Array.isArray(response.imageUrls)) {
        setBannerSetting((prev) => [...prev, ...response.imageUrls]);
        setUploadedImages((prev) => [...prev, ...response.imageUrls]);
      }

      setUploadedFiles([]);
    } catch (error) {
      console.error("Error submitting front setting:", error);
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
      >
        <Modal.Header>
          <Modal.Title>
            {isUploadedImage ? "Delete Banner" : "Remove Selected Banner Image"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isUploadedImage
            ? "Are you sure you want to delete this banner?"
            : "Are you sure you want to remove this selected Banner image?"}
        </Modal.Body>
        <Modal.Footer>
          <div className="modal_footer_buttons">
            <Button btnTitle="No" onClick={handleDeleteClose} />
            <Button
              btnTitle="Yes"
              className="delete_button"
              onClick={() => removeUploadedImageFromFirebase(bannerIndex)}
              isLoading={deleteloading}
            />
          </div>
        </Modal.Footer>
      </Modal>
      <div className="meta_setting_wrappers">
        <div className="home_banner_uploader">
          <p className="meta_setting_title">Home Banner</p>
          <div className="banner_uploader_section uploader_section">
            {/* Drag & Drop images here, or click to upload functionality */}
            <div className="banner_image_wrapper">
              {loader ? (
                <>
                  {[1, 2, 3, 4]?.map((val, i) => (
                    <SkeletonLoader height={150} width={150} key={i} />
                  ))}
                </>
              ) : (
                <>
                  {uploadedImages && uploadedImages?.length > 0 && (
                    <>
                      {uploadedImages?.map((images, index) => (
                        <div className="banner_image" key={index}>
                          <div
                            className="banner_image_preview"
                            style={{
                              backgroundImage: `url(${
                                images?.url ? images?.url : images
                              })`,
                            }}
                          ></div>
                          <div
                            className="remove_banner_image"
                            onClick={() => {
                              const isUploaded = images?.path ? true : false;
                              setIsUploadedImage(isUploaded);
                              setBannerIndex(index);
                              setShowDelete(true);
                            }}
                          >
                            <RxCross2 size={15} color="#ffffff" />
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </>
              )}

              <div
                className="on_uploader"
                onClick={() => handleFileUploadClick()}
              >
                <p className="uploader_label">
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
            </div>
            {uploadedImages && uploadedImages?.length > 0 && (
              <Form onSubmit={handleSubmit}>
                <div className="on_save_trigger">
                  <Button
                    btnTitle={`Add Banner`}
                    type="submit"
                    isLoading={loading}
                    disabled={uploadedFiles?.length === 0}
                  />
                </div>
              </Form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FrontBannerSetting;
