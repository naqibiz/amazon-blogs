"use client";
import useDynamicRoutes from "@/app/_method/useDynamicRoutes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import useAuthRedirect from "../useAuthRedirect/useAuthRedirect";

const UseSidebarNavigation = () => {
  const pathname = usePathname();
  const [sidebarNavigation] = useDynamicRoutes(pathname);
  const { user, loading } = useAuthRedirect();

  console.log(sidebarNavigation, "sidebarNavigation====<>");

  // NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCXEOIuTQdzBG5PLAl8ebD0kmadiIuSrR8
  // NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=itemzfinder-f4b36.firebaseapp.com
  // NEXT_PUBLIC_FIREBASE_PROJECT_ID=itemzfinder-f4b36
  // NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=itemzfinder-f4b36.appspot.com
  // NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=817082182012
  // NEXT_PUBLIC_FIREBASE_APP_ID=1:817082182012:web:3057a6f2a5ced1e8611cf9
  // NEXT_MEASUREMENT_ID=G-NH1327KFEG

  return (
    <section className="use_navigation_wrapper">
      <div className="sidebar_header">
        <img src="/assets/images/amazon-icon.svg" alt="" />

        <p className="user_information">
          <span>{user?.displayName ? user?.displayName : "User Name"}</span>
          <span>{user?.email ? user?.email : "User Email"}</span>
        </p>
      </div>
      {/* <div className="header_content">
        <img src="/assets/images/amazon-icon.svg" alt="" />
        <div className="user_detail">
          <p>{user?.displayName || "Loading..."}</p>
          <p>{user?.email || "Loading..."}</p>
        </div>
      </div>

      <div className="user_navigation_body">
        {sidebarNavigation[0] && sidebarNavigation[0]?.length > 0 && (
          <div className="navigation_links">
            {sidebarNavigation[0]?.map((item, i) => (
              <div key={i}>
                <Link href={item?.route}>
                  {item?.icon} {item?.name}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div> */}
    </section>
  );
};

export default UseSidebarNavigation;
