import React from "react";
import SkeletonLoader from "./SkeletonLoader/SkeletonLoader";
import Link from "next/link";

const HeaderBottom = ({ navigationItems, loading }) => {
  console.log(navigationItems, "navigationItemsnavigationItems");
  return (
    <div className="navigation_items">
      <nav>
        <ul>
          {loading ? (
            [1, 2, 3, 4, 5].map((val) => (
              <li key={val}>
                <SkeletonLoader height={20} width={70} />
              </li>
            ))
          ) : navigationItems.length > 0 ? (
            navigationItems.map((nav, i) => (
              <>
                {console.log(nav, "navnav")}
                <li key={i}>
                  <Link
                    href={{
                      pathname: "/product-category",
                      query: {
                        category: nav?.category_type,
                        name: nav?.category,
                      },
                    }}
                  >
                    {nav.nav_name}
                  </Link>
                </li>
              </>
            ))
          ) : (
            <></>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default HeaderBottom;
