import jwt from 'jsonwebtoken';
import { customError } from '../utils/error.js';
import dotenv from 'dotenv';
dotenv.config();

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if(!token) return res.status(401).json(customError(401, 'Access denied'));
    
    try{
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    }catch(err){
        return res.status(403).json(customError(403, 'Invalid token'));
    }
}