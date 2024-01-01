import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import dotenv from 'dotenv';
dotenv.config();

let nodeConfig = {
    host : process.env.MAIL_HOST,
    port : 587,
    secure : false,
    auth : {
        user : process.env.MAIL_USERNAME,
        pass : process.env.MAIL_PASSWORD
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


const sendingOtpMail = async (email,username,content) => {

    var emailContent = {
        body : {
            name : username,
            intro : 'Here is your OTP for resetting your password',
            outro : `OTP : ${content}`
        }
    }

    const emailBody = mailGenerator.generate(emailContent);

    let message = {
        from : process.env.MAIL_USERNAME,
        to : email,
        subject : 'Reset Password',
        html : emailBody
    }

    try{
        await transporter.sendMail(message);
        // res.status(200).json({
        //     success : true,
        //     message : 'Email sent successfully'
        // })
    }
    catch(err){
        console.log(err);
        // res.status(500).json({
        //     success : false,
        //     message : err.message
        // })
    }
}

const passwordResetMail = async (email,username,content) => {
    
        var emailContent = {
            body : {
                name : username,
                intro : 'Here is your new password for your account',
                outro : `Password : ${content}`
            }
        }
    
        const emailBody = mailGenerator.generate(emailContent);
    
        let message = {
            from : process.env.MAIL_USERNAME,
            to : email,
            subject : 'Password Reset Successfully',
            html : emailBody
        }
    
        try{
            await transporter.sendMail(message);
        }
        catch(err){
            console.log(err);
        }
    }

export  {sendingOtpMail,passwordResetMail};