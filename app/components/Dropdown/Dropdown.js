"use client";
import React, { useEffect, useRef, useState } from "react";
import { TiArrowSortedUp, TiArrowSortedDown } from "react-icons/ti";

const Dropdown = ({
  searchable = false,
  label = "",
  searchPlaceholder = "",
  selectedValue,
  setSelectedValue,
  data = [],
  searchKey = "",
  displayKey = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const filteredOptions = data.filter((option) => {
    if (typeof option === "object" && option[searchKey]) {
      return option[searchKey].toLowerCase().includes(searchTerm.toLowerCase());
    }
    return false;
  });

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSelectOption = (option) => {
    setSelectedValue(option);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="custom_dropdown">
      {label && <label className="input-label form-label">{label}</label>}
      <div className="dropdown" ref={dropdownRef}>
        <div className="value" onClick={handleToggleDropdown}>
          <p>{selectedValue ? selectedValue : "Select an option"}</p>
          {isOpen ? <TiArrowSortedUp /> : <TiArrowSortedDown />}
        </div>
        {isOpen && (
          <div className="dropdown_main">
            {searchable && (
              <div className="search_input_dropdown">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder={searchPlaceholder}
                />
              </div>
            )}
            <ul>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <li key={index} onClick={() => handleSelectOption(option)}>
                    {option[displayKey]}
                  </li>
                ))
              ) : (
                <li>No options found</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dropdown;
