import { emailTransporter } from "./transport.js";
import { userActivationTemplate, userAccountVerfiedNotificationTemplate, passwordResetOTPsendTemplate, userProfileUpdateNotificationTemplate } from "./emailTemplates.js";

export const userActivationEmail = async (obj) => {
    const transport = emailTransporter();
    const info = await transport.sendMail(userActivationTemplate(obj));
    console.log(info.messageId);
    return info.messageId;
    
};


export const  userAccountVerfiedNotification = async (obj)=> {
    const transport = emailTransporter();
    const info = await transport.sendMail(userAccountVerfiedNotificationTemplate(obj));
    return info.messageId;
};

//GENERATE AND SEND THE OTP TO THE USER VIA EMAIL
export const passwordResetOTPSendEmail = async (obj) => {
  const transport = emailTransporter();
  const info = await transport.sendMail(passwordResetOTPsendTemplate(obj));
  return info.messageId;

};

//NOTIFY THE USER ABOUT UPDATING PROFILE
export const userProfileUpdateNotificationEmail = async (obj)=> {
   const transport = emailTransporter();
   const info = await transport.sendMail(userProfileUpdateNotificationTemplate(obj));
   return info.messageId
}