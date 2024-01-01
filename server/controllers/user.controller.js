import bcrypt from 'bcrypt';
import { customError } from '../utils/error.js';
import User from '../models/user.model.js';

const test = (req,res) => {
    res.send('Hello from user controller');
}

// update user
const updateUser = async (req,res,next) => {
    if(req.user.id !== req.params.id) return next(customError(401,'You can only update your account'));
    try{
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }
        const updatedFields = {};

        if (req.body.username) {
            const canUpdate = await User.find({ username: req.body.username });
            if(canUpdate.length > 0) return next(customError(409,'Username already taken'));
            updatedFields.username = req.body.username;
        }

        if (req.body.email) {
            const canUpdate = await User.find({ email: req.body.email });
            if(canUpdate.length > 0) return next(customError(409,'Email already exists'));
            updatedFields.email = req.body.email;
        }

        if (req.body.password) {
            updatedFields.password = req.body.password;
        }

        if (req.body.profilePicture) {
            updatedFields.profilePicture = req.body.profilePicture;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: updatedFields,
            },
            { new: true }
        );

        const {password,...rest} = updatedUser._doc;
        res.status(200).json({
            success: true,
            message: "User updated successfully",
            rest,
        });
    }
    catch(err){
        console.error('Error in updateUser:', err);
        next(err);
    }
}

const deleteUser = async (req,res,next) => {
    try
    {
        if(req.user.id !== req.params.id) return next(customError(401,'You can only delete your account'));
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if(!deletedUser) return next(customError(404,'User not found'));
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    }
    catch(err)
    {
        console.error('Error in deleteUser:', err);
        next(err);
    }
}

export {test, updateUser,deleteUser};