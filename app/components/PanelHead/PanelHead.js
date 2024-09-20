import Link from "next/link";
import React from "react";

const PanelHead = ({ tittle, btnTitle, onClick, btnLinkTitle, btnLink }) => {
  return (
    <>
      {tittle && (
        <div className="panel_header">
          <div className="title_panel">
            <p className="title">{tittle}</p>
          </div>

          {btnTitle ? (
            <button className="action_button" onClick={onClick}>
              {btnTitle}
            </button>
          ) : btnLinkTitle ? (
            <Link href={btnLink ? btnLink : "#"}>
              <button className="action_button">{btnLinkTitle}</button>
            </Link>
          ) : null}
        </div>
      )}
    </>
  );
};

export default PanelHead;
