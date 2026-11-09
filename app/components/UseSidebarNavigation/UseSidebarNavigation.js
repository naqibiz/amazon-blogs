"use client";
import React from "react";
import useDynamicRoutes from "@/app/_method/useDynamicRoutes";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import useAuthRedirect from "../useAuthRedirect/useAuthRedirect";
import SkeletonLoader from "../SkeletonLoader/SkeletonLoader";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { signOut } from "firebase/auth";
import { auth } from "@/services/firebase/config";
import { toast } from "react-toastify";
import { toastStyle } from "@/utils/toast";

const UseSidebarNavigation = () => {
  const pathname = usePathname();
  const router = useRouter();
  const routesResult = useDynamicRoutes(pathname);
  const sidebarNavigation = Array.isArray(routesResult?.[0])
    ? routesResult[0]
    : Array.isArray(routesResult)
    ? routesResult
    : [];
  const { currentUser } = useAuthRedirect();

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
    <section className="use_navigation_wrapper">
      <div className="header_content">
        <div className="avatar_wrapper">
          <img src="/assets/images/amazon-icon.svg" alt="Admin Avatar" />
        </div>

        <div className="user_detail">
          {currentUser ? (
            <>
              <p className="user_name">{currentUser?.displayName || "Muhammad Naqi"}</p>
              <p className="user_email">{currentUser?.email || "Admin"}</p>
              <span className="admin_badge">Administrator</span>
            </>
          ) : (
            <>
              <SkeletonLoader height={16} width={140} />
              <SkeletonLoader height={12} width={160} />
            </>
          )}
        </div>
      </div>

      <div className="user_navigation_body">
        <p className="nav_section_label">Main Menu</p>
        {sidebarNavigation && sidebarNavigation?.length > 0 && (
          <div className="navigation_links">
            {sidebarNavigation?.map((item, i) => {
              const isActive =
                pathname === item?.route ||
                (item?.route !== "/panel/dashboard" &&
                  pathname?.startsWith(item?.route));
              return (
                <div
                  key={i}
                  className={`navigation_links_grid ${isActive ? "active" : ""}`}
                >
                  <Link href={item?.route}>
                    <span className="nav_icon">{item?.icon}</span>
                    <span className="nav_text">{item?.name}</span>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="sidebar_footer">
        <button className="sidebar_logout_btn" onClick={handleLogout}>
          <RiLogoutCircleRLine size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </section>
  );
};

export default UseSidebarNavigation;
