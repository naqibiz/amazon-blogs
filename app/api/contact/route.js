import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const { email, message } = await request.json();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "naqighabrani@gmail.com",
      pass: "jxow rmdb zyct tvlu",
    },
  });

  const mailOptions = {
    from: "naqighabrani@gmail.com",
    to: email,
    subject: "New Contact Form Submission",
    text: message,
    html: `<h1>Contact Form Submission</h1><p>${message} ${email}</p>`,
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
