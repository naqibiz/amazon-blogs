import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { toastStyle } from "@/utils/toast";
import { db } from "./config";

// ADD SUBSCRIPTION COLLECTION
export async function addSubscription(subscriptionInfo) {
  try {
    const { email, status, validity } = subscriptionInfo;

    const q = query(
      collection(db, "subscription"),
      where("email", "==", email)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      toast.info(`The email ${email} is already subscribed`, toastStyle);
      return { success: false, alreadySubscribed: true };
    }

    await addDoc(collection(db, "subscription"), {
      email,
      status: "Subscribed",
      validity,
      createdAt: Timestamp.now(),
    });

    toast.success(
      `Thank you! ${email} is now subscribed to our newsletter.`,
      toastStyle
    );
    return { success: true };
  } catch (error) {
    console.error("ERROR SUBSCRIPTION:", error);
    toast.error(`Failed to add subscription: ${error.message}`, toastStyle);
    return { success: false, error: error.message };
  }
}

// UPDATE SUBSCRIPTION COLLECTION
export async function updateSubscription(id, updatedData) {
  try {
    const subscriptionDoc = doc(db, "subscription", id);
    await updateDoc(subscriptionDoc, updatedData);
    toast.success("Subscription updated successfully", toastStyle);
    return { success: true };
  } catch (error) {
    toast.error(error.message, toastStyle);
    return { success: false, error: error.message };
  }
}

// GET SUBSCRIPTION COLLECTION
export async function getSubscription() {
  try {
    const querySnapshot = await getDocs(collection(db, "subscription"));
    const subscriptionData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : null,
    }));
    return subscriptionData;
  } catch (error) {
    console.error("Error fetching subscription:", error);
    toast.error("Failed to fetch subscription", toastStyle);
    return [];
  }
}

