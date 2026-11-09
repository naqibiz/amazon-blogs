import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { toastStyle } from "@/utils/toast";
import { db } from "./config";

// ADD NAVIGATION
export async function addNavigation(navInfo) {
  try {
    const { nav_name, category, category_type, type } = navInfo;
    await addDoc(collection(db, "navigations"), {
      nav_name,
      category,
      category_type,
      type,
    });

    toast.success("Navigation item added successfully", toastStyle);
    return { success: true };
  } catch (error) {
    toast.error(error.message, toastStyle);
    return { success: false, error: error.message };
  }
}

// GET NAVIGATION
export async function getNavigationItems() {
  try {
    const querySnapshot = await getDocs(collection(db, "navigations"));
    const navigationItems = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return navigationItems;
  } catch (error) {
    console.error("Error fetching navigation items:", error);
    toast.error("Failed to fetch navigation items", toastStyle);
    return [];
  }
}

// UPDATE NAVIGATION ITEM
export async function updateNavigationItem(id, updatedData) {
  try {
    const navigationDoc = doc(db, "navigations", id);
    await updateDoc(navigationDoc, updatedData);
    toast.success("Navigation item updated successfully", toastStyle);
    return { success: true };
  } catch (error) {
    toast.error(error.message, toastStyle);
    return { success: false, error: error.message };
  }
}

// DELETE NAVIGATION ITEM
export async function deleteNavigationItem(id) {
  try {
    const navigationDoc = doc(db, "navigations", id);
    await deleteDoc(navigationDoc);
    toast.success("Navigation item deleted successfully", toastStyle);
    return { success: true };
  } catch (error) {
    toast.error(error.message, toastStyle);
    return { success: false, error: error.message };
  }
}

