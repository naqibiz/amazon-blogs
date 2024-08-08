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

const HeaderTop = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuthRedirect();
  const panelRoute = pathname?.slice(0, 6) == "/panel";
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!loading && user);
  }, [loading, user]);

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
          <img src="/assets/images/logo-amazon.png" alt="" />
        </Link>
      </div>
      {pathname == "/admin-panel-auth" || panelRoute ? null : (
        <div className="search-blog">
          <Form>
            <input
              className="form-control"
              placeholder="Find what you're looking for..."
              required
              type="text"
              aria-label="Search Blogs"
            />
            <button className="search_blog_btn">
              <LuSearch color="#fff" size={25} />
            </button>
          </Form>
        </div>
      )}
      <div className="header_right_section">
        {isAuthenticated ? (
          <button className="logout_panel" onClick={() => handleLogout()}>
            <RiLogoutCircleLine size={20} />
          </button>
        ) : (
          <div className="contact_section">
            <a href="tel:+92 331 2299471">
              <FaPhoneVolume size={25} color="#ffffff" />
              +92 331 2299471
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderTop;
