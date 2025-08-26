import Joi from "joi";

export const FNAME = Joi.string().min(5);
export const FNAMEREQ = FNAME.required();

export const LNAME = Joi.string().min(5);
export const LNAMEREQ = LNAME.required();

export const EMAIL = Joi.string().email({ minDomainSegments: 2 });
export const EMAILREQ = EMAIL.required();

export const PASSWORD = Joi.string();
export const PASSWORDREQ = PASSWORD.required();

export const PHONE = Joi.number();
export const PHONEREQ = Joi.number().required();

export const SESSION = Joi.string().min(10).max(30);
export const SESSIONREQ = SESSION.required();

export const ROLE = Joi.string().valid("admin", "member", "staff").default("member");


export const TOKEN = Joi.string().min(10).max(40);
export const TOKENREQ = TOKEN.required();

export const OTP = Joi.number().min(4).required();

//for the books

export const SHORT_STR = Joi.string().min(1).max(100);
export const SHORT_STR_REQ = SHORT_STR.required();

export const LONG_STR = Joi.string().min(1).max(50000).required();
export const LONG_STR_REQ = LONG_STR.required();

export const PUBLISHED_YEAR = Joi.number()
  .integer()
  .min(1901)
  .max(new Date().getFullYear());
export const PUBLISHED_YEAR_REQ = PUBLISHED_YEAR.required();


export const ISBN = Joi.number().integer().min(1000000000).max(9999999999999);
export const ISBN_REQ = ISBN.required();