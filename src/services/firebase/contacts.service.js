import {
  addDoc,
  collection,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { toastStyle } from "@/utils/toast";
import { db } from "./config";

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

    return { success: true };
  } catch (error) {
    console.error("ERROR CONTACT:", error);
    toast.error(error.message, toastStyle);
    return { success: false, error: error.message };
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

