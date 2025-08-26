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
}

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