import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { toast } from "react-toastify";
import { toastStyle } from "@/utils/toast";
import { auth, db } from "./config";

// RESET PASSWORD
export async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    toast.success(
      "Password reset link has been sent to your email.",
      toastStyle
    );
    return { success: true };
  } catch (error) {
    console.error("RESET ERROR:", error);
    toast.error(error.message, toastStyle);
    return { success: false, error: error.message };
  }
}

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
    return { success: true, user: userCredential.user };
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      toast.error("User already exists", toastStyle);
    } else {
      console.error("Error signing up:", error);
      toast.error(error.message, toastStyle);
    }
    return { success: false, error: error.message };
  }
}

// SIGNIN USER
export async function login(userInfo) {
  try {
    const { email, password } = userInfo;
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    toast.success("Panel successfully logged In", toastStyle);
    return { success: true, user: userCredential.user };
  } catch (error) {
    if (error.code === "auth/invalid-credential") {
      toast.error(
        "Invalid credentials. Please check your email and password.",
        toastStyle
      );
    } else if (error.code === "auth/network-request-failed") {
      toast.error("Something went wrong", toastStyle);
    } else {
      toast.error(error.message, toastStyle);
    }
    return { success: false, error: error.message };
  }
}

// LOGOUT USER
export async function logout() {
  try {
    await signOut(auth);
    toast.success("Successfully logged out", toastStyle);
    return { success: true };
  } catch (error) {
    console.error("Error signing out:", error);
    toast.error(error.message, toastStyle);
    return { success: false, error: error.message };
  }
}

