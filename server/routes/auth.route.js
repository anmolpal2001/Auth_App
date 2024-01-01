import express from 'express';
import {signup, signin, google,signout, generateOtp, verifyOtp, resetPassword} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup',signup);
router.post('/signin',signin);
router.post('/google',google);
router.get('/signout',signout);
router.post('/getOtp',generateOtp);
router.post('/verifyOtp/:id/:token',verifyOtp);
router.post('/resetPassword/:id/:token',resetPassword)

export default router;