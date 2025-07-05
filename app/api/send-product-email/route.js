import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const { emails, productTitle, productDescription } = await request.json();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"ItemzFinder Team 👋" <${process.env.EMAIL_USER}>`,
    to: emails,
    subject: "🎉 A New Product Has Been Added on ItemzFinder",
    text: productDescription,
    html: `<div
      style="
        font-family: Arial, sans-serif;
        max-width: 650px;
        margin: auto;
        background-color: #ffffff;
        border-radius: 15px;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        padding: 50px;
      "
    >
      <div
        style="
          text-align: center;
          padding: 30px 0;
          background-color: #232f3e;
          color: #ffffff;
          border-bottom: 2px solid #f3971b;
        "
      >
        <span
          style="
            font-size: 36px;
            font-weight: 800;
            letter-spacing: 2px;
            color: #f3971b;
            font-family: 'Segoe UI', Arial, sans-serif;
          "
        >
          Itemz<span style="color: #ffffff">Finder</span>
        </span>
      </div>

      <div style="padding: 30px 30px 10px 30px">
        <h2
          style="
            text-align: center;
            color: #232f3e;
            font-size: 28px;
            margin-bottom: 15px;
            font-weight: 600;
          "
        >
          🎉 New Product Launch!
        </h2>
      </div>

      <div style="padding: 0 30px 30px 30px">
        <h3
          style="
            color: #232f3e;
            font-size: 24px;
            margin-bottom: 15px;
            border-left: 6px solid #f3971b;
            padding-left: 12px;
            font-weight: 600;
          "
        >
          ${productTitle}
        </h3>
      </div>

      <div style="padding: 0 30px 30px 30px">
        <p
          style="
            font-size: 16px;
            color: #333333;
            line-height: 1.8;
            margin-bottom: 30px;
          "
        >
          ${productDescription}
        </p>
      </div>

      <div style="text-align: center; margin-top: 40px">
        <a
          href="#"
          style="
            display: inline-block;
            background-color: #f3971b;
            color: #ffffff;
            padding: 18px 40px;
            text-decoration: none;
            border-radius: 10px;
            font-size: 18px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
          "
        >
          View Product
        </a>
      </div>

            <div
        style="padding: 30px; margin: 40px 0 0 0; border-top: 1px solid #eeeeee"
      >
        <div
          style="
            color: #232f3e;
            font-size: 15px;
            font-weight: 600;
            margin-bottom: 18px;
            letter-spacing: 0.3px;
          "
        >
          CONNECT WITH US
        </div>

        <table
          cellpadding="0"
          cellspacing="0"
          style="width: 100%; font-family: Arial, sans-serif"
        >
          <tr>
            <td
              style="
                width: 100px;
                font-weight: 600;
                color: #555555;
                font-size: 14px;
                padding-bottom: 10px;
                vertical-align: top;
              "
            >
              Website
            </td>
            <td style="padding-bottom: 10px; vertical-align: top">
              <a
                href="https://www.itemzfinder.com"
                target="_blank"
                style="
                  color: #f3971b;
                  font-size: 14px;
                  text-decoration: none;
                  transition: all 0.2s ease;
                "
              >
                itemzfinder.com
              </a>
            </td>
          </tr>
          <tr>
            <td
              style="
                width: 100px;
                font-weight: 600;
                color: #555555;
                font-size: 14px;
                padding-bottom: 10px;
                vertical-align: top;
              "
            >
              YouTube
            </td>
            <td style="padding-bottom: 10px; vertical-align: top">
              <a
                href="https://youtube.com/itemzfinder"
                target="_blank"
                style="
                  color: #f3971b;
                  font-size: 14px;
                  text-decoration: none;
                  transition: all 0.2s ease;
                "
              >
                youtube.com/itemzfinder
              </a>
            </td>
          </tr>
          <tr>
            <td
              style="
                width: 100px;
                font-weight: 600;
                color: #555555;
                font-size: 14px;
                padding-bottom: 10px;
                vertical-align: top;
              "
            >
              Facebook
            </td>
            <td style="padding-bottom: 10px; vertical-align: top">
              <a
                href="https://facebook.com/itemzfinder"
                target="_blank"
                style="
                  color: #f3971b;
                  font-size: 14px;
                  text-decoration: none;
                  transition: all 0.2s ease;
                "
              >
                facebook.com/itemzfinder
              </a>
            </td>
          </tr>
          <tr>
            <td
              style="
                width: 100px;
                font-weight: 600;
                color: #555555;
                font-size: 14px;
                padding-bottom: 0;
                vertical-align: top;
              "
            >
              Instagram
            </td>
            <td style="padding-bottom: 0; vertical-align: top">
              <a
                href="https://instagram.com/itemzfinder"
                target="_blank"
                style="
                  color: #f3971b;
                  font-size: 14px;
                  text-decoration: none;
                  transition: all 0.2s ease;
                "
              >
                instagram.com/itemzfinder
              </a>
            </td>
          </tr>
        </table>
      </div>

      <div
        style="
          background-color: #232f3e;
          color: #ffffff;
          padding: 20px;
          text-align: center;
        "
      >
        <p style="font-size: 14px; margin: 0">
          © ${new Date().getFullYear()} ItemzFinder. All rights reserved.
        </p>
      </div>
    </div>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json(
      { message: "Contact message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(
      { message: "Error sending message" },
      { status: 500 }
    );
  }
};
