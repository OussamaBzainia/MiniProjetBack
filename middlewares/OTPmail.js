import nodemailer from 'nodemailer';
import dotenv  from 'dotenv';
dotenv.config();


    
  const transporter = nodemailer.createTransport(
    {
        service: process.env.SERVICE,
        auth: {
          user: process.env.USER,
          pass: process.env.PASS,
        }
      }
  );

   const  sendMailOTP = async (email,text) => {
    try {
        await transporter.sendMail({
        from: process.env.USER,
        to: email, 
        subject: 'Hello ✔',
        html: `
        <div
          class="container"
          style="max-width: 90%; margin: auto; padding-top: 20px"
        >
          <h2>Welcome to Aestetica.</h2>
          <h4>You are officially In ✔</h4>
          <p style="margin-bottom: 30px;">Pleas enter the sign up OTP to get started</p>
          <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${text}</h1>
     </div>
      `,
      });
      console.log("email sent sucessfully");
    }
    
    catch (error) {
      console.log(error);
    }
  };

  export default sendMailOTP