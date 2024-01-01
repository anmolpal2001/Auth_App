import mongoose, { mongo } from "mongoose";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
import Mailgen from "mailgen";

const userSchema = new mongoose.Schema({
    username:{
        type : String,
        required : true,
        unique : true,
    },
    email:{
        type : String,
        required : true,
        unique : true,
    },
    password:{
        type : String,
        required : true,
    },
    profilePicture:{
        type : String,
        default : 'https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg',
    },
},{
    timestamps : true,
});


userSchema.post('save', async function(doc){
    try{
        // transporter
        let nodeConfig = {
            host : process.env.MAIL_HOST,
            // port : 587,
            secure : false,
            auth : {
                user : process.env.MAIL_USERNAME,
                pass : process.env.MAIL_PASSWORD,
            }
        }
        let transporter = nodemailer.createTransport(nodeConfig);

        const mailGenerator = new Mailgen({
            theme : 'default',
            product : {
                name : 'Mailgen',
                link : 'https://mailgen.js'
            }
        });

        var emailContent = {
            body : {
                name : doc.username,
                intro : 'Welcome to Auth App, thanks for signing up',
                outro : 'Need help, or have questions? Just reply to this email, we\'d love to help.'
            }
        }
        const emailBody = mailGenerator.generate(emailContent);
        var emailText = mailGenerator.generatePlaintext(emailContent);

        let message = {
            from : `${process.env.MAIL_USER}`,
            to : doc.email,
            subject : 'Sign Up Scuccessful',
            html : emailBody
        }
        // send mail
        let info = await transporter.sendMail(message);
        // let info = await transporter.sendMail({
        //     from : `${process.env.MAIL_USER}`,
        //     to : doc.email,
        //     subject : "Sign Up Scuccessful",
        //     html : `<h1>Hello ${doc.username}</h1> <h2>Welcome to Auth App, thanks for signing up</h2> <p>Need help, or have questions? Just reply to this email, we\'d love to help.</p>`
        // })
        console.log(info);
        // console.log(info);
    }
    catch(error)
    {
        console.log(error);
    }
})


const User = mongoose.model("User", userSchema);

export default User;