import { collection, getDocs } from "firebase/firestore";
import { db } from "./config";

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

    const allProducts = productsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const allCategories = categoriesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const overviewData = {
      categories: {
        all: allCategories,
        mostPopular: allCategories.filter(
          (category) => category.category_type === "Most Popular"
        ),
      },
      products: {
        all: allProducts,
        mostPopular: allProducts.filter(
          (product) => product.product_type === "Most Popular"
        ),
      },
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

