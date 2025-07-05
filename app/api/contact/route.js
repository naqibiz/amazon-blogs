import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const { email, message } = await request.json();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: "New Contact Form Submission",
    text: message,
    // html: `<h1>Contact Form Submission</h1><p>${message} ${email}</p>`,
    html: `<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px;">
  <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); overflow: hidden;">

    <div style="text-align: center; padding: 40px 0 30px 0; background-color: #ffffff;">
      <img 
        src="https://firebasestorage.googleapis.com/v0/b/itemzfinder-f4b36.appspot.com/o/itemz-finder.png?alt=media&token=5d071c42-6f83-4307-a150-7352bffaccad" 
        alt="Company Logo" 
        style="width: 180px; max-width: 100%; height: auto; display: block; margin: 0 auto;" 
      />
    </div>

    <div style="padding: 0 30px;">
      <h2 style="text-align: center; color: #232f3e; border-bottom: 3px solid #f3971b; padding-bottom: 15px; font-size: 22px;">
        New Contact Form Submission
      </h2>
    </div>

    <div style="padding: 25px 30px 35px 30px; color: #333333; line-height: 1.6;">
      <p style="margin: 0 0 12px; font-size: 15px;">
        <strong style="color: #232f3e;">From Email:</strong> ${email}
      </p>
      <p style="margin: 15px 0 8px;"><strong style="color: #232f3e;">Message:</strong></p>
      <div style="background-color: #fef7f1; padding: 18px; border-left: 5px solid #f3971b; border-radius: 6px; font-size: 15px;">
        ${message}
      </div>
    </div>

    <div style="text-align: center; padding: 20px; font-size: 13px; color: #ffffff; background-color: #232f3e;">
      © ${new Date().getFullYear()} ItemzFinder. All rights reserved.
    </div>

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
