import express from 'express';
import { responseClient } from '../middleware/responseClient.js';
import { userAuthMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile',userAuthMiddleware, async (req, res)=> {
    const user = req.userInfo;
    user.password = undefined
    user._v -= undefined
    user.refreshJWT = undefined

    return responseClient({req, res, message: "User Profile", payload: user,});
});

export default router;