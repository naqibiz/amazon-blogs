import {
  addDoc,
  collection,
  doc,
  getDocs,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { toast } from "react-toastify";
import { toastStyle } from "@/utils/toast";
import { db, storage } from "./config";
import { uploadToCloudinary } from "../cloudinary/cloudinary.service";

// ADD BANNERSETTING COLLECTION
export async function addBannerSetting(bannerSetting) {
  try {
    const { feature_images = [] } = bannerSetting;

    if (!Array.isArray(feature_images) || feature_images.length === 0) {
      toast.error("No feature images selected.", toastStyle);
      return { success: false };
    }

    const bannerSettingRef = collection(db, "bannerSetting");
    const bannerSettingSnapshot = await getDocs(bannerSettingRef);
    let existingDoc = bannerSettingSnapshot.docs[0];

    let existingImages = existingDoc ? existingDoc.data().imageUrls || [] : [];

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

    const updatedImages = [...existingImages, ...imageUrls];

    if (existingDoc) {
      await updateDoc(doc(db, "bannerSetting", existingDoc.id), {
        imageUrls: updatedImages,
        updatedAt: Timestamp.now(),
      });
    } else {
      await addDoc(bannerSettingRef, {
        imageUrls: updatedImages,
        createdAt: Timestamp.now(),
      });
    }

    toast.success("Banner image uploaded successfully", toastStyle);
    return { success: true };
  } catch (error) {
    console.error("ERROR BANNER:", error);
    toast.error(error.message, toastStyle);
    return { success: false, error: error.message };
  }
}

// DELETE BANNERSETTING IMAGE
export async function deleteBannerSettingImage(imagePath) {
  try {
    if (!imagePath) {
      toast.error("Invalid image path.", toastStyle);
      return { success: false };
    }

    const bannerSettingRef = collection(db, "bannerSetting");
    const bannerSettingSnapshot = await getDocs(bannerSettingRef);
    let existingDoc = bannerSettingSnapshot.docs[0];

    if (!existingDoc) {
      toast.error("No document found to delete images from.", toastStyle);
      return { success: false };
    }

    let existingImages = existingDoc.data().imageUrls || [];

    const updatedImages = existingImages.filter(
      (img) => img.path !== imagePath
    );

    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);

    await updateDoc(doc(db, "bannerSetting", existingDoc.id), {
      imageUrls: updatedImages,
      updatedAt: Timestamp.now(),
    });

    toast.success("Image deleted successfully.", toastStyle);
    return { success: true };
  } catch (error) {
    console.error("Error deleting image:", error);
    toast.error(error.message, toastStyle);
    return { success: false, error: error.message };
  }
}

// GET BANNERSETTING COLLECTION
export async function getBannerSetting() {
  try {
    const querySnapshot = await getDocs(collection(db, "bannerSetting"));
    const bannerSettingItems = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : null,
    }));
    return bannerSettingItems;
  } catch (error) {
    console.error("Error fetching bannerSetting items:", error);
    toast.error("Failed to fetch bannerSetting items", toastStyle);
    return [];
  }
}

