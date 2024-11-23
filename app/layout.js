import { Inter, Rubik } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/Footer";
import ProgressBarRouting from "./components/ProgressBarRouting/ProgressBarRouting";

const rubik = Rubik({ subsets: ["latin"] });

export const metadata = {
  title: "itemzfinder",
  description: "A blog showcasing and promoting various products",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />

        <meta property="og:title" content="itemzfinder" />
        <meta
          property="og:description"
          content="A blog showcasing and promoting various products"
        />
        <meta property="og:image" content="/assets/images/dark-logo.svg" />
        <meta property="og:url" content="https://amazon-blogs.vercel.app/" />
        <meta property="og:type" content="website" />
      </head>
      <body className={rubik.className}>
        <div className="itemzfinder_content_body">
          <ProgressBarRouting />
          <Header />
          <div className="content_middle_body">{children}</div>
          <ToastContainer />
          <Footer />
        </div>
      </body>
    </html>
  );
}
