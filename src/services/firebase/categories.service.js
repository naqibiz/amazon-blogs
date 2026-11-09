import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { toastStyle } from "@/utils/toast";
import { db } from "./config";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../cloudinary/cloudinary.service";

// ADD CATEGORY COLLECTION
export async function addCategoryCollection(categoryInfo) {
  try {
    const {
      category_name,
      category_slug,
      category_type,
      feature_images = [],
    } = categoryInfo;

    if (!Array.isArray(feature_images) || feature_images.length === 0) {
      toast.error("No feature images selected.", toastStyle);
      return { success: false };
    }

    const imageUploadPromises = feature_images.map(async (image) => {
      if (image && image.name) {
        return await uploadToCloudinary(image);
      } else {
        console.error("Invalid image:", image);
        return null;
      }
    });

    const imageUrls = (await Promise.all(imageUploadPromises)).filter(Boolean);

    if (imageUrls.length === 0) {
      toast.error("Failed to upload images.", toastStyle);
      return { success: false };
    }

    await addDoc(collection(db, "categories"), {
      category_name,
      category_slug,
      category_type,
      imageUrls,
      createdAt: Timestamp.now(),
    });

    toast.success("Category added successfully", toastStyle);
    return { success: true };
  } catch (error) {
    toast.error(error.message, toastStyle);
    return { success: false, error: error.message };
  }
}

// GET CATEGORY COLLECTION
export async function getCategoryCollections() {
  try {
    const querySnapshot = await getDocs(collection(db, "categories"));
    const categoryItems = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return categoryItems;
  } catch (error) {
    console.error("Error fetching category items:", error);
    toast.error("Failed to fetch category items", toastStyle);
    return [];
  }
}

// UPDATE CATEGORY COLLECTION
export async function updateCategoryCollections(
  id,
  updatedData,
  newImages,
  removedImagesPaths
) {
  try {
    const categoryDoc = doc(db, "categories", id);

    const categorySnapshot = await getDoc(categoryDoc);
    const existingImages = categorySnapshot.exists()
      ? categorySnapshot.data().imageUrls || []
      : [];

    const filteredExistingImages = existingImages.filter(
      (image) => !removedImagesPaths.includes(image.path)
    );

    for (const removedPath of removedImagesPaths) {
      await deleteFromCloudinary(removedPath);
    }

    const updatedImageUrls = [];

    for (const image of newImages) {
      if (image && image.name) {
        const cloudinaryData = await uploadToCloudinary(image);
        if (cloudinaryData) {
          updatedImageUrls.push(cloudinaryData);
        }
      }
    }

    const finalImageUrls = [...filteredExistingImages, ...updatedImageUrls];

    await updateDoc(categoryDoc, { ...updatedData, imageUrls: finalImageUrls });

    toast.success("Category updated successfully", toastStyle);
    return { success: true };
  } catch (error) {
    toast.error(error.message, toastStyle);
    return { success: false, error: error.message };
  }
}

// DELETE CATEGORY COLLECTION
export async function deleteCategoryCollections(id) {
  try {
    const categoryDoc = doc(db, "categories", id);
    const categorySnapshot = await getDoc(categoryDoc);

    if (categorySnapshot.exists()) {
      const productData = categorySnapshot.data();

      const imageDeletions = productData.imageUrls.map(async (image) => {
        await deleteFromCloudinary(image.path);
      });

      await Promise.all(imageDeletions);
      await deleteDoc(categoryDoc);

      toast.success("Category deleted successfully", toastStyle);
      return { success: true };
    } else {
      toast.error("Category not found", toastStyle);
      return { success: false };
    }
  } catch (error) {
    console.error(error);
    toast.error(error.message, toastStyle);
    return { success: false, error: error.message };
  }
}

