import React from "react";

const PanelHead = ({ tittle, btnTitle, onClick }) => {
  return (
    <>
      {tittle && (
        <div className="panel_header">
          <div className="title_panel">
            <p className="title">{tittle}</p>
          </div>

          {btnTitle && (
            <button className="action_button" onClick={onClick}>
              {btnTitle}
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default PanelHead;
