import nodemailer from 'nodemailer';

export const userActivationTemplate = ({email, name, url}) => {
    return {
        from: `The Hidden Pour <${process.env.SMTP_EMAIL}>`, //this is the sender address
        to: `${email}`, //receivers email
        subject: `'Hello ${name} click the link to activate ypur account.'`,
        html: `
        <p>Hello ${name}</p>
        <br />
        <p>Your account has been created.Click the link to activate the account.</p>
        <br />
        <a href = "${url}">
        <button>Activate your account</button>
        </a> 

        ` //this is the html body

    };
};

export const userAccountVerfiedNotificationTemplate = ({email ,name}) => {
           return {
        from: `'The Hidden Pour <${process.env.SMTP_EMAIL}>'`, //sender address
        to: `${email}`, //list of receivers
        subject: 'Activate your new account', // subject line
        text: `'Hello ${name} Your account is verified and ready to use.'`, //plain text
        html: `
         <p>Hello ${name} </p>  
         <br />
         <p>Your account has been created and verified. You can log in now..</p>
         <br />
   
        
        ` //html body
    };

};


export const passwordResetOTPsendTemplate = ({email, name, otp}) => {
    return {
           from: `'The Hidden Pour <${process.env.SMTP_EMAIL}>'`, //sender address
        to: `${email}`, //list of receivers
        subject: 'Reset your password', // subject line
        text: `'Hello ${name}, here is your OTP to reset the password. This will expire in 5 min ${otp}.'`, //plain text
        html: `
         <p>Dear ${name} </p>  
         <br />
         <p>Here is your OTP to reset the password. This will expire in 5 min.
         <br />

         <br/>
         OTP is ${otp}.</p>
         <br />

         Thank you
   
        
        ` 
    }
};

export const userProfileUpdateNotificationTemplate = ({email , name})=> {
    return {
                from: `'The Hidden Pour <${process.env.SMTP_EMAIL}>'`, //sender address
        to: `${email}`, //list of receivers
        subject: 'Your account has been updated', // subject line
        text: `'Hello ${name}, your account has been updated. If this wasn't you. Change your password and contact us.'`, //plain text
        html: `
         <p>Dear ${name} </p>  
         <br />
         <p>Your account has been updated. If this wasn't you. Change your password and contact us.
         <br />

         <br/>
        
         <br />

         Thank you
   
        
        ` 
    }
}

/* ---------------------- Account / Auth emails ---------------------- */

// export const userActivationTemplate = ({ email, name, url }) => ({
//   to: email,
//   subject: `Hello ${name}, activate your account`,
//   text: `Hello ${name},\nYour account has been created. Activate it here: ${url}`,
//   html: `
//     <p>Hello ${name},</p>
//     <p>Your account has been created. Click the link to activate your account:</p>
//     <p><a href="${url}" target="_blank" rel="noopener">Activate your account</a></p>
//   `,
// });

// export const userAccountVerifiedTemplate = ({ email, name }) => ({
//   to: email,
//   subject: `Your account is verified`,
//   text: `Hello ${name}, your account is verified. You can log in now.`,
//   html: `
//     <p>Hello ${name},</p>
//     <p>Your account has been created and verified. You can log in now.</p>
//   `,
// });

// export const passwordResetOTPTemplate = ({ email, name, otp }) => ({
//   to: email,
//   subject: `Reset your password`,
//   text: `Hello ${name}, here is your OTP to reset the password. It expires in 5 minutes: ${otp}.`,
//   html: `
//     <p>Dear ${name},</p>
//     <p>Here is your OTP to reset the password. It expires in 5 minutes.</p>
//     <p><strong>OTP: ${otp}</strong></p>
//   `,
// });

// export const userProfileUpdatedTemplate = ({ email, name }) => ({
//   to: email,
//   subject: `Your account has been updated`,
//   text: `Hello ${name}, your account was updated. If this wasn’t you, change your password and contact us.`,
//   html: `
//     <p>Dear ${name},</p>
//     <p>Your account was updated. If this wasn’t you, please change your password and contact us.</p>
//   `,
// });

/* ---------------------- Booking emails ---------------------- */

export const bookingReceivedTemplate = ({ email, name, date, time, guests }) => ({
  to: email,
  subject: `We’ve received your booking request`,
  text: `Hi ${name}, we’ve received your booking request for ${date} at ${time} for ${guests} guests.`,
  html: `
    <p>Hi ${name},</p>
    <p>Thanks! We’ve received your booking request:</p>
    <ul>
      <li><strong>Date:</strong> ${date}</li>
      <li><strong>Time:</strong> ${time}</li>
      <li><strong>Guests:</strong> ${guests}</li>
    </ul>
    <p>We’ll email you as soon as it’s confirmed.</p>
  `,
});

// Simple ICS builder (UTC ISO strings recommended for startISO/endISO)
export const buildICS = ({ uid, title, startISO, endISO, location, description }) => [
  "BEGIN:VCALENDAR",
  "VERSION:2.0",
  "PRODID:-//The Hidden Pour//Bookings//EN",
  "CALSCALE:GREGORIAN",
  "METHOD:PUBLISH",
  "BEGIN:VEVENT",
  `UID:${uid}`,
  `DTSTAMP:${startISO.replace(/[-:]/g, "").split(".")[0]}Z`,
  `DTSTART:${startISO.replace(/[-:]/g, "").split(".")[0]}Z`,
  `DTEND:${endISO.replace(/[-:]/g, "").split(".")[0]}Z`,
  `SUMMARY:${title}`,
  `LOCATION:${location || "The Hidden Pour, 15 Hill Rd, Sydney Olympic Park 2127"}`,
  `DESCRIPTION:${(description || "").replace(/\n/g, "\\n")}`,
  "END:VEVENT",
  "END:VCALENDAR",
].join("\r\n");

export const bookingConfirmedTemplate = ({ email, name, date, time, guests, startISO, endISO }) => {
  const ics = buildICS({
    uid: `thp-${Date.now()}@hiddenpour.com`,
    title: "Your booking at The Hidden Pour",
    startISO,
    endISO,
    description: `Table for ${guests} on ${date} at ${time}`,
  });

  return {
    to: email,
    subject: `Your booking is confirmed 🎉`,
    text: `Hi ${name}, your booking for ${date} at ${time} for ${guests} guests is confirmed.`,
    html: `
      <p>Hi ${name},</p>
      <p>Your booking is confirmed:</p>
      <ul>
        <li><strong>Date:</strong> ${date}</li>
        <li><strong>Time:</strong> ${time}</li>
        <li><strong>Guests:</strong> ${guests}</li>
      </ul>
      <p>We’ve attached a calendar file so you can add it to your calendar.</p>
      <p>See you soon!</p>
    `,
    attachments: [{ filename: "THP-Booking.ics", content: ics, contentType: "text/calendar" }],
  };
};

export const bookingUpdatedTemplate = ({ email, name, oldDate, oldTime, date, time, guests }) => ({
  to: email,
  subject: `Your booking was updated`,
  text: `Hi ${name}, your booking changed from ${oldDate} ${oldTime} to ${date} ${time} (${guests} guests).`,
  html: `
    <p>Hi ${name},</p>
    <p>Your booking has been updated:</p>
    <p><strong>Old:</strong> ${oldDate} at ${oldTime}</p>
    <p><strong>New:</strong> ${date} at ${time}, ${guests} guests</p>
  `,
});

export const bookingCancelledTemplate = ({ email, name, date, time }) => ({
  to: email,
  subject: `Your booking was cancelled`,
  text: `Hi ${name}, your booking for ${date} at ${time} has been cancelled.`,
  html: `
    <p>Hi ${name},</p>
    <p>Your booking for <strong>${date}</strong> at <strong>${time}</strong> has been cancelled.</p>
    <p>We hope to see you another time.</p>
  `,
});

export const bookingReminderTemplate = ({ email, name, date, time, guests, startISO, endISO }) => {
  const ics = buildICS({
    uid: `thp-rem-${Date.now()}@hiddenpour.com`,
    title: "Reminder: booking at The Hidden Pour",
    startISO,
    endISO,
    description: `Table for ${guests} on ${date} at ${time}`,
  });

  return {
    to: email,
    subject: `Reminder: your booking is tomorrow`,
    text: `Hi ${name}, reminder for your booking tomorrow: ${date} at ${time} for ${guests} guests.`,
    html: `
      <p>Hi ${name},</p>
      <p>Friendly reminder for your booking <strong>tomorrow</strong>:</p>
      <ul>
        <li><strong>Date:</strong> ${date}</li>
        <li><strong>Time:</strong> ${time}</li>
        <li><strong>Guests:</strong> ${guests}</li>
      </ul>
      <p>We’re excited to host you!</p>
    `,
    attachments: [{ filename: "THP-Booking.ics", content: ics, contentType: "text/calendar" }],
  };
};

/* ---------------------- Payments / Rewards / Referrals ---------------------- */

export const paymentReceiptTemplate = ({ email, name, amount, last4, receiptUrl }) => ({
  to: email,
  subject: `Your payment receipt`,
  text: `Hi ${name}, we received your payment of $${Number(amount).toFixed(2)}. Card **** ${last4}.`,
  html: `
    <p>Hi ${name},</p>
    <p>We received your payment of <strong>$${Number(amount).toFixed(2)}</strong>.</p>
    <p>Card ending with **** ${last4}.</p>
    ${receiptUrl ? `<p><a href="${receiptUrl}">View receipt</a></p>` : ""}
    <p>Thank you!</p>
  `,
});

export const feedbackRequestTemplate = ({ email, name, date }) => ({
  to: email,
  subject: `How was your visit?`,
  text: `Hi ${name}, thanks for visiting on ${date}. We’d love your feedback: https://hiddenpour.com/feedback`,
  html: `
    <p>Hi ${name},</p>
    <p>Thanks for visiting on ${date}. We’d love your feedback:</p>
    <p><a href="https://hiddenpour.com/feedback">Leave feedback</a></p>
  `,
});

export const rewardsDeltaTemplate = ({ email, name, deltaPoints, balance, reason }) => {
  const verb = deltaPoints >= 0 ? "earned" : "redeemed";
  return {
    to: email,
    subject: `You ${verb} ${Math.abs(deltaPoints)} points`,
    text: `Hi ${name}, you ${verb} ${Math.abs(deltaPoints)} points (${reason}). New balance: ${balance} points.`,
    html: `
      <p>Hi ${name},</p>
      <p>You <strong>${verb} ${Math.abs(deltaPoints)}</strong> points (${reason}).</p>
      <p>New balance: <strong>${balance}</strong> points.</p>
    `,
  };
};

export const pointsExpiringTemplate = ({ email, name, expiring, onDate }) => ({
  to: email,
  subject: `Heads up: ${expiring} points expire on ${onDate}`,
  text: `Hi ${name}, ${expiring} of your points expire on ${onDate}. Come in and enjoy a discount before then!`,
  html: `
    <p>Hi ${name},</p>
    <p>${expiring} of your points will expire on <strong>${onDate}</strong>. Come in and enjoy a discount before then!</p>
  `,
});

export const referralInviteTemplate = ({ email, fromName, joinUrl }) => ({
  to: email,
  subject: `${fromName} invited you to The Hidden Pour`,
  text: `${fromName} invited you to The Hidden Pour. Join: ${joinUrl}`,
  html: `
    <p>${fromName} thinks you’ll love The Hidden Pour.</p>
    <p>Join as a member and enjoy perks & points on every visit:</p>
    <p><a href="${joinUrl}" target="_blank" rel="noopener">Join now</a></p>
  `,
});

export const referralSuccessTemplate = ({ email, name, bonus }) => ({
  to: email,
  subject: `Your referral bonus is in 🎉`,
  text: `Hi ${name}, we added ${bonus} points to your account.`,
  html: `
    <p>Hi ${name},</p>
    <p>Your friend just booked—nice! We’ve added <strong>${bonus}</strong> points to your account.</p>
  `,
});
