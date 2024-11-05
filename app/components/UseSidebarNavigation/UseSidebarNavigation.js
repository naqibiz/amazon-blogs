"use client";
import useDynamicRoutes from "@/app/_method/useDynamicRoutes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import useAuthRedirect from "../useAuthRedirect/useAuthRedirect";
import { RiArrowRightSLine } from "react-icons/ri";

const UseSidebarNavigation = () => {
  const pathname = usePathname();
  const [sidebarNavigation] = useDynamicRoutes(pathname);
  const { currentUser } = useAuthRedirect();

  return (
    <section className="use_navigation_wrapper">
      <div className="header_content">
        <img src="/assets/images/amazon-icon.svg" alt="" />
        <div className="user_detail">
          <p>{currentUser?.displayName}</p>
          <p>{currentUser?.email}</p>
        </div>
      </div>

      <div className="user_navigation_body">
        {sidebarNavigation && sidebarNavigation?.length > 0 && (
          <div className="navigation_links">
            {sidebarNavigation?.map((item, i) => (
              <div key={i} className="navigation_links_grid">
                <Link href={item?.route}>
                  {item?.icon} {item?.name}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default UseSidebarNavigation;
