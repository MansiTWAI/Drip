import transporter from "./config/email.js";

const sendTest = async () => {
  try {
    await transporter.sendMail({
      from: `"${process.env.BRAND_NAME || 'Drip'}" <${process.env.EMAIL_USER}>`,
      to: process.env.TEST_EMAIL_TO,
      subject: "Test Email",
      text: `This is a test email from ${process.env.BRAND_NAME || 'Drip'}`
    });
    console.log("Test email sent ✅");
  } catch (err) {
    console.error("Email failed ❌", err);
  }
};

sendTest();
