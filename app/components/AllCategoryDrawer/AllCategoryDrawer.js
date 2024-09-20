"use client";
import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { RxCross2 } from "react-icons/rx";
import InputFormControl from "../InputFormControl/InputFormControl";
import Link from "next/link";

const AllCategoryDrawer = ({ handleCategoryDrawer, navigationItems }) => {
  console.log(navigationItems, "navigationItems");
  const [searchCollection, setSearchCollection] = useState("");

  const filteredItems = navigationItems?.filter((item) =>
    item.nav_name.toLowerCase().includes(searchCollection.toLowerCase())
  );

  return (
    <div className="category_menu_drawer_content">
      <div className="drawer_header">
        <p>Multiple Collections</p>
        <div className="close" onClick={handleCategoryDrawer}>
          <RxCross2 color="#fff" size={25} />
        </div>
      </div>
      <div className="search_collection">
        <Form>
          <InputFormControl
            required={true}
            type="text"
            value={searchCollection}
            placeholder="Search Collection"
            onChange={(e) => setSearchCollection(e.target.value)}
          />
        </Form>
      </div>

      {/* on the search collection response collection */}
      <div className="collection_list">
        <div className="collection_list_inner">
          <ul>
            {filteredItems && filteredItems.length > 0 ? (
              filteredItems.map((nav, i) => (
                <li key={i} onClick={handleCategoryDrawer}>
                  <Link
                    href={{
                      pathname: "/product-category",
                      query: {
                        category: nav?.category_type,
                        name: nav?.category,
                      },
                    }}
                  >
                    <div>{nav?.nav_name}</div>
                  </Link>
                </li>
              ))
            ) : (
              <li>No collections found</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AllCategoryDrawer;
