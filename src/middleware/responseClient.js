// export const responseClient = ({
//   req,
//   res,
//   message,
//   statusCode = 200,
//   payload,
// }) => {
//   //success response
//   req.success = () => {
//     return res.status(statusCode).json({
//       status: "success",
//       message,
//       payload,
//     });
//   };

//   //error response
//   req.error = () => {
//     return res.status(statusCode).json({
//       status: "error",
//       message,
//       payload,
//     });
//   };

//   if (statusCode >= 200 && statusCode < 300) {
//     return req.success();
//   } else {
//     return req.error();
//   }
// };


export const responseClient = (req, res, next) => {
  res.success = (message, payload = null, statusCode = 200) => {
    return res.status(statusCode).json({
      status: "success",
      message,
      payload,
    });
  };

  res.error = (message, statusCode = 400, payload = null) => {
    return res.status(statusCode).json({
      status: "error",
      message,
      payload,
    });
  };

  next();
};