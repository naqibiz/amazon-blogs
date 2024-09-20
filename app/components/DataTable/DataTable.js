"use client";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { HiOutlineArrowLeft, HiOutlineArrowRight } from "react-icons/hi";
import PageLoader from "../PageLoader/PageLoader";

const DataTable = ({ data, columns, rowsPerPage, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = data.slice(startIndex, startIndex + rowsPerPage);

  const endIndex = Math.min(startIndex + currentData.length, data.length);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="custom_data_table">
      <Table striped bordered>
        <thead className="data_table_head">
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody className="data_table_body">
          {currentData.map((item) => (
            <tr key={item.id}>
              {columns.map((column) => (
                <td
                  key={column.key}
                  style={{ width: column.key === "action" && 150 }}
                >
                  {column.key === "action" ? (
                    <div className="data_table_crud_action">
                      <button
                        onClick={() => onEdit(item.id)}
                        className="edit_action action"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="delete_action action"
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    item[column.key]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="pagination data_table_pagination">
        <div className="table_pagination_count">
          <p>
            {startIndex + 1}-{endIndex} of {data.length}
          </p>
        </div>
        <div className="pagination_move_button">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`pagination_btn ${currentPage === 1 ? "disabled" : ""}`}
          >
            <HiOutlineArrowLeft color="#fff" />
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`pagination_btn ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <HiOutlineArrowRight color="#fff" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
