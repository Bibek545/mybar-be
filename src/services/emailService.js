import { emailTransporter } from "./transport.js";
import {
  userActivationTemplate,
  userAccountVerfiedNotificationTemplate,
  passwordResetOTPsendTemplate,
  userProfileUpdateNotificationTemplate,
  bookingReceivedTemplate,
  bookingUpdatedTemplate,
  bookingCancelledTemplate,
  bookingReminderTemplate,
  paymentReceiptTemplate,
  feedbackRequestTemplate,
  rewardsDeltaTemplate,
  pointsExpiringTemplate,
  referralInviteTemplate,
  referralSuccessTemplate,
  bookingConfirmedTemplate,
} from "./emailTemplates.js";
import nodemailer from "nodemailer";
export const userActivationEmail = async (obj) => {
  const transport = emailTransporter();
  const info = await transport.sendMail(userActivationTemplate(obj));
  console.log(info.messageId);
  return info.messageId;
};

export const userAccountVerfiedNotification = async (obj) => {
  const transport = emailTransporter();
  const info = await transport.sendMail(
    userAccountVerfiedNotificationTemplate(obj)
  );
  return info.messageId;
};

//GENERATE AND SEND THE OTP TO THE USER VIA EMAIL
export const passwordResetOTPSendEmail = async (obj) => {
  const transport = emailTransporter();
  const info = await transport.sendMail(passwordResetOTPsendTemplate(obj));
  return info.messageId;
};

//NOTIFY THE USER ABOUT UPDATING PROFILE
export const userProfileUpdateNotificationEmail = async (obj) => {
  const transport = emailTransporter();
  const info = await transport.sendMail(
    userProfileUpdateNotificationTemplate(obj)
  );
  return info.messageId;
};

// Booking lifecycle
// export const sendBookingReceived = async (obj) => {
//   const transport = emailTransporter();
//   const info = await transport.sendMail(bookingReceivedTemplate(obj));
//   return info.messageId;
// };

// export const sendBookingReceived = async (obj) => {
//   const transport = emailTransporter();
//   const info = await transport.sendMail(bookingReceivedTemplate(obj));
//   console.log("[mail] id:", info.messageId);
//   const preview = nodemailer.getTestMessageUrl(info); // Ethereal preview
//   if (preview) console.log("[mail preview]", preview);
//   return info.messageId;
// };

export const sendBookingReceived = async (obj) => {
  const transport = emailTransporter();
  const mail = bookingReceivedTemplate(obj);

  // safety: ensure sender & recipient exist
  mail.from ||= `"The Hidden Pour" <${process.env.SMTP_EMAIL}>`;
  if (!mail.to && obj?.email) mail.to = obj.email;

  try {
    console.log("[mail] sending booking-received to:", mail.to);
    const info = await transport.sendMail(mail);
    console.log("[mail] id:", info.messageId);
    const preview = nodemailer.getTestMessageUrl(info);
    if (preview) console.log("[mail preview]", preview);
    return info.messageId;
  } catch (e) {
    // console.error("[mail booking-received ERROR]", {
    //   msg: e.message,
    //   code: e.code,
    //   command: e.command,
    //   response: e.response,
    //   responseCode: e.responseCode,
    // });
      console.error("[mail booking-received ERROR]", e);
    throw e;
  }
};

export const sendBookingConfirmed = async (obj) => {
  const transport = emailTransporter();
  const info = await transport.sendMail(bookingConfirmedTemplate(obj));
  return info.messageId;
};

export const sendBookingUpdated = async (obj) => {
  const transport = emailTransporter();
  const info = await transport.sendMail(bookingUpdatedTemplate(obj));
  return info.messageId;
};

export const sendBookingCancelled = async (obj) => {
  const transport = emailTransporter();
  const info = await transport.sendMail(bookingCancelledTemplate(obj));
  return info.messageId;
};

export const sendBookingReminder = async (obj) => {
  const transport = emailTransporter();
  const info = await transport.sendMail(bookingReminderTemplate(obj));
  return info.messageId;
};

// Payments / Rewards / Referrals

export const sendPaymentReceipt = async (obj) => {
  const transport = emailTransporter();
  const info = await transport.sendMail(paymentReceiptTemplate(obj));
  return info.messageId;
};

export const sendFeedbackRequest = async (obj) => {
  const transport = emailTransporter();
  const info = await transport.sendMail(feedbackRequestTemplate(obj));
  return info.messageId;
};

export const sendRewardsDelta = async (obj) => {
  const transport = emailTransporter();
  const info = await transport.sendMail(rewardsDeltaTemplate(obj));
  return info.messageId;
};

export const sendPointsExpiring = async (obj) => {
  const transport = emailTransporter();
  const info = await transport.sendMail(pointsExpiringTemplate(obj));
  return info.messageId;
};

export const sendReferralInvite = async (obj) => {
  const transport = emailTransporter();
  const info = await transport.sendMail(referralInviteTemplate(obj));
  return info.messageId;
};

export const sendReferralSuccess = async (obj) => {
  const transport = emailTransporter();
  const info = await transport.sendMail(referralSuccessTemplate(obj));
  return info.messageId;
};
