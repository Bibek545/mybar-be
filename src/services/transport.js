import nodemailer from "nodemailer";
// export const emailTransporter = () => {
//   //creating a SMTP transporter object
//   const transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: process.env.SMTP_PORT,
//     secure: false, // true for 465, false for other ports
//     auth: {
//       user: process.env.SMTP_EMAIL,
//       pass: process.env.SMTP_PASS,
//     },
//   });
//   transporter.verify((err, success) => {
//   if (err) console.error("[SMTP Verify Error]", err);
//   else console.log("[SMTP Verify] Server ready:", success);
// });
//   return transporter;
// };

export const emailTransporter = () => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.ethereal.email",
    port: Number(process.env.SMTP_PORT) || 587,   // cast to number
    secure: false, // true for 465 only
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASS,
    },
    logger: true,   // show SMTP logs
    debug: true,    // verbose conversation
  });
  return transporter;
};

// call this once at server startup (no singleton)
export const verifyEmailConnection = async () => {
  try {
    const t = emailTransporter();
    await t.verify();
    console.log("[SMTP Verify] OK");
  } catch (err) {
    console.error("[SMTP Verify Error]", err);
  }
};
