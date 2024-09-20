"use client";
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { toast } from "react-toastify";
import { toastStyle } from "../_method/utils";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_MEASUREMENT_ID,
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// SIGNUP USER
export async function register(userInfo) {
  try {
    const { email, password, fullName } = userInfo;
    await createUserWithEmailAndPassword(auth, email, password);
    await addDoc(collection(db, "users"), {
      fullName,
      email,
    });

    toast.success("User added successfully", toastStyle);
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      toast.error("User already exists", toastStyle);
    } else {
      console.error("Error signing up:", error);
      toast.error(error.message, toastStyle);
    }
  }
}

// SIGNIN USER
export async function login(userInfo) {
  try {
    const { email, password } = userInfo;
    await signInWithEmailAndPassword(auth, email, password);
    toast.success("Panel successfully logged In", toastStyle);
  } catch (error) {
    if (error.code === "auth/invalid-credential") {
      toast.error(
        "Invalid credentials. Please check your email and password.",
        toastStyle
      );
    } else {
      toast.error(error.message, toastStyle);
    }
  }
}

// ADD NAVIGATION
export async function addNavigation(navInfo) {
  try {
    const { nav_name, category, category_type } = navInfo;
    await addDoc(collection(db, "navigations"), {
      nav_name,
      category,
      category_type,
    });

    toast.success("Navigation item added successfully", toastStyle);
  } catch (error) {
    toast.error(error.message, toastStyle);
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
  } catch (error) {
    toast.error(error.message, toastStyle);
  }
}

// DELETE NAVIGATION ITEM
export async function deleteNavigationItem(id) {
  try {
    const navigationDoc = doc(db, "navigations", id);
    await deleteDoc(navigationDoc);
    toast.success("Navigation item deleted successfully", toastStyle);
  } catch (error) {
    toast.error(error.message, toastStyle);
  }
}

// ADD CATEGORY COLLECTION
export async function addCategoryCollection(categoryInfo) {
  try {
    const { category_name, category_slug } = categoryInfo;
    await addDoc(collection(db, "categories"), {
      category_name,
      category_slug,
    });

    toast.success("Category added successfully", toastStyle);
  } catch (error) {
    toast.error(error.message, toastStyle);
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
export async function updateCategoryCollections(id, updatedData) {
  try {
    const categoryDoc = doc(db, "categories", id);
    await updateDoc(categoryDoc, updatedData);
    toast.success("Category updated successfully", toastStyle);
  } catch (error) {
    toast.error(error.message, toastStyle);
  }
}

// DELETE CATEGORY COLLECTION
export async function deleteCategoryCollections(id) {
  try {
    const categoryDoc = doc(db, "categories", id);
    await deleteDoc(categoryDoc);
    toast.success("Category deleted successfully", toastStyle);
  } catch (error) {
    toast.error(error.message, toastStyle);
  }
}

// ADD CONTACT COLLECTION
export async function addContactUs(contactInfo) {
  try {
    const { firstname, lastname, phone, email, message } = contactInfo;
    await addDoc(collection(db, "contactus"), {
      firstname,
      lastname,
      phone,
      email,
      message,
    });

    toast.success("Contact message added successfully", toastStyle);
  } catch (error) {
    console.log("ERROR CONTACT:", error);
    toast.error(error.message, toastStyle);
  }
}
