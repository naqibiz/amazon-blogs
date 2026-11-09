import React from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ProgressBarRouting from "@/app/components/ProgressBarRouting/ProgressBarRouting";

export default function StorefrontLayout({ children }) {
  return (
    <div className="itemzfinder_content_body">
      <ProgressBarRouting />
      <Header />
      <div className="content_middle_body">{children}</div>
      <Footer />
    </div>
  );
}
