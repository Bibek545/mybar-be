import express from 'express';
import { createNewUser } from '../models/user/userModel.js';
import { activatUserController, createNewUserController, generateOTP, loginController, logoutUser, resetNewPass } from '../controllers/authController.js';
import { loginDataValidation, newUserDataValidation, resetPasswordValidation, userActivationDataValidation } from '../middleware/validation/authDataValidation.js';
import { renewAccessJWTMiddleware, userAuthMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router()


//Creating a user router

router.post('/register', newUserDataValidation,createNewUserController);

//activating a user
router.post('/activate-user',userActivationDataValidation, activatUserController)

//login the user
router.post('/login',loginDataValidation, loginController)

//renew-jwt
router.get("/renew-jwt", renewAccessJWTMiddleware)

//loging out the user 
router.get("/logout", userAuthMiddleware, logoutUser )

//receving the OTP
router.post("/otp", generateOTP)

//resetting the password
router.post("/reset-password",resetPasswordValidation, resetNewPass)


export default router;