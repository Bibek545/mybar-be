import { getSession } from "../models/session/sessionModel.js";
import { getOneUser, getUserByEmail } from "../models/user/userModel.js";
import {
  createAccessJWT,
  verifyAccessJWT,
  verifyRefreshJWT,
} from "../utils/jwt.js";

import { responseClient } from "./responseClient.js";

export const userAuthMiddleware = async (req, res, next) => {
  //get accessJWT
  const { authorization } = req.headers;
  let message = "unauthorised";
  if (authorization) {
    const token = authorization.split(" ")[1];

    //check if valid

    const decoded = verifyAccessJWT(token);

    //check if the user exist in the session table
    if (decoded.email) {
      const tokenSession = await getSession({ token });
      if (tokenSession?._id) {
        //get user by email
        const user = await getUserByEmail(decoded.email);
        if (user?._id && user.status === "active") {
          //return the user
          req.userInfo = user;
          return next();
          //   return responseClient({
          //     req,
          //     res,
          //     message: "User profile",
          //     payload });
        }
      }
    }
    message = decoded === "jwt expired" ? decoded : "unauthorised";
  }
  //   const message = decoded === "jwt expired" ? decoded : "unauthorised"
  responseClient({ req, res, message, statusCode: 401 });
};

//check if the role is admin
export const adminAuthMiddleware = async (req, res, next) => {
  try {
    req.userInfo.role === "admin"
      ? next()
      : responseClient({
          req,
          res,
          message: "you do not have the access",
          statusCode: 403,
        });
  } catch (error) {
    next(error);
  }
};

// export const renewAccessJWTMiddleware = async (req, res, next) => {
//   //get accessJWT
//   console.log("AUTH HEADER:", req.headers.authorization);
//   console.log("DECODED:", decoded);
//   console.log("USER:", user);



//   const { authorization } = req.headers;
//   let message = "unauthorised user";
//   if (authorization) {
//     const token = authorization.split(" ")[1];

//     //check if valid
//    try {
//         const decoded = verifyRefreshJWT(token);

//     //check if the user exist in the session table
//     if (decoded.email) {
//       const user = await getOneUser({
//         email: decoded.email,
//         refreshJWT: token,
//       });

//       if (user?._id) {
//         // // create new accessJWT
//         const token = await createAccessJWT(decoded.email);
//         //   // RETURN ACCESSJWT
//         return responseClient({
//           req,
//           res,
//           message: "here is the accessJWT",
//           payload: token,
//         });
//       }
//     }
//    } catch (error) {
//      console.log("JWT verification error:", error.message);
//    }
//   } 

//   responseClient({ req, res, message, statusCode: 401 });
// };



export const renewAccessJWTMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;
  let message = "unauthorised user";

  if (authorization) {
    const refreshToken = authorization.split(" ")[1];

    try {
      // Verify the refresh token
      const decoded = verifyRefreshJWT(refreshToken);
      console.log("DECODED:", decoded);

      if (decoded?.email) {
        const user = await getOneUser({
          email: decoded.email,
          refreshJWT: refreshToken,
        });

        console.log("USER:", user);

        if (user?._id) {
          // Create a new access token
          const accessJWT = await createAccessJWT(decoded.email);

          return responseClient({
            req,
            res,
            message: "here is the accessJWT",
            payload: accessJWT,
          });
        }
      }
    } catch (error) {
      console.log("JWT verification error:", error.message);
    }
  }

  return responseClient({ req, res, message, statusCode: 401 });
};
