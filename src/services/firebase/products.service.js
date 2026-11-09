import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { toastStyle } from "@/utils/toast";
import { db } from "./config";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../cloudinary/cloudinary.service";

// ADD PRODUCT COLLECTION
export async function addProduct(products) {
  try {
    const {
      product_title,
      product_description,
      product_short_description,
      product_price,
      product_url,
      category,
      product_type,
      product_number_sin,
      feature_images = [],
      specifications = [],
      about_items = [],
      tags = [],
      categoryType,
    } = products;

    if (!Array.isArray(feature_images) || feature_images.length === 0) {
      toast.error("No feature images selected.", toastStyle);
      return { success: false };
    }

    const productsRef = collection(db, "products");
    const q = query(
      productsRef,
      where("product_number_sin", "==", product_number_sin)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      toast.info("This product already exists.", toastStyle);
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

    await addDoc(collection(db, "products"), {
      product_title,
      product_description,
      product_short_description,
      product_price,
      product_url,
      category,
      imageUrls,
      product_type,
      product_number_sin,
      specifications,
      about_items,
      tags,
      categoryType,
      createdAt: Timestamp.now(),
    });

    toast.success("Product added successfully", toastStyle);
    return { success: true };
  } catch (error) {
    console.error("ERROR PRODUCT:", error);
    toast.error(error.message, toastStyle);
    return { success: false, error: error.message };
  }
}

// GET PRODUCT COLLECTION
export async function getProducts() {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    const productItems = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : null,
    }));
    return productItems;
  } catch (error) {
    console.error("Error fetching product items:", error);
    toast.error("Failed to fetch product items", toastStyle);
    return [];
  }
}

// UPDATE PRODUCT FUNCTION
export async function updateProduct(
  productId,
  updatedData,
  newImages,
  removedImagesPaths
) {
  try {
    const productRef = doc(db, "products", productId);

    const productSnapshot = await getDoc(productRef);
    const existingImages = productSnapshot.exists()
      ? productSnapshot.data().imageUrls || []
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

    await updateDoc(productRef, { ...updatedData, imageUrls: finalImageUrls });

    toast.success("Product updated successfully", toastStyle);
    return { success: true };
  } catch (error) {
    console.error("Error updating product:", error);
    toast.error("Failed to update product", toastStyle);
    return { success: false, error: error.message };
  }
}

// DELETE PRODUCT COLLECTION
export async function deleteProduct(id) {
  try {
    const productDoc = doc(db, "products", id);
    const productSnapshot = await getDoc(productDoc);

    if (productSnapshot.exists()) {
      const productData = productSnapshot.data();

      const imageDeletions = productData.imageUrls.map(async (image) => {
        await deleteFromCloudinary(image.path);
      });

      await Promise.all(imageDeletions);
      await deleteDoc(productDoc);

      toast.success("Product deleted successfully", toastStyle);
      return { success: true };
    } else {
      toast.error("Product not found", toastStyle);
      return { success: false };
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    toast.error(error.message, toastStyle);
    return { success: false, error: error.message };
  }
}

