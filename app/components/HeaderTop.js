"use client";
import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { LuSearch } from "react-icons/lu";
import { FaPhoneVolume } from "react-icons/fa6";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { RiLogoutCircleLine } from "react-icons/ri";
import { signOut } from "firebase/auth";
import { auth } from "../database/firebaseConfig";
import { toast } from "react-toastify";
import { toastStyle } from "../_method/utils";
import useAuthRedirect from "./useAuthRedirect/useAuthRedirect";
import SearchProducts from "./SearchProducts";

const HeaderTop = () => {
  const router = useRouter();
  const { currentUser } = useAuthRedirect();
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully", toastStyle);
      router.push("/admin-panel-auth");
    } catch (error) {
      console.error("Logout error", error);
      toast.error("Failed to log out", toastStyle);
    }
  };

  return (
    <div className="header_top_content">
      <div className="header_logo">
        <Link href={"/"}>
          <img src="/assets/images/light-logo.svg" alt="itemzfinder" />
        </Link>
      </div>
      <div className="search-blog">
          <Form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <LuSearch color="#f3971b" size={22} className="search_icon" />
            <input
              className="form-control"
              placeholder="Search for products..."
              required
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              type="text"
              aria-label="Search Blogs"
            />
          </Form>
          {searchTerm.length > 2 && (
            <SearchProducts
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          )}
        </div>
      <div className="header_right_section">
        {currentUser ? (
          <button className="logout_panel" onClick={() => handleLogout()}>
            <RiLogoutCircleLine size={22} />
            <span>Logout</span>
          </button>
        ) : (
          <div className="contact_section">
            <a href="tel:+92 331 2299471">
              <FaPhoneVolume size={22} color="#ffffff" />
              <span>+92 331 2299471</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderTop;
