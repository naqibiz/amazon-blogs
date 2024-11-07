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
  getDoc,
  getDocs,
  getFirestore,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";
import { toast } from "react-toastify";
import { toastStyle } from "../_method/utils";
import { v4 as uuidv4 } from "uuid";

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
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await updateProfile(userCredential.user, { displayName: fullName });
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
    const { category_name, category_slug, feature_images = [] } = categoryInfo;

    if (!Array.isArray(feature_images) || feature_images.length === 0) {
      toast.error("No feature images selected.", toastStyle);
      return;
    }

    const imageUploadPromises = feature_images.map(async (image) => {
      if (image && image.name) {
        try {
          const uniqueId = uuidv4();
          const newImageName = `${uniqueId}-${image.name}`;

          const storageRef = ref(storage, `category/${newImageName}`);
          await uploadBytes(storageRef, image);
          const url = await getDownloadURL(storageRef);

          return { url, path: storageRef.fullPath };
        } catch (err) {
          console.error("Failed to upload image:", image.name, err);
          return null;
        }
      } else {
        console.error("Invalid image:", image);
        return null;
      }
    });

    const imageUrls = (await Promise.all(imageUploadPromises)).filter(Boolean);

    if (imageUrls.length === 0) {
      toast.error("Failed to upload images.", toastStyle);
      return;
    }

    await addDoc(collection(db, "categories"), {
      category_name,
      category_slug,
      imageUrls,
      createdAt: Timestamp.now(),
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
      const storageRef = ref(storage, removedPath);
      await deleteObject(storageRef);
    }

    const updatedImageUrls = [];

    for (const image of newImages) {
      if (image && image.name) {
        const uniqueId = uuidv4();
        const newImageName = `${uniqueId}-${image.name}`;

        const storageRef = ref(storage, `category/${newImageName}`);
        await uploadBytes(storageRef, image);
        const url = await getDownloadURL(storageRef);
        updatedImageUrls.push({ url, path: storageRef.fullPath });
      }
    }

    const finalImageUrls = [...filteredExistingImages, ...updatedImageUrls];

    await updateDoc(categoryDoc, { ...updatedData, imageUrls: finalImageUrls });

    toast.success("Category updated successfully", toastStyle);
  } catch (error) {
    toast.error(error.message, toastStyle);
  }
}

// DELETE CATEGORY COLLECTION
export async function deleteCategoryCollections(id) {
  try {
    const categoryDoc = doc(db, "categories", id);
    const categorySnapshot = await getDoc(productDoc);

    if (categorySnapshot.exists()) {
      const productData = categorySnapshot.data();

      const imageDeletions = productData.imageUrls.map(async (image) => {
        const imageRef = ref(storage, image.path);
        await deleteObject(imageRef);
      });

      await Promise.all(imageDeletions);

      await deleteDoc(categoryDoc);

      toast.success("Category deleted successfully", toastStyle);
    } else {
      toast.error("Product not found", toastStyle);
    }
  } catch (error) {
    toast.error(error.message, toastStyle);
  }
}

// ADD CONTACT COLLECTION
export async function addContactUs(contactInfo) {
  try {
    const { fullname, firstname, lastname, phone, email, message } =
      contactInfo;
    await addDoc(collection(db, "contactus"), {
      fullname,
      firstname,
      lastname,
      phone,
      email,
      message,
      createdAt: Timestamp.now(),
    });

    // toast.success("Contact message added successfully", toastStyle);
  } catch (error) {
    console.log("ERROR CONTACT:", error);
    toast.error(error.message, toastStyle);
  }
}

// GET CONTACT COLLECTION
export async function getContactUs() {
  try {
    const querySnapshot = await getDocs(collection(db, "contactus"));
    const contactData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : null,
    }));
    return contactData;
  } catch (error) {
    console.error("Error fetching contact:", error);
    toast.error("Failed to fetch contact", toastStyle);
    return [];
  }
}

// ADD SUBSCRIPTION COLLECTION
export async function addSubscription(subscriptionInfo) {
  try {
    const { email, status } = subscriptionInfo;

    const q = query(
      collection(db, "subscription"),
      where("email", "==", email)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      toast.info(`The email ${email} is already subscribed`, toastStyle);
      return;
    }

    await addDoc(collection(db, "subscription"), {
      email,
      status: "Subscribed",
      createdAt: Timestamp.now(),
    });

    toast.success(
      `Thank you! ${email} is now subscribed to our newsletter.`,
      toastStyle
    );
  } catch (error) {
    console.log("ERROR SUBSCRIPTION:", error);
    toast.error(`Failed to add subscription: ${error.message}`, toastStyle);
  }
}

// GET SUBSCRIPTION COLLECTION
export async function getSubscription() {
  try {
    const querySnapshot = await getDocs(collection(db, "subscription"));
    const contactData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : null,
    }));
    return contactData;
  } catch (error) {
    console.error("Error fetching subscription:", error);
    toast.error("Failed to fetch subscription", toastStyle);
    return [];
  }
}

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
      return;
    }

    const productsRef = collection(db, "products");
    const q = query(
      productsRef,
      where("product_number_sin", "==", product_number_sin)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      toast.info("A product with this SIN number already exists.", toastStyle);
      return;
    }

    const imageUploadPromises = feature_images.map(async (image) => {
      if (image && image.name) {
        try {
          const uniqueId = uuidv4();
          const newImageName = `${uniqueId}-${image.name}`;

          const storageRef = ref(storage, `product/${newImageName}`);
          await uploadBytes(storageRef, image);
          const url = await getDownloadURL(storageRef);

          return { url, path: storageRef.fullPath };
        } catch (err) {
          console.error("Failed to upload image:", image.name, err);
          return null;
        }
      } else {
        console.error("Invalid image:", image);
        return null;
      }
    });

    const imageUrls = (await Promise.all(imageUploadPromises)).filter(Boolean);

    if (imageUrls.length === 0) {
      toast.error("Failed to upload images.", toastStyle);
      return;
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
  } catch (error) {
    console.log("ERROR PRODUCT:", error);
    toast.error(error.message, toastStyle);
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
      const storageRef = ref(storage, removedPath);
      await deleteObject(storageRef);
    }

    const updatedImageUrls = [];

    for (const image of newImages) {
      if (image && image.name) {
        const uniqueId = uuidv4();
        const newImageName = `${uniqueId}-${image.name}`;

        const storageRef = ref(storage, `product/${newImageName}`);
        await uploadBytes(storageRef, image);
        const url = await getDownloadURL(storageRef);
        updatedImageUrls.push({ url, path: storageRef.fullPath });
      }
    }

    const finalImageUrls = [...filteredExistingImages, ...updatedImageUrls];

    await updateDoc(productRef, { ...updatedData, imageUrls: finalImageUrls });

    toast.success("Product updated successfully", toastStyle);
  } catch (error) {
    console.error("Error updating product:", error);
    toast.error("Failed to update product", toastStyle);
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
        const imageRef = ref(storage, image.path);
        await deleteObject(imageRef);
      });

      await Promise.all(imageDeletions);

      await deleteDoc(productDoc);

      toast.success("Product deleted successfully", toastStyle);
    } else {
      toast.error("Product not found", toastStyle);
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    toast.error(error.message, toastStyle);
  }
}

// DASHBOARD (OVERVIEW) FUNCTION
export async function getDashboardOverview() {
  try {
    const categoriesRef = collection(db, "categories");
    const productsRef = collection(db, "products");
    const subscriptionsRef = collection(db, "subscription");
    const contactUsRef = collection(db, "contactus");
    const usersRef = collection(db, "users");

    const [
      categoriesSnapshot,
      productsSnapshot,
      subscriptionsSnapshot,
      contactUsSnapshot,
      usersSnapshot,
    ] = await Promise.all([
      getDocs(categoriesRef),
      getDocs(productsRef),
      getDocs(subscriptionsRef),
      getDocs(contactUsRef),
      getDocs(usersRef),
    ]);

    const overviewData = {
      categories: categoriesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })),
      products: productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })),
      subscriptions: subscriptionsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })),
      contactUs: contactUsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })),
      users: usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
    };

    return overviewData;
  } catch (error) {
    console.error("Error fetching dashboard overview:", error);
    throw new Error("Dashboard overview fetching failed");
  }
}
