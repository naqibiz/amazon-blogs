import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { firstname, lastname, phone, email, message } = await req.json();

    // Create transporter object
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER, // The email that will appear as the sender
      to: process.env.EMAIL_USER, // Your email (the owner who will receive the messages)
      subject: "New Contact Form Submission",
      html: `
        <h1>New Contact Submission</h1>
        <p><strong>Full Name:</strong> ${firstname} ${lastname}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
